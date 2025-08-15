/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#009FFD',
                charcoal: '#264653',
                aqua: '#2AFC98',
            },
            borderRadius: { '2xl': '1rem' },
        },
    },
    plugins: [],
}
