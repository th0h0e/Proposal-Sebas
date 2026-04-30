import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  formatters: true,
  ignores: ['SuperKids.html', 'AGENTS.md', 'CLAUDE.md'],
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false,
  },
})
