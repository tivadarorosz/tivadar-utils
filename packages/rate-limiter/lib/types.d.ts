/**
 * TypeScript definitions for @tivadar/rate-limiter
 */

export interface RateLimiterOptions {
  /** Time window in milliseconds (default: 60000) */
  windowMs?: number;
  /** Maximum number of requests per window (default: 5) */
  max?: number;
  /** Key prefix in KV storage (default: 'rl:') */
  keyPrefix?: string;
  /** Whether to include rate limit headers in responses (default: true) */
  includeHeaders?: boolean;
  /** Skip counting successful requests (default: false) */
  skipSuccessfulRequests?: boolean;
  /** Skip counting failed requests (default: false) */
  skipFailedRequests?: boolean;
  /** Custom key generator function */
  keyGenerator?: (request: Request, env: any, ctx: any) => string | Promise<string>;
}

export interface RateLimitResult {
  /** Whether the request is rate limited */
  limited: boolean;
  /** The maximum number of requests allowed */
  limit: number;
  /** The number of requests remaining */
  remaining: number;
  /** When the rate limit window resets */
  reset: Date;
}

export interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expiration?: number }): Promise<void>;
  delete(key: string): Promise<void>;
}

export declare class RateLimiter {
  constructor(kv: KVNamespace, options?: RateLimiterOptions);
  
  /** Check if request should be rate limited */
  check(identifier: string, cost?: number): Promise<RateLimitResult>;
  
  /** Reset rate limit for an identifier */
  reset(identifier: string): Promise<void>;
  
  /** Get rate limit headers */
  getHeaders(checkResult: RateLimitResult): Record<string, string | undefined>;
  
  /** Create a rate limited response */
  getLimitedResponse(checkResult: RateLimitResult): Response;
  
  /** Generate a rate limit key */
  getKey(identifier: string, suffix?: string): string;
}

export declare class MultiRateLimiter {
  constructor(kv: KVNamespace);
  
  /** Add a rate limiter configuration */
  addLimiter(name: string, options: RateLimiterOptions): MultiRateLimiter;
  
  /** Get a specific limiter by name */
  getLimiter(name: string): RateLimiter | undefined;
  
  /** Check all configured rate limiters */
  checkAll(identifiers: Record<string, string>): Promise<{
    limited: boolean;
    results: Map<string, RateLimitResult>;
  }>;
  
  /** Check specific limiters */
  checkSpecific(identifiers: Record<string, string>, limiterNames: string[]): Promise<{
    limited: boolean;
    results: Map<string, RateLimitResult>;
  }>;
  
  /** Reset rate limits for specific identifiers */
  resetAll(identifiers: Record<string, string>): Promise<void>;
  
  /** Get the most restrictive rate limit response */
  getLimitedResponse(results: Map<string, RateLimitResult>): Response;
  
  /** Get combined headers from all results */
  getCombinedHeaders(results: Map<string, RateLimitResult>): Record<string, string>;
}

export interface MiddlewareFunction {
  (request: Request, env: any, ctx: any, next: (request: Request, env: any, ctx: any) => Promise<Response>): Promise<Response>;
}

export interface MultiRateLimitConfig {
  /** Map of limiter configurations */
  limiters?: Record<string, RateLimiterOptions>;
  /** Function to extract identifiers from request */
  identifierExtractor?: (request: Request, env: any, ctx: any) => Record<string, string> | Promise<Record<string, string>>;
}

/** Create a rate limiting middleware */
export declare function createRateLimitMiddleware(kv: KVNamespace, options?: RateLimiterOptions): MiddlewareFunction;

/** Create a multi-rate limiting middleware */
export declare function createMultiRateLimitMiddleware(kv: KVNamespace, config?: MultiRateLimitConfig): MiddlewareFunction;

/** Create a conditional rate limiter */
export declare function createConditionalRateLimitMiddleware(
  kv: KVNamespace, 
  options: RateLimiterOptions, 
  condition: ((request: Request, env: any, ctx: any) => boolean | Promise<boolean>) | RegExp | string
): MiddlewareFunction;

/** Create a key generator based on multiple fields */
export declare function createKeyGenerator(fields?: Array<'ip' | 'user' | 'path' | 'method' | string>): (request: Request, env: any, ctx: any) => string | Promise<string>;