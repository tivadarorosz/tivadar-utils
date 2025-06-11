/**
 * Font CDN Utils
 * Shared font signing utilities for Tivadar projects
 */
export * from './types';
export { FontCDNSigner, createFontSigner } from './font-signer';
export { defaultFonts, getFontConfig, getPreloadFonts } from './font-config';
export { generateFontFace, generateFontFaceAsync, generateFontPreload, generateFontPreloadAsync, generateFontPreloads, generateFontPreloadsAsync, generateAllFontFaces, generateAllFontFacesAsync, getWeightName, } from './font-helpers';
import { createFontSigner } from './font-signer';
import { generateFontFace, generateFontPreload, generateFontPreloads, generateAllFontFaces } from './font-helpers';
declare const _default: {
    createFontSigner: typeof createFontSigner;
    defaultFonts: import("./types").FontConfig[];
    generateFontFace: typeof generateFontFace;
    generateFontPreload: typeof generateFontPreload;
    generateFontPreloads: typeof generateFontPreloads;
    generateAllFontFaces: typeof generateAllFontFaces;
};
export default _default;
//# sourceMappingURL=index.d.ts.map