/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    safelist: [
        // Accent colors for dynamic theme switching
        'bg-[#A855F7]', 'bg-[#7E22CE]', 'bg-[#C084FC]',
        'bg-[#3B82F6]', 'bg-[#1D4ED8]', 'bg-[#60A5FA]',
        'bg-[#10B981]', 'bg-[#047857]', 'bg-[#34D399]',
        'bg-[#F43F5E]', 'bg-[#BE123C]', 'bg-[#FB7185]',
        'border-[#A855F7]', 'border-[#3B82F6]', 'border-[#10B981]', 'border-[#F43F5E]',
        'text-[#A855F7]', 'text-[#3B82F6]', 'text-[#10B981]', 'text-[#F43F5E]',
        'from-[#C084FC]', 'to-[#A855F7]',
        'from-[#60A5FA]', 'to-[#3B82F6]',
        'from-[#34D399]', 'to-[#10B981]',
        'from-[#FB7185]', 'to-[#F43F5E]',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: 'var(--color-primary, #A855F7)',
                    light: 'var(--color-primary-light, #C084FC)',
                    dark: 'var(--color-primary-dark, #7E22CE)',
                },
                neutral: {
                    50: '#FAFAFA',
                    100: '#F5F5F5',
                    200: '#E5E5E5',
                    300: '#D4D4D4',
                    400: '#A3A3A3',
                    500: '#737373',
                    600: '#525252',
                    700: '#404040',
                    800: '#262626',
                    900: '#171717',
                    950: '#0A0A0A',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            fontSize: {
                'display': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
                'h1': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
                'h2': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
                'h3': ['1.875rem', { lineHeight: '1.3' }],
                'h4': ['1.5rem', { lineHeight: '1.4' }],
                'body-lg': ['1.125rem', { lineHeight: '1.6' }],
                'body': ['1rem', { lineHeight: '1.6' }],
                'body-sm': ['0.875rem', { lineHeight: '1.5' }],
                'caption': ['0.75rem', { lineHeight: '1.4' }],
            },
            backdropBlur: {
                'xs': '4px',
                'sm': '8px',
                'md': '12px',
                'lg': '20px',
                'xl': '40px',
                '2xl': '60px',
            },
            boxShadow: {
                'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
                'soft-lg': '0 4px 16px rgba(0, 0, 0, 0.06)',
                'soft-xl': '0 8px 24px rgba(0, 0, 0, 0.08)',
                'premium': '0 20px 60px rgba(168, 85, 247, 0.1)',
                'glass': '0 8px 32px rgba(0, 0, 0, 0.08)',
                'neo': '8px 8px 16px #d1d5db, -8px -8px 16px #ffffff',
                'neo-hover': '12px 12px 24px #d1d5db, -12px -12px 24px #ffffff',
            },
            animation: {
                'soft-pulse': 'soft-pulse 2s ease-in-out 2',
                'breathe': 'breathe 3s ease-in-out infinite',
                'fade-in': 'fade-in 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                'slide-down': 'slide-down 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                'slide-up': 'slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                'scale-in': 'scale-in 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                'notification-enter': 'notification-enter 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                'red-glow': 'red-glow 1.5s ease-in-out 3',
                'yellow-pulse': 'yellow-pulse 2s ease-in-out 3',
            },
            keyframes: {
                'soft-pulse': {
                    '0%, 100%': {
                        opacity: '1',
                        transform: 'scale(1)',
                    },
                    '50%': {
                        opacity: '0.95',
                        transform: 'scale(1.002)',
                    },
                },
                'breathe': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.85' },
                },
                'fade-in': {
                    '0%': { opacity: '0', transform: 'translateY(-8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'slide-down': {
                    '0%': { transform: 'translateY(-100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'slide-up': {
                    '0%': { transform: 'translateY(0)', opacity: '1' },
                    '100%': { transform: 'translateY(-100%)', opacity: '0' },
                },
                'scale-in': {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                'notification-enter': {
                    '0%': { transform: 'translateY(-100%) scale(0.95)', opacity: '0' },
                    '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
                },
                'red-glow': {
                    '0%, 100%': {
                        boxShadow: '0 0 0 0 rgba(239, 68, 68, 0)',
                        backgroundColor: 'transparent',
                    },
                    '50%': {
                        boxShadow: '0 0 30px 10px rgba(239, 68, 68, 0.2)',
                        backgroundColor: 'rgba(239, 68, 68, 0.05)',
                    },
                },
                'yellow-pulse': {
                    '0%, 100%': {
                        boxShadow: '0 0 0 0 rgba(245, 158, 11, 0)',
                    },
                    '50%': {
                        boxShadow: '0 0 20px 8px rgba(245, 158, 11, 0.3)',
                    },
                },
            },
        },
    },
    plugins: [],
}
