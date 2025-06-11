/**
 * Multiple rate limiters with different configurations
 * Useful for implementing different limits per IP and per resource
 */

const RateLimiter = require('./rate-limiter');

class MultiRateLimiter {
  constructor(kv) {
    this.kv = kv;
    this.limiters = new Map();
  }

  /**
   * Add a rate limiter configuration
   * @param {string} name - Name of the limiter
   * @param {Object} options - RateLimiter options
   * @returns {MultiRateLimiter} Returns self for chaining
   */
  addLimiter(name, options) {
    this.limiters.set(name, new RateLimiter(this.kv, {
      ...options,
      keyPrefix: `rl:${name}:`
    }));
    return this;
  }

  /**
   * Get a specific limiter by name
   * @param {string} name - Name of the limiter
   * @returns {RateLimiter|undefined} The rate limiter instance
   */
  getLimiter(name) {
    return this.limiters.get(name);
  }

  /**
   * Check all configured rate limiters
   * @param {Object} identifiers - Map of limiter name to identifier
   * @returns {Promise<{limited: boolean, results: Map<string, Object>}>}
   */
  async checkAll(identifiers) {
    const results = new Map();
    let limited = false;

    for (const [name, limiter] of this.limiters) {
      const identifier = identifiers[name];
      if (identifier) {
        const result = await limiter.check(identifier);
        results.set(name, result);
        if (result.limited) {
          limited = true;
        }
      }
    }

    return { limited, results };
  }

  /**
   * Check specific limiters
   * @param {Object} identifiers - Map of limiter name to identifier
   * @param {string[]} limiterNames - Names of limiters to check
   * @returns {Promise<{limited: boolean, results: Map<string, Object>}>}
   */
  async checkSpecific(identifiers, limiterNames) {
    const results = new Map();
    let limited = false;

    for (const name of limiterNames) {
      const limiter = this.limiters.get(name);
      const identifier = identifiers[name];
      
      if (limiter && identifier) {
        const result = await limiter.check(identifier);
        results.set(name, result);
        if (result.limited) {
          limited = true;
        }
      }
    }

    return { limited, results };
  }

  /**
   * Reset rate limits for specific identifiers
   * @param {Object} identifiers - Map of limiter name to identifier
   */
  async resetAll(identifiers) {
    const promises = [];
    
    for (const [name, limiter] of this.limiters) {
      const identifier = identifiers[name];
      if (identifier) {
        promises.push(limiter.reset(identifier));
      }
    }
    
    await Promise.all(promises);
  }

  /**
   * Get the most restrictive rate limit response
   * @param {Map<string, Object>} results - Results from checkAll()
   * @returns {Response} Rate limit error response
   */
  getLimitedResponse(results) {
    let mostRestrictive = null;
    let lowestReset = Infinity;

    for (const [name, result] of results) {
      if (result.limited && result.reset.getTime() < lowestReset) {
        lowestReset = result.reset.getTime();
        mostRestrictive = { name, result };
      }
    }

    if (mostRestrictive) {
      const limiter = this.limiters.get(mostRestrictive.name);
      return limiter.getLimitedResponse(mostRestrictive.result);
    }

    // Fallback response
    return new Response(JSON.stringify({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.'
    }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  /**
   * Get combined headers from all results
   * @param {Map<string, Object>} results - Results from checkAll()
   * @returns {Object} Combined headers object
   */
  getCombinedHeaders(results) {
    const headers = {};
    
    // Find the most restrictive limits
    let lowestRemaining = Infinity;
    let soonestReset = null;
    let isLimited = false;
    
    for (const [name, result] of results) {
      if (result.remaining < lowestRemaining) {
        lowestRemaining = result.remaining;
      }
      if (!soonestReset || result.reset < soonestReset) {
        soonestReset = result.reset;
      }
      if (result.limited) {
        isLimited = true;
      }
    }
    
    if (soonestReset) {
      headers['X-RateLimit-Remaining'] = lowestRemaining.toString();
      headers['X-RateLimit-Reset'] = soonestReset.toISOString();
      
      if (isLimited) {
        headers['Retry-After'] = Math.ceil((soonestReset.getTime() - Date.now()) / 1000).toString();
      }
    }
    
    return headers;
  }
}

module.exports = MultiRateLimiter;