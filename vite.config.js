import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: [
                'favicon.ico',
                'apple-touch-icon.png',
                'masked-icon.png',
            ],
            manifest: {
                name: 'Shop Helper',
                short_name: 'Shop Helper',
                description: 'Website to help shop owners',
                icons: [
                    {
                        src: '/android-chrome-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'favicon',
                    },
                    {
                        src: '/android-chrome-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'favicon',
                    },
                    {
                        src: '/apple-touch-icon.png',
                        sizes: '180x180',
                        type: 'image/png',
                        purpose: 'apple touch icon',
                    },
                    {
                        src: '/masked-icon.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                ],
                theme_color: '#3252FA',
                background_color: '#FAFBFF',
                display: 'standalone',
                scope: '/',
                start_url: '/',
                orientation: 'portrait',
            },
        }),
    ],
})
