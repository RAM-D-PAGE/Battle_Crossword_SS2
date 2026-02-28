/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            zIndex: {
                'tile': '10',
                'effect': '20',
                'ui': '30',
                'modal': '50',
            }
        },
    },
    plugins: [],
}
