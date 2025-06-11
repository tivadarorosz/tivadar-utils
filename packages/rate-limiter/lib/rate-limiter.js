/**
 * Rate limiting utility for distributed systems
 * Platform-agnostic implementation that works with any KV-like storage
 */

class RateLimiter {
  constructor(kv, options = {}) {
    this.kv = kv;
    this.options = {
      windowMs: options.windowMs || 60000, // Default: 1 minute
      max: options.max || 5, // Default: 5 requests per window
      keyPrefix: options.keyPrefix || 'rl:', // Key prefix in KV
      includeHeaders: options.includeHeaders !== false, // Default: true
      skipSuccessfulRequests: options.skipSuccessfulRequests || false,
      skipFailedRequests: options.skipFailedRequests || false,
      ...options
    };
  }

  /**
   * Generate a rate limit key
   * @param {string} identifier - IP address, email, or other identifier
   * @param {string} suffix - Optional suffix for different limit types
   */
  getKey(identifier, suffix = '') {
    const key = `${this.options.keyPrefix}${identifier}${suffix ? ':' + suffix : ''}`;
    return key;
  }

  /**
   * Check if request should be rate limited
   * @param {string} identifier - The identifier to rate limit (IP, email, etc.)
   * @param {number} cost - The cost of this request (default: 1)
   * @returns {Promise<{limited: boolean, limit: number, remaining: number, reset: Date}>}
   */
  async check(identifier, cost = 1) {
    // If no KV store is available (e.g., local development), skip rate limiting
    if (!this.kv) {
      console.warn('Rate limiter: No KV store available, skipping rate limit check');
      return {
        limited: false,
        limit: this.options.max,
        remaining: this.options.max,
        reset: new Date(Date.now() + this.options.windowMs)
      };
    }

    const key = this.getKey(identifier);
    const now = Date.now();
    const window = Math.floor(now / this.options.windowMs);
    const resetTime = (window + 1) * this.options.windowMs;
    
    try {
      // Get current count for this window
      const storageKey = `${key}:${window}`;
      const currentCount = parseInt(await this.kv.get(storageKey) || '0', 10);
      
      if (currentCount >= this.options.max) {
        return {
          limited: true,
          limit: this.options.max,
          remaining: 0,
          reset: new Date(resetTime)
        };
      }
      
      // Increment counter
      const newCount = currentCount + cost;
      await this.kv.put(storageKey, newCount.toString(), {
        expiration: Math.floor(resetTime / 1000) + 60 // Add 60s buffer
      });
      
      return {
        limited: false,
        limit: this.options.max,
        remaining: Math.max(0, this.options.max - newCount),
        reset: new Date(resetTime)
      };
    } catch (error) {
      console.error('Rate limit check error:', error);
      // Fail open - don't block requests if rate limiting fails
      return {
        limited: false,
        limit: this.options.max,
        remaining: this.options.max,
        reset: new Date(resetTime)
      };
    }
  }

  /**
   * Reset rate limit for an identifier
   * @param {string} identifier - The identifier to reset
   */
  async reset(identifier) {
    // If no KV store is available, skip reset
    if (!this.kv) {
      return;
    }

    const key = this.getKey(identifier);
    const window = Math.floor(Date.now() / this.options.windowMs);
    const storageKey = `${key}:${window}`;
    
    try {
      await this.kv.delete(storageKey);
    } catch (error) {
      console.error('Rate limit reset error:', error);
    }
  }

  /**
   * Create rate limit headers for response
   * @param {Object} checkResult - Result from check() method
   * @returns {Object} Headers object
   */
  getHeaders(checkResult) {
    if (!this.options.includeHeaders) {
      return {};
    }

    return {
      'X-RateLimit-Limit': checkResult.limit.toString(),
      'X-RateLimit-Remaining': checkResult.remaining.toString(),
      'X-RateLimit-Reset': checkResult.reset.toISOString(),
      'Retry-After': checkResult.limited ? 
        Math.ceil((checkResult.reset.getTime() - Date.now()) / 1000).toString() : 
        undefined
    };
  }

  /**
   * Create a rate limited response
   * @param {Object} checkResult - Result from check() method
   * @returns {Response} Rate limit error response
   */
  getLimitedResponse(checkResult) {
    const headers = {
      'Content-Type': 'application/json',
      ...this.getHeaders(checkResult)
    };

    // Remove undefined headers
    Object.keys(headers).forEach(key => 
      headers[key] === undefined && delete headers[key]
    );

    const retryAfter = Math.ceil((checkResult.reset.getTime() - Date.now()) / 1000);
    
    return new Response(JSON.stringify({
      error: 'Too many requests',
      message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
      retryAfter: retryAfter
    }), {
      status: 429,
      headers
    });
  }
}

module.exports = RateLimiter;