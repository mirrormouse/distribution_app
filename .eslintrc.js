// .eslintrc.js
module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'next/core-web-vitals',
    ],
    plugins: ['react', '@typescript-eslint'],
    overrides: [
        {
            files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
            // 必要なルールや設定
        },
    ],
    rules: {
        // 必要に応じてルールを追加
    },
};
