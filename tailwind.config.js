/** @type {import('tailwindcss').Config} */
export const content = [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@aws-amplify/ui-react/**/*.js"
];
export const theme = {
    extend: {
        colors: {
            primary: "#328E6E",     // Deep green
            secondary: "#67AE6E",   // Medium green
            accent: "#90C67C",      // Light green
            pale: "#E1EEBC",        // Background / surface
        }
    },
};
export const plugins = [];
