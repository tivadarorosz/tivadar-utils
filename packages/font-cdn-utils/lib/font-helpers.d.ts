/**
 * Font Helpers
 * Utilities for generating @font-face CSS and preload tags
 */
import { FontConfig, FontPreloadOptions } from './types';
import { FontCDNSigner } from './font-signer';
/**
 * Generate @font-face CSS declaration with signed URLs
 */
export declare function generateFontFace(font: FontConfig, signer: FontCDNSigner): string;
/**
 * Generate @font-face CSS asynchronously (for Cloudflare Workers)
 */
export declare function generateFontFaceAsync(font: FontConfig, signer: FontCDNSigner): Promise<string>;
/**
 * Generate font preload link tag
 * IMPORTANT: No crossorigin attribute to avoid BunnyCDN referrer issues
 */
export declare function generateFontPreload(font: FontConfig, signer: FontCDNSigner, options?: FontPreloadOptions): string | null;
/**
 * Generate font preload link tag asynchronously
 */
export declare function generateFontPreloadAsync(font: FontConfig, signer: FontCDNSigner, options?: FontPreloadOptions): Promise<string | null>;
/**
 * Generate all font preload tags for a list of fonts
 */
export declare function generateFontPreloads(fonts: FontConfig[], signer: FontCDNSigner, options?: FontPreloadOptions): string[];
/**
 * Generate all font preload tags asynchronously
 */
export declare function generateFontPreloadsAsync(fonts: FontConfig[], signer: FontCDNSigner, options?: FontPreloadOptions): Promise<string[]>;
/**
 * Generate complete CSS for all fonts
 */
export declare function generateAllFontFaces(fonts: FontConfig[], signer: FontCDNSigner): string;
/**
 * Generate complete CSS for all fonts asynchronously
 */
export declare function generateAllFontFacesAsync(fonts: FontConfig[], signer: FontCDNSigner): Promise<string>;
/**
 * Get weight name from numeric weight
 */
export declare function getWeightName(weight: number): string;
//# sourceMappingURL=font-helpers.d.ts.map