/**
 * Font CDN Types
 * Type definitions for font signing and configuration
 */
export interface FontCDNConfig {
    /**
     * The font CDN domain (e.g., https://fonts.tivadar.com)
     */
    fontDomain: string;
    /**
     * Authentication key for font CDN
     */
    fontsAuthKey: string;
    /**
     * Default expiry time in seconds (default: 1 year)
     */
    expiry?: number;
}
export interface FontConfig {
    /**
     * Font family name (e.g., 'Tiempos Text')
     */
    family: string;
    /**
     * Font weight (e.g., 400, 700)
     */
    weight: number;
    /**
     * Font style
     */
    style?: 'normal' | 'italic';
    /**
     * Font formats to include
     */
    formats: string[];
    /**
     * Base path to font files (without extension)
     */
    path: string;
    /**
     * Whether to preload this font
     */
    preload?: boolean;
    /**
     * Font display property
     */
    display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
    /**
     * Unicode range for the font
     */
    unicodeRange?: string;
}
export interface FontSignerOptions {
    /**
     * Override expiry time in seconds
     */
    expiry?: number;
}
export interface FontPreloadOptions {
    /**
     * Additional attributes for the link tag
     */
    attributes?: Record<string, string>;
}
//# sourceMappingURL=types.d.ts.map