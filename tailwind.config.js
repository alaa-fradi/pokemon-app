/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true, // This forces Tailwind classes to apply
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure this covers your component files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

