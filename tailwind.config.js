/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './apps/cloud-equipment/src/**/*.{js,jsx,ts,tsx}',
    './apps/superadmin/src/**/*.{js,jsx,ts,tsx}',
    './libs/auth/src/**/*.{js,jsx,ts,tsx}',
    './libs/reports/src/**/*.{js,jsx,ts,tsx}',
    './libs/price/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        manrope: ['Manrope'],
        dmsans: ['DM Sans'],
        playfair: ['Playfair Display'],
        nunito: ['Nunito Sans'],
      },
      colors: {
        'ce-green': '#0E5F50',
        'ce-lgreen': '#EEFFFC',
        greenText: '#54D4BD',
        lightGreen: '#EEFFFC',
        blackText: '#40484F',
        greyText: '#8F9AA3',
        greyText2: '#667085',
        borderLine: '#EAECF0',
        greyBg: '#F7F7F7',
        primary: {
          100: '#0D5F50',
          150: '#54D4BD',
          200: '#F6F9F8',
          250: '#EEFFFC',
          300: '#48BF53',
        },
        secondary: {
          100: '#32324D',
          150: ' #F3F3FF',
          200: '#EAECF0',
          250: '#1A1A1A',
          300: '#292929',
          350: '#101828',
          400: '#1C2221',
          450: '#EAEAEF',
          500: '#40484F',
        },
        neutral: {
          100: '#DCDCE4',
          150: '#9D99AC',
          200: '#344054',
          300: '#667085',
          350: '#271E4A',
          400: 'rgba(39, 30, 74, 0.8)',
          450: '#8E8EA9',
          500: '#666687',
        },
      },
      boxShadow: {
        buttonShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.04)',
        pageFormShadow: '0px 4px 15px 0px rgba(216, 210, 252, 0.15)',
        facilityMediaCard: '0px 1px 4px 0px rgba(26, 26, 67, 0.1)',
      },
    },
  },
  plugins: [],
};
