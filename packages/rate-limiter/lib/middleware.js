/**
 * Middleware helpers for easy rate limiter integration
 */

const RateLimiter = require('./rate-limiter');
const MultiRateLimiter = require('./multi-rate-limiter');

/**
 * Create a rate limiting middleware for Cloudflare Workers
 * @param {Object} kv - KV namespace binding
 * @param {Object} options - Rate limiter options
 * @returns {Function} Middleware function
 */
function createRateLimitMiddleware(kv, options = {}) {
  const limiter = new RateLimiter(kv, options);
  
  return async function rateLimitMiddleware(request, env, ctx, next) {
    // Extract identifier (default to IP)
    const identifier = options.keyGenerator ? 
      await options.keyGenerator(request, env, ctx) :
      request.headers.get('CF-Connecting-IP') || 
      request.headers.get('X-Forwarded-For') || 
      'unknown';
    
    const result = await limiter.check(identifier);
    
    if (result.limited) {
      return limiter.getLimitedResponse(result);
    }
    
    // Add headers to response
    const response = await next(request, env, ctx);
    const headers = limiter.getHeaders(result);
    
    Object.entries(headers).forEach(([key, value]) => {
      if (value !== undefined) {
        response.headers.set(key, value);
      }
    });
    
    return response;
  };
}

/**
 * Create a multi-rate limiting middleware
 * @param {Object} kv - KV namespace binding
 * @param {Object} config - Configuration object
 * @param {Object} config.limiters - Map of limiter configurations
 * @param {Function} config.identifierExtractor - Function to extract identifiers
 * @returns {Function} Middleware function
 */
function createMultiRateLimitMiddleware(kv, config = {}) {
  const multiLimiter = new MultiRateLimiter(kv);
  
  // Configure limiters
  if (config.limiters) {
    Object.entries(config.limiters).forEach(([name, options]) => {
      multiLimiter.addLimiter(name, options);
    });
  }
  
  return async function multiRateLimitMiddleware(request, env, ctx, next) {
    // Extract identifiers
    const identifiers = config.identifierExtractor ? 
      await config.identifierExtractor(request, env, ctx) :
      {
        ip: request.headers.get('CF-Connecting-IP') || 'unknown'
      };
    
    const { limited, results } = await multiLimiter.checkAll(identifiers);
    
    if (limited) {
      return multiLimiter.getLimitedResponse(results);
    }
    
    // Add headers to response
    const response = await next(request, env, ctx);
    const headers = multiLimiter.getCombinedHeaders(results);
    
    Object.entries(headers).forEach(([key, value]) => {
      if (value !== undefined) {
        response.headers.set(key, value);
      }
    });
    
    return response;
  };
}

/**
 * Create a conditional rate limiter that only applies to certain paths
 * @param {Object} kv - KV namespace binding
 * @param {Object} options - Rate limiter options
 * @param {Function|RegExp|string} condition - Condition to check
 * @returns {Function} Middleware function
 */
function createConditionalRateLimitMiddleware(kv, options = {}, condition) {
  const middleware = createRateLimitMiddleware(kv, options);
  
  return async function conditionalRateLimitMiddleware(request, env, ctx, next) {
    let shouldApply = false;
    
    if (typeof condition === 'function') {
      shouldApply = await condition(request, env, ctx);
    } else if (condition instanceof RegExp) {
      const url = new URL(request.url);
      shouldApply = condition.test(url.pathname);
    } else if (typeof condition === 'string') {
      const url = new URL(request.url);
      shouldApply = url.pathname.startsWith(condition);
    }
    
    if (shouldApply) {
      return middleware(request, env, ctx, next);
    }
    
    return next(request, env, ctx);
  };
}

/**
 * Helper to create a key generator based on multiple fields
 * @param {string[]} fields - Fields to include in the key
 * @returns {Function} Key generator function
 */
function createKeyGenerator(fields = ['ip']) {
  return async function keyGenerator(request, env, ctx) {
    const parts = [];
    
    for (const field of fields) {
      switch (field) {
        case 'ip':
          parts.push(request.headers.get('CF-Connecting-IP') || 'unknown');
          break;
        case 'user':
          // Extract from JWT or session if available
          if (ctx.user) {
            parts.push(ctx.user.id || ctx.user.email || 'anonymous');
          }
          break;
        case 'path':
          const url = new URL(request.url);
          parts.push(url.pathname);
          break;
        case 'method':
          parts.push(request.method);
          break;
        default:
          // Custom field from context
          if (ctx[field]) {
            parts.push(ctx[field]);
          }
      }
    }
    
    return parts.filter(Boolean).join(':');
  };
}

module.exports = {
  createRateLimitMiddleware,
  createMultiRateLimitMiddleware,
  createConditionalRateLimitMiddleware,
  createKeyGenerator
};