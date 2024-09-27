/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        fontFamily: {
            'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
        },
        colors: {
            success: '#05AA50',
            successLight: 'rgba(5,170,80,0.38)',
            warning: '#DB8C23',
            warningLight: 'rgba(219,140,35,0.38)',
            danger: '#B10303',
            dangerLight: 'rgba(177,3,3,0.38)',
            brand01: {
                DEFAULT: '#0E5932',
                '100': '#E3FFF0'
            },
            brand02: {
                DEFAULT: '#DB8C23',
            },
            brand03: {
                DEFAULT: '#1B1B1B',
            },
            greenFrom: '#198B4D',
            greenTo: '#05AA50',
            linearGreen: {
                '0': '#198B4D',
                '100': '#05AA50',
            },
            linearYellow: {
                '0%': '#DB8C23',
                '100%': '#E9B85B',
            },
            linearBlack: {
                '0%': '#262626',
                '100%': '#3D3D3D',
            },
            neutrals: {
                '900': '#1C2024',
                '800': '#60646C',
                '700': '#7E808A',
                '600': '#8B8D98',
                '500': '#B9BBC6',
                '400': '#D3D4DB',
                '300': '#DDDDE3',
                '200': '#EBEBEF',
                '100': '#F9F9FB',
                '50': '#FCFCFD',
            },
            background: {
                DEFAULT: '#F6F6F6'
            },
            semantics: {
                green01: '#0E5932',
                green02: '#12D56A',
                green03: '#E3FFF0',
                yellow01: '#904918',
                yellow02: '#E09C2F',
                yellow03: '#F7ECCA',
                grey01: '#454545',
                grey02: '#6D6D6D',
                grey03: '#E7E7E7',
                red01: '#B10303',
                red02: '#FF0303',
                red03: '#FFDDDD'
            },
            accent: {
                a01: '#F9A92A',
                systemBlue: '#007AFF'
            },
            lineActive: {
                DEFAULT: '#F9A92A'
            },
            required: {
                DEFAULT: '#cd220c'
            },
            darkGrey: {
                '2C2C': '#2C2C2C',
                '3333':'#333333',
                '3838':'#383838',
                '3838-important':'#383838 !important',
                '2E2E':'#2E2E2E',
                '3636':'#363636',
                '2727':'#272727',
            },
        },
        extend: {
            boxShadow: {
                'custom-1': '0px 3px 1px 0px rgba(0, 0, 0, 0.06)',
                'custom-2': '0px 3px 8px 0px rgba(0, 0, 0, 0.15)',
                'custom-3': '0px 0px 0px 1px rgba(0, 0, 0, 0.04)',
                'light-1': '0px 0px 1px 0px #0000000F',
                'light-2': '1px 0px 8px 0px #00000026',
                'light-3': '0px 2px 0px 1px #0000000A',
                'button-1': '1px 0px 8px 0px #00000026',
            },
            backgroundImage: {
                'gradient-green': 'linear-gradient(to right, #198B4D, #05AA50)',
                'gradient-green-disabled': 'linear-gradient(to right, #E3FFF0, #E3FFF0)',
                'gradient-green-press': 'linear-gradient(to right, #0E5932, #0E5932)',
            },
            text: {
                'gradient-text-green': 'linear-gradient(to right, #0A8040, #05AA50)',
            },
            borderImage:{
                'gradient-green': 'linear-gradient(to right, #0A8040, #05AA50)',
            },
            backgroundColor:{
                'rgba-black-12': 'rgba(0, 0, 0, 0.12)'
            }
        },
    },
    plugins: [
        function ({ addUtilities }) {
            addUtilities({
                '.border-gradient-green': {
                    borderImage: 'linear-gradient(to right, #0A8040, #05AA50) 1',
                },
            });
        },
    ],
}