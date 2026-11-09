# React Native OTA documentation

This is the documentation site for [`react-native-ota-client`](https://github.com/arjunnarangali/react-native-ota-client) and [`react-native-ota-server`](https://github.com/arjunnarangali/react-native-ota-server). It is a separate VitePress project. The site is built from the SDK README, the native setup guides, and the server repository.

Production URL: `https://docs.ota.arjunis.me/`

## Requirements

- Node.js 20 or newer.
- npm.

## Local development

```sh
npm install
npm run dev
```

VitePress starts a local server at `http://localhost:5173`.

## Build

```sh
npm run build
npm run preview
```

The build output is in `.vitepress/dist`.

## Project layout

| Path | Content |
| --- | --- |
| `index.md` | Home page |
| `guide/introduction.md` | What the SDK does and what OTA can update |
| `guide/installation.md` | Package installation |
| `guide/javascript-api.md` | JavaScript API and status shape |
| `guide/android.md` | Android host setup |
| `guide/ios.md` | iOS host setup |
| `guide/native-startup.md` | Native startup API |
| `guide/troubleshooting.md` | Common failures |
| `server/` | Server setup, configuration, releases, tools, operations, deployment, API, and troubleshooting |
| `.vitepress/config.mts` | Site title, navigation, sidebar, search, sitemap |
| `public/` | Static files copied to the build output |

## Deploy to Vercel

1. Push this project to a Git repository.
2. In Vercel, choose Add New Project and import the repository.
3. Use these settings:
   - Framework Preset: VitePress, or Other if the preset is unavailable.
   - Build Command: `npm run build`
   - Output Directory: `.vitepress/dist`
   - Install Command: `npm install`
   - Node.js Version: 24.x
4. Deploy.
5. Open Project Settings, then Domains, and add `docs.ota.arjunis.me`.
6. Because the domain uses Vercel DNS, Vercel should configure the subdomain and issue the TLS certificate automatically.
7. Open `https://docs.ota.arjunis.me` and confirm the site loads over HTTPS.

`vercel.json` already sets the build command, output directory, clean URLs, and trailing slash behavior.

## Content rules

- Keep commands copyable.
- Use sentence case for headings.
- Use straight quotes.
- Do not add private keys, tokens, or credentials.
- Update the matching documentation page and repository README when setup steps change.
