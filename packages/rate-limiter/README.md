# @tivadar/rate-limiter

A flexible, distributed rate limiting library for Cloudflare Workers and other KV-based storage systems. This package provides an easy-to-use API for implementing rate limiting in your applications with support for multiple limiters, middleware integration, and TypeScript.

## Features

- 🚀 **Simple API** - Easy to integrate rate limiting with just a few lines of code
- 🌍 **Distributed** - Works across multiple edge locations using KV storage
- 🔧 **Flexible** - Multiple rate limiters with different configurations
- 🛡️ **Type Safe** - Full TypeScript support with type definitions
- ⚡ **Middleware Ready** - Pre-built middleware for common use cases
- 🎯 **Configurable** - Customizable time windows, limits, and key generation

## Installation

```bash
npm install @tivadar/rate-limiter
```

Or with a Git dependency:

```json
{
  "dependencies": {
    "@tivadar/rate-limiter": "git+https://github.com/tivadarorosz/tivadar-utils.git#main"
  }
}
```

## Quick Start

### Basic Usage

```javascript
import { RateLimiter } from '@tivadar/rate-limiter';

// In your Cloudflare Worker
export default {
  async fetch(request, env) {
    const limiter = new RateLimiter(env.RATE_LIMIT_KV, {
      windowMs: 60000,  // 1 minute
      max: 10           // 10 requests per minute
    });

    const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
    const result = await limiter.check(clientIP);

    if (result.limited) {
      return limiter.getLimitedResponse(result);
    }

    // Process the request
    return new Response('Success!');
  }
};
```

### Using Middleware

```javascript
import { createRateLimitMiddleware } from '@tivadar/rate-limiter';

// Create middleware
const rateLimitMiddleware = createRateLimitMiddleware(env.RATE_LIMIT_KV, {
  windowMs: 60000,
  max: 10
});

// Use in your application
export default {
  async fetch(request, env, ctx) {
    return rateLimitMiddleware(request, env, ctx, async () => {
      // Your application logic here
      return new Response('Success!');
    });
  }
};
```

### Multiple Rate Limiters

```javascript
import { MultiRateLimiter } from '@tivadar/rate-limiter';

const multiLimiter = new MultiRateLimiter(env.RATE_LIMIT_KV)
  .addLimiter('global', { windowMs: 60000, max: 100 })      // 100 req/min globally
  .addLimiter('strict', { windowMs: 60000, max: 10 })       // 10 req/min for specific endpoints
  .addLimiter('daily', { windowMs: 86400000, max: 1000 });  // 1000 req/day

const { limited, results } = await multiLimiter.checkAll({
  global: clientIP,
  strict: `${clientIP}:${request.url}`,
  daily: userEmail
});

if (limited) {
  return multiLimiter.getLimitedResponse(results);
}
```

## API Reference

### RateLimiter

The main rate limiting class.

```typescript
new RateLimiter(kv: KVNamespace, options?: RateLimiterOptions)
```

#### Options

- `windowMs` (number): Time window in milliseconds (default: 60000)
- `max` (number): Maximum requests per window (default: 5)
- `keyPrefix` (string): Prefix for KV storage keys (default: 'rl:')
- `includeHeaders` (boolean): Include rate limit headers in responses (default: true)
- `skipSuccessfulRequests` (boolean): Don't count successful requests (default: false)
- `skipFailedRequests` (boolean): Don't count failed requests (default: false)
- `keyGenerator` (function): Custom function to generate rate limit keys

#### Methods

##### check(identifier: string, cost?: number): Promise<RateLimitResult>

Check if a request should be rate limited.

```javascript
const result = await limiter.check('user-123', 1);
// Returns: { limited: false, limit: 10, remaining: 9, reset: Date }
```

##### reset(identifier: string): Promise<void>

Reset the rate limit for an identifier.

```javascript
await limiter.reset('user-123');
```

##### getHeaders(result: RateLimitResult): object

Get rate limit headers for a response.

```javascript
const headers = limiter.getHeaders(result);
// Returns: { 'X-RateLimit-Limit': '10', 'X-RateLimit-Remaining': '9', ... }
```

##### getLimitedResponse(result: RateLimitResult): Response

Create a 429 response with rate limit information.

```javascript
return limiter.getLimitedResponse(result);
```

### MultiRateLimiter

Manage multiple rate limiters with different configurations.

```typescript
new MultiRateLimiter(kv: KVNamespace)
```

#### Methods

##### addLimiter(name: string, options: RateLimiterOptions): MultiRateLimiter

Add a named rate limiter configuration.

```javascript
multiLimiter
  .addLimiter('api', { windowMs: 60000, max: 100 })
  .addLimiter('auth', { windowMs: 300000, max: 5 });
```

##### checkAll(identifiers: object): Promise<{ limited: boolean, results: Map }>

Check all configured limiters.

```javascript
const { limited, results } = await multiLimiter.checkAll({
  api: clientIP,
  auth: userEmail
});
```

### Middleware Helpers

#### createRateLimitMiddleware

Create a simple rate limiting middleware.

```javascript
const middleware = createRateLimitMiddleware(kv, {
  windowMs: 60000,
  max: 10,
  keyGenerator: (request) => request.headers.get('CF-Connecting-IP')
});
```

#### createMultiRateLimitMiddleware

Create middleware with multiple rate limiters.

```javascript
const middleware = createMultiRateLimitMiddleware(kv, {
  limiters: {
    ip: { windowMs: 60000, max: 100 },
    user: { windowMs: 60000, max: 10 }
  },
  identifierExtractor: async (request, env, ctx) => ({
    ip: request.headers.get('CF-Connecting-IP'),
    user: ctx.user?.id
  })
});
```

#### createConditionalRateLimitMiddleware

Apply rate limiting only to specific routes.

```javascript
// Apply to /api/* routes only
const middleware = createConditionalRateLimitMiddleware(
  kv,
  { windowMs: 60000, max: 10 },
  /^\/api\//
);

// Or use a function
const middleware = createConditionalRateLimitMiddleware(
  kv,
  { windowMs: 60000, max: 10 },
  (request) => request.method === 'POST'
);
```

## Advanced Examples

### Custom Key Generation

```javascript
import { createKeyGenerator } from '@tivadar/rate-limiter';

const limiter = new RateLimiter(kv, {
  keyGenerator: createKeyGenerator(['ip', 'path', 'method'])
});

// Or create your own
const limiter = new RateLimiter(kv, {
  keyGenerator: async (request, env, ctx) => {
    const user = await getUserFromRequest(request);
    return `user:${user.id}:${request.method}`;
  }
});
```

### Different Limits for Different Endpoints

```javascript
const multiLimiter = new MultiRateLimiter(kv)
  .addLimiter('read', { windowMs: 60000, max: 100 })
  .addLimiter('write', { windowMs: 60000, max: 10 })
  .addLimiter('delete', { windowMs: 60000, max: 5 });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method;
    const ip = request.headers.get('CF-Connecting-IP');

    let limiterName = 'read';
    if (method === 'POST' || method === 'PUT') limiterName = 'write';
    if (method === 'DELETE') limiterName = 'delete';

    const { limited, results } = await multiLimiter.checkSpecific(
      { [limiterName]: ip },
      [limiterName]
    );

    if (limited) {
      return multiLimiter.getLimitedResponse(results);
    }

    // Process request
    return handleRequest(request);
  }
};
```

### Rate Limiting with User Authentication

```javascript
const middleware = createMultiRateLimitMiddleware(kv, {
  limiters: {
    anonymous: { windowMs: 60000, max: 10 },
    authenticated: { windowMs: 60000, max: 100 },
    api: { windowMs: 60000, max: 1000 }
  },
  identifierExtractor: async (request, env, ctx) => {
    const token = request.headers.get('Authorization');
    const user = token ? await validateToken(token) : null;

    if (user?.plan === 'pro') {
      return { api: user.id };
    } else if (user) {
      return { authenticated: user.id };
    } else {
      return { anonymous: request.headers.get('CF-Connecting-IP') };
    }
  }
});
```

## Response Headers

The rate limiter automatically adds these headers to responses:

- `X-RateLimit-Limit`: The maximum number of requests allowed
- `X-RateLimit-Remaining`: The number of requests remaining
- `X-RateLimit-Reset`: ISO 8601 timestamp when the limit resets
- `Retry-After`: Seconds until the limit resets (only on 429 responses)

## Error Handling

The rate limiter is designed to "fail open" - if KV storage is unavailable or an error occurs, requests will be allowed through rather than blocked. Errors are logged to the console.

## Development & Testing

```bash
# Clone the repository
git clone https://github.com/tivadarorosz/tivadar-utils.git
cd tivadar-utils/packages/rate-limiter

# Install dependencies
npm install

# Run tests (when available)
npm test
```

## License

Private - All rights reserved