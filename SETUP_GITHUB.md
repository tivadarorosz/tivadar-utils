# GitHub Setup Instructions

## 1. Create Repository on GitHub

Go to https://github.com/new and create a new repository:
- Repository name: `tivadar-utils`
- Description: "Shared utilities for Tivadar web projects"
- Set as Private (or Public if you prefer)
- DO NOT initialize with README, .gitignore or license

## 2. Push to GitHub

After creating the repository, run these commands:

```bash
cd /Users/tivadarorosz/Projects/tivadar-utils
git remote add origin git@github.com:tivadarorosz/tivadar-utils.git
git push -u origin main
```

Or if using HTTPS:
```bash
git remote add origin https://github.com/tivadarorosz/tivadar-utils.git
git push -u origin main
```

## 3. Verify

The repository should now be available at:
https://github.com/tivadarorosz/tivadar-utils

And packages can be installed using:
```json
"@tivadar/font-cdn-utils": "git+https://github.com/tivadarorosz/tivadar-utils.git#main"
```