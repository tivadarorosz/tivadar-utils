/**
 * @tivadar/rate-limiter
 * Rate limiting utilities for Cloudflare Workers and KV storage
 */

const RateLimiter = require('./lib/rate-limiter');
const MultiRateLimiter = require('./lib/multi-rate-limiter');
const {
  createRateLimitMiddleware,
  createMultiRateLimitMiddleware,
  createConditionalRateLimitMiddleware,
  createKeyGenerator
} = require('./lib/middleware');

// Export everything
module.exports = {
  RateLimiter,
  MultiRateLimiter,
  createRateLimitMiddleware,
  createMultiRateLimitMiddleware,
  createConditionalRateLimitMiddleware,
  createKeyGenerator
};

// Also export as named exports for better tree-shaking
module.exports.RateLimiter = RateLimiter;
module.exports.MultiRateLimiter = MultiRateLimiter;
module.exports.createRateLimitMiddleware = createRateLimitMiddleware;
module.exports.createMultiRateLimitMiddleware = createMultiRateLimitMiddleware;
module.exports.createConditionalRateLimitMiddleware = createConditionalRateLimitMiddleware;
module.exports.createKeyGenerator = createKeyGenerator;