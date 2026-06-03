/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // new feature
        'fix', // bug fix
        'docs', // documentation only
        'style', // formatting, no logic change
        'refactor', // code restructure
        'perf', // performance
        'test', // tests
        'chore', // deps, tooling, config
        'ci', // CI/CD config
        'content', // MDX posts, static data, media
        'revert', // revert a commit
      ],
    ],
    'subject-case': [0], // disabled — proper nouns (Next.js, ESLint, etc.) are common
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'header-max-length': [2, 'always', 72],
  },
}
