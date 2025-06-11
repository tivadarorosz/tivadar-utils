"use strict";
/**
 * Font Helpers
 * Utilities for generating @font-face CSS and preload tags
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFontFace = generateFontFace;
exports.generateFontFaceAsync = generateFontFaceAsync;
exports.generateFontPreload = generateFontPreload;
exports.generateFontPreloadAsync = generateFontPreloadAsync;
exports.generateFontPreloads = generateFontPreloads;
exports.generateFontPreloadsAsync = generateFontPreloadsAsync;
exports.generateAllFontFaces = generateAllFontFaces;
exports.generateAllFontFacesAsync = generateAllFontFacesAsync;
exports.getWeightName = getWeightName;
/**
 * Generate @font-face CSS declaration with signed URLs
 */
function generateFontFace(font, signer) {
    const sources = font.formats.map(format => {
        const url = signer.signFont(`${font.path}.${format}`);
        return `url('${url}') format('${format}')`;
    }).join(',\n       ');
    const parts = [
        `@font-face {`,
        `  font-family: '${font.family}';`,
        `  font-style: ${font.style || 'normal'};`,
        `  font-weight: ${font.weight};`,
        `  font-display: ${font.display || 'swap'};`,
        `  src: ${sources};`,
    ];
    if (font.unicodeRange) {
        parts.push(`  unicode-range: ${font.unicodeRange};`);
    }
    parts.push('}');
    return parts.join('\n');
}
/**
 * Generate @font-face CSS asynchronously (for Cloudflare Workers)
 */
async function generateFontFaceAsync(font, signer) {
    const sources = await Promise.all(font.formats.map(async (format) => {
        const url = await signer.signFontAsync(`${font.path}.${format}`);
        return `url('${url}') format('${format}')`;
    }));
    const sourcesStr = sources.join(',\n       ');
    const parts = [
        `@font-face {`,
        `  font-family: '${font.family}';`,
        `  font-style: ${font.style || 'normal'};`,
        `  font-weight: ${font.weight};`,
        `  font-display: ${font.display || 'swap'};`,
        `  src: ${sourcesStr};`,
    ];
    if (font.unicodeRange) {
        parts.push(`  unicode-range: ${font.unicodeRange};`);
    }
    parts.push('}');
    return parts.join('\n');
}
/**
 * Generate font preload link tag
 * IMPORTANT: No crossorigin attribute to avoid BunnyCDN referrer issues
 */
function generateFontPreload(font, signer, options = {}) {
    // Only preload woff2 format
    if (!font.formats.includes('woff2')) {
        return null;
    }
    const url = signer.signFont(`${font.path}.woff2`);
    // Build attributes
    const attrs = {
        rel: 'preload',
        href: url,
        as: 'font',
        type: 'font/woff2',
        ...options.attributes,
    };
    // IMPORTANT: Do not include crossorigin attribute
    delete attrs.crossorigin;
    const attrString = Object.entries(attrs)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');
    return `<link ${attrString}>`;
}
/**
 * Generate font preload link tag asynchronously
 */
async function generateFontPreloadAsync(font, signer, options = {}) {
    // Only preload woff2 format
    if (!font.formats.includes('woff2')) {
        return null;
    }
    const url = await signer.signFontAsync(`${font.path}.woff2`);
    // Build attributes
    const attrs = {
        rel: 'preload',
        href: url,
        as: 'font',
        type: 'font/woff2',
        ...options.attributes,
    };
    // IMPORTANT: Do not include crossorigin attribute
    delete attrs.crossorigin;
    const attrString = Object.entries(attrs)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');
    return `<link ${attrString}>`;
}
/**
 * Generate all font preload tags for a list of fonts
 */
function generateFontPreloads(fonts, signer, options = {}) {
    return fonts
        .filter(font => font.preload && font.formats.includes('woff2'))
        .map(font => generateFontPreload(font, signer, options))
        .filter((tag) => tag !== null);
}
/**
 * Generate all font preload tags asynchronously
 */
async function generateFontPreloadsAsync(fonts, signer, options = {}) {
    const preloadFonts = fonts.filter(font => font.preload && font.formats.includes('woff2'));
    const tags = await Promise.all(preloadFonts.map(font => generateFontPreloadAsync(font, signer, options)));
    return tags.filter((tag) => tag !== null);
}
/**
 * Generate complete CSS for all fonts
 */
function generateAllFontFaces(fonts, signer) {
    return fonts
        .map(font => generateFontFace(font, signer))
        .join('\n\n');
}
/**
 * Generate complete CSS for all fonts asynchronously
 */
async function generateAllFontFacesAsync(fonts, signer) {
    const fontFaces = await Promise.all(fonts.map(font => generateFontFaceAsync(font, signer)));
    return fontFaces.join('\n\n');
}
/**
 * Get weight name from numeric weight
 */
function getWeightName(weight) {
    const weightMap = {
        100: 'thin',
        200: 'extralight',
        300: 'light',
        400: 'regular',
        500: 'medium',
        600: 'semibold',
        700: 'bold',
        800: 'extrabold',
        900: 'black',
    };
    return weightMap[weight] || weight.toString();
}
//# sourceMappingURL=font-helpers.js.map