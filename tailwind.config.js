/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class', // Abilita la dark mode basata sulla classe 'dark'
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            maxWidth: {
                '8xl': '1800px'
            },
            fontFamily: {
                sans: ['Poppins', 'sans-serif'],
            },
        }
    },
    plugins: []
}
