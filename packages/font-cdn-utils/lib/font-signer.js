"use strict";
/**
 * Font CDN Signer
 * Clean implementation for signing font URLs with BunnyCDN token authentication
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FontCDNSigner = void 0;
exports.createFontSigner = createFontSigner;
const crypto = __importStar(require("crypto"));
class FontCDNSigner {
    constructor(config) {
        this.config = {
            expiry: 31536000, // Default 1 year
            ...config,
        };
    }
    /**
     * Sign a font URL with BunnyCDN token authentication
     * @param fontPath - The font path (e.g., '/fonts/StyreneA-Bold-Web.woff2')
     * @param options - Optional signing options
     * @returns The signed URL
     */
    signFont(fontPath, options = {}) {
        // Ensure path starts with /
        const normalizedPath = fontPath.startsWith('/') ? fontPath : '/' + fontPath;
        // Build full URL
        const url = new URL(normalizedPath, this.config.fontDomain);
        // Calculate expiry
        const expiry = Math.floor(Date.now() / 1000) + (options.expiry || this.config.expiry || 31536000);
        // Generate token
        const token = this.generateToken(url.pathname, expiry);
        // Add token and expiry to URL
        url.searchParams.set('token', token);
        url.searchParams.set('expires', expiry.toString());
        return url.toString();
    }
    /**
     * Sign a font URL asynchronously (for Cloudflare Workers)
     * @param fontPath - The font path
     * @param options - Optional signing options
     * @returns Promise resolving to the signed URL
     */
    async signFontAsync(fontPath, options = {}) {
        // Ensure path starts with /
        const normalizedPath = fontPath.startsWith('/') ? fontPath : '/' + fontPath;
        // Build full URL
        const url = new URL(normalizedPath, this.config.fontDomain);
        // Calculate expiry
        const expiry = Math.floor(Date.now() / 1000) + (options.expiry || this.config.expiry || 31536000);
        // Generate token
        const token = await this.generateTokenAsync(url.pathname, expiry);
        // Add token and expiry to URL
        url.searchParams.set('token', token);
        url.searchParams.set('expires', expiry.toString());
        return url.toString();
    }
    /**
     * Generate BunnyCDN authentication token (Node.js)
     */
    generateToken(path, expiry) {
        const hashInput = this.config.fontsAuthKey + path + expiry;
        return crypto
            .createHash('sha256')
            .update(hashInput)
            .digest('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }
    /**
     * Generate BunnyCDN authentication token (Cloudflare Workers)
     */
    async generateTokenAsync(path, expiry) {
        const hashInput = this.config.fontsAuthKey + path + expiry;
        const encoder = new TextEncoder();
        const data = encoder.encode(hashInput);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return btoa(String.fromCharCode(...hashArray))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }
}
exports.FontCDNSigner = FontCDNSigner;
/**
 * Factory function to create a font signer instance
 */
function createFontSigner(config) {
    return new FontCDNSigner(config);
}
//# sourceMappingURL=font-signer.js.map