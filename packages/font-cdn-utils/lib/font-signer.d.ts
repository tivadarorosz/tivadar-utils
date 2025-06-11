/**
 * Font CDN Signer
 * Clean implementation for signing font URLs with BunnyCDN token authentication
 */
import { FontCDNConfig, FontSignerOptions } from './types';
export declare class FontCDNSigner {
    private config;
    constructor(config: FontCDNConfig);
    /**
     * Sign a font URL with BunnyCDN token authentication
     * @param fontPath - The font path (e.g., '/fonts/StyreneA-Bold-Web.woff2')
     * @param options - Optional signing options
     * @returns The signed URL
     */
    signFont(fontPath: string, options?: FontSignerOptions): string;
    /**
     * Sign a font URL asynchronously (for Cloudflare Workers)
     * @param fontPath - The font path
     * @param options - Optional signing options
     * @returns Promise resolving to the signed URL
     */
    signFontAsync(fontPath: string, options?: FontSignerOptions): Promise<string>;
    /**
     * Generate BunnyCDN authentication token (Node.js)
     */
    private generateToken;
    /**
     * Generate BunnyCDN authentication token (Cloudflare Workers)
     */
    private generateTokenAsync;
}
/**
 * Factory function to create a font signer instance
 */
export declare function createFontSigner(config: FontCDNConfig): FontCDNSigner;
//# sourceMappingURL=font-signer.d.ts.map