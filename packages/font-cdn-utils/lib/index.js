"use strict";
/**
 * Font CDN Utils
 * Shared font signing utilities for Tivadar projects
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeightName = exports.generateAllFontFacesAsync = exports.generateAllFontFaces = exports.generateFontPreloadsAsync = exports.generateFontPreloads = exports.generateFontPreloadAsync = exports.generateFontPreload = exports.generateFontFaceAsync = exports.generateFontFace = exports.getPreloadFonts = exports.getFontConfig = exports.defaultFonts = exports.createFontSigner = exports.FontCDNSigner = void 0;
// Export all types
__exportStar(require("./types"), exports);
// Export signer
var font_signer_1 = require("./font-signer");
Object.defineProperty(exports, "FontCDNSigner", { enumerable: true, get: function () { return font_signer_1.FontCDNSigner; } });
Object.defineProperty(exports, "createFontSigner", { enumerable: true, get: function () { return font_signer_1.createFontSigner; } });
// Export configurations
var font_config_1 = require("./font-config");
Object.defineProperty(exports, "defaultFonts", { enumerable: true, get: function () { return font_config_1.defaultFonts; } });
Object.defineProperty(exports, "getFontConfig", { enumerable: true, get: function () { return font_config_1.getFontConfig; } });
Object.defineProperty(exports, "getPreloadFonts", { enumerable: true, get: function () { return font_config_1.getPreloadFonts; } });
// Export helpers
var font_helpers_1 = require("./font-helpers");
Object.defineProperty(exports, "generateFontFace", { enumerable: true, get: function () { return font_helpers_1.generateFontFace; } });
Object.defineProperty(exports, "generateFontFaceAsync", { enumerable: true, get: function () { return font_helpers_1.generateFontFaceAsync; } });
Object.defineProperty(exports, "generateFontPreload", { enumerable: true, get: function () { return font_helpers_1.generateFontPreload; } });
Object.defineProperty(exports, "generateFontPreloadAsync", { enumerable: true, get: function () { return font_helpers_1.generateFontPreloadAsync; } });
Object.defineProperty(exports, "generateFontPreloads", { enumerable: true, get: function () { return font_helpers_1.generateFontPreloads; } });
Object.defineProperty(exports, "generateFontPreloadsAsync", { enumerable: true, get: function () { return font_helpers_1.generateFontPreloadsAsync; } });
Object.defineProperty(exports, "generateAllFontFaces", { enumerable: true, get: function () { return font_helpers_1.generateAllFontFaces; } });
Object.defineProperty(exports, "generateAllFontFacesAsync", { enumerable: true, get: function () { return font_helpers_1.generateAllFontFacesAsync; } });
Object.defineProperty(exports, "getWeightName", { enumerable: true, get: function () { return font_helpers_1.getWeightName; } });
// Import for default export
const font_signer_2 = require("./font-signer");
const font_config_2 = require("./font-config");
const font_helpers_2 = require("./font-helpers");
// Default export with common usage pattern
exports.default = {
    createFontSigner: font_signer_2.createFontSigner,
    defaultFonts: font_config_2.defaultFonts,
    generateFontFace: font_helpers_2.generateFontFace,
    generateFontPreload: font_helpers_2.generateFontPreload,
    generateFontPreloads: font_helpers_2.generateFontPreloads,
    generateAllFontFaces: font_helpers_2.generateAllFontFaces,
};
//# sourceMappingURL=index.js.map