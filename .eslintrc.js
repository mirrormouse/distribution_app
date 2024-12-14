// .eslintrc.js
module.exports = {
    parser: '@typescript-eslint/parser', // 使用している場合
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'next/core-web-vitals',
    ],
    // その他の設定
};
