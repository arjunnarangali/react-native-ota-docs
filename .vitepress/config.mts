import { defineConfig } from 'vitepress'

function tableDataLabels(md: any) {
  md.core.ruler.push('table_data_labels', (state: any) => {
    const tokens = state.tokens

    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type !== 'table_open') continue

      const headers: string[] = []
      let inHead = false

      for (let j = i + 1; j < tokens.length && tokens[j].type !== 'table_close'; j++) {
        if (tokens[j].type === 'thead_open') inHead = true
        if (tokens[j].type === 'thead_close') inHead = false
        if (inHead && tokens[j].type === 'th_open') {
          const inline = tokens[j + 1]
          headers.push(
            inline && inline.type === 'inline'
              ? inline.content.replace(/`/g, '')
              : '',
          )
        }
      }

      let inBody = false
      let cell = 0

      for (let j = i + 1; j < tokens.length && tokens[j].type !== 'table_close'; j++) {
        if (tokens[j].type === 'tbody_open') inBody = true
        if (tokens[j].type === 'tbody_close') inBody = false
        if (inBody && tokens[j].type === 'tr_open') cell = 0
        if (inBody && tokens[j].type === 'td_open') {
          tokens[j].attrSet('data-label', headers[cell] ?? '')
          cell++
        }
      }
    }
  })
}

export default defineConfig({
  title: 'React Native OTA Client',
  description:
    'Signed over-the-air JavaScript updates for React Native apps on Android and iOS.',
  cleanUrls: true,
  srcExclude: ['README.md'],
  sitemap: {
    hostname: 'https://docs.ota.arjunis.me',
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
    ['meta', { property: 'og:url', content: 'https://docs.ota.arjunis.me/' }],
  ],
  markdown: {
    lineNumbers: true,
    config: (md) => {
      tableDataLabels(md)
    },
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
      copyright:
        '© 2026 <a href="https://arjunis.me/" target="_blank" rel="noreferrer">Arjun N</a>',
    },
  },
})
