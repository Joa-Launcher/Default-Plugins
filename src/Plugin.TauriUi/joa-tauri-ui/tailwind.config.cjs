/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "./src/**/*.vue"
  ],
  theme: {
    extend: {
      colors: {
        'userInputBackground': '#20252b',
        'userInputText': '#fff',
        'searchResultBackground' : '#272c34',
        'searchResultActiveBackground': '#3d4452',
        'searchResultNameText' : '#aab2c0',
        'searchResultDescriptionText' : '#ccc'
      },
    },
  },
  plugins: [],
}
