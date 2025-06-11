# Tivadar Utils

Shared utilities for Tivadar web projects.

## Packages

### @tivadar/font-cdn-utils
Font CDN signing utilities for BunnyCDN with token authentication.

Features:
- Font URL signing with dedicated fonts domain
- TypeScript support with type definitions
- Works in both Node.js and Cloudflare Workers
- No crossorigin issues

### @tivadar/rate-limiter
Flexible rate limiting library for Cloudflare Workers with KV storage.

Features:
- Distributed rate limiting across edge locations
- Multiple rate limiters with different configurations
- Middleware helpers for easy integration
- Full TypeScript support
- Platform-agnostic design

## Installation

This is a monorepo containing multiple packages. To use a specific package, you need to reference the subdirectory:

### Option 1: Using npm pack (Recommended for now)
```bash
# In tivadar-utils directory
cd packages/rate-limiter
npm pack
# This creates @tivadar-rate-limiter-1.0.0.tgz

# In your project
npm install /path/to/@tivadar-rate-limiter-1.0.0.tgz
```

### Option 2: Direct file reference
```json
{
  "dependencies": {
    "@tivadar/rate-limiter": "file:../tivadar-utils/packages/rate-limiter",
    "@tivadar/font-cdn-utils": "file:../tivadar-utils/packages/font-cdn-utils"
  }
}
```

### Option 3: Using npm workspaces (Future)
Once published to npm registry, you'll be able to:
```bash
npm install @tivadar/rate-limiter
```

## Usage Example

```javascript
const { createFontSigner, defaultFonts } = require('@tivadar/font-cdn-utils');

// Create signer instance
const fontSigner = createFontSigner({
  fontDomain: 'https://fonts.tivadar.com',
  fontsAuthKey: process.env.BUNNYCDN_FONTS_AUTH_TOKEN_KEY,
  expiry: 31536000, // 1 year
});

// Sign a font URL
const signedUrl = fontSigner.signFont('/fonts/Tiempos/tiempos-text-regular.woff2');
```

## Structure

```
tivadar-utils/
└── packages/
    └── font-cdn-utils/     # Font CDN signing utilities
        ├── package.json
        ├── index.js
        └── lib/           # Compiled TypeScript files
```

## Adding New Packages

1. Create new folder in `packages/`
2. Add package.json with proper name (e.g., `@tivadar/new-package`)
3. Include compiled JavaScript (not TypeScript source)
4. Push to GitHub
5. Install in projects using same Git URL format

## License

Private - All rights reserved