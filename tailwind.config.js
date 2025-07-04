/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'sidebar-bg': '#111827',
        'sidebar-text': '#9CA3AF',
        'sidebar-hover': '#374151',
        'sidebar-active': '#4F46E5',
      }
    },
  },
  plugins: [],
};