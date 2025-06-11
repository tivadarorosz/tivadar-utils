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

## Installation

Install individual packages using Git dependencies in your `package.json`:

```json
{
  "dependencies": {
    "@tivadar/font-cdn-utils": "git+https://github.com/tivadarorosz/tivadar-utils.git#main"
  }
}
```

Then run:
```bash
npm install
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