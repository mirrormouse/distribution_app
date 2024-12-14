// tailwind.config.js
module.exports = {
  // darkMode: 'class', // ダークモードの設定を削除
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mint: {
          DEFAULT: '#3EB489',
          light: '#5BD1A2',
          // dark: '#2FA27C', // ダークモード用色を削除
        },
        gold: {
          DEFAULT: '#E53E3E', // 赤系の色に変更（例：Tailwindのred-600）
          light: '#FC8181',   // 赤系のライトカラー（例：Tailwindのred-300）
          // dark: '#CCAC00', // ダークモード用色を削除
        },
        background: {
          light: '#FFFFFF',
          // dark: '#1E1E1E',  // ダークモード用色を削除
          secondary: '#F5F5F5',
          // 'secondary-dark': '#2C2C2C', // ダークモード用色を削除
        },
        text: {
          light: '#000000',
          // dark: '#FFFFFF',  // ダークモード用色を削除
          secondary: '#4B5563',
          // 'secondary-dark': '#E5E5E5', // ダークモード用色を削除
        },
        border: {
          light: '#D1D5DB',
          // dark: '#3C3C3C',  // ダークモード用色を削除
        },
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}
