import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'React Native OTA Client',
  description:
    'Signed over-the-air JavaScript updates for React Native apps on Android and iOS.',
  cleanUrls: true,
  srcExclude: ['README.md'],
  sitemap: {
    hostname: 'https://ota.arjunis.me',
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#0f172a' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'React Native OTA Client' }],
    [
      'meta',
      {
        property: 'og:description',
        content:
          'Signed over-the-air JavaScript updates for React Native apps on Android and iOS.',
      },
    ],
    ['meta', { property: 'og:url', content: 'https://ota.arjunis.me/' }],
  ],
  markdown: {
    lineNumbers: true,
  },
  themeConfig: {
    logo: '/favicon.svg',
    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Server', link: '/server' },
      {
        text: 'Links',
        items: [
          {
            text: 'npm package',
            link: 'https://www.npmjs.com/package/react-native-ota-client',
          },
          {
            text: 'Client repository',
            link: 'https://github.com/arjunnarangali/react-native-ota-client',
          },
          {
            text: 'Server repository',
            link: 'https://github.com/arjunnarangali/react-native-ota-server',
          },
        ],
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'JavaScript API', link: '/guide/javascript-api' },
            { text: 'Android setup', link: '/guide/android' },
            { text: 'iOS setup', link: '/guide/ios' },
            { text: 'Native startup API', link: '/guide/native-startup' },
            { text: 'Troubleshooting', link: '/guide/troubleshooting' },
          ],
        },
      ],
      '/': [
        {
          text: 'Project',
          items: [{ text: 'Server contract', link: '/server' }],
        },
      ],
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/arjunnarangali/react-native-ota-client',
      },
      {
        icon: 'npm',
        link: 'https://www.npmjs.com/package/react-native-ota-client',
      },
    ],
    search: {
      provider: 'local',
    },
    outline: {
      level: [2, 3],
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright 2026 Arjun N',
    },
  },
})
