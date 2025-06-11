"use strict";
/**
 * Font Configuration
 * Default font configurations for Tivadar projects
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultFonts = void 0;
exports.getFontConfig = getFontConfig;
exports.getPreloadFonts = getPreloadFonts;
/**
 * Default font configurations used across Tivadar projects
 */
exports.defaultFonts = [
    // Tiempos Text - Serif font
    {
        family: 'Tiempos Text',
        weight: 400,
        style: 'normal',
        display: 'swap',
        preload: true,
        formats: ['woff2'],
        path: '/fonts/Tiempos/tiempos-text-regular',
        unicodeRange: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
    },
    {
        family: 'Tiempos Text',
        weight: 500,
        style: 'normal',
        display: 'swap',
        preload: false,
        formats: ['woff2'],
        path: '/fonts/Tiempos/tiempos-text-medium',
        unicodeRange: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
    },
    // Styrene A - Sans serif font
    {
        family: 'Styrene A',
        weight: 400,
        style: 'normal',
        display: 'swap',
        preload: true,
        formats: ['woff2', 'woff'],
        path: '/fonts/Styrene/StyreneA-Regular-Web',
        unicodeRange: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
    },
    {
        family: 'Styrene A',
        weight: 500,
        style: 'normal',
        display: 'swap',
        preload: true,
        formats: ['woff2', 'woff'],
        path: '/fonts/Styrene/StyreneA-Medium-Web',
        unicodeRange: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
    },
    {
        family: 'Styrene A',
        weight: 700,
        style: 'normal',
        display: 'swap',
        preload: false,
        formats: ['woff2', 'woff'],
        path: '/fonts/Styrene/StyreneA-Bold-Web',
        unicodeRange: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
    },
];
/**
 * Get font configuration by family and weight
 */
function getFontConfig(family, weight) {
    return exports.defaultFonts.find(font => font.family === family && (weight === undefined || font.weight === weight));
}
/**
 * Get all fonts for preloading
 */
function getPreloadFonts() {
    return exports.defaultFonts.filter(font => font.preload);
}
//# sourceMappingURL=font-config.js.map