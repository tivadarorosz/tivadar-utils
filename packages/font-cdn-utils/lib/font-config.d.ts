/**
 * Font Configuration
 * Default font configurations for Tivadar projects
 */
import { FontConfig } from './types';
/**
 * Default font configurations used across Tivadar projects
 */
export declare const defaultFonts: FontConfig[];
/**
 * Get font configuration by family and weight
 */
export declare function getFontConfig(family: string, weight?: number): FontConfig | undefined;
/**
 * Get all fonts for preloading
 */
export declare function getPreloadFonts(): FontConfig[];
//# sourceMappingURL=font-config.d.ts.map