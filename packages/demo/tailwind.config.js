/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors";

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: colors.orange
            }
        },
    },
    plugins: [require("daisyui")],
    daisyui: {
        // themes: true
        themes: [{
            light: {
                ...require("daisyui/src/theming/themes")["[data-theme=light]"],
                "primary": "#ea580c", // tailwind orange-600
                "primary-content": "#ffffff",
            },
        }],
    },
}