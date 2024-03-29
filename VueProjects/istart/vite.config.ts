import { UserConfigExport, ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default ({ command }: ConfigEnv): UserConfigExport => {
  let mock: true;
  return {
    plugins: [
      vue(),
      viteMockServe({
        mockPath: 'mock',
        localEnabled: command === 'serve' && mock,
        watchFiles: true,
      }),
    ],
    server: {
      host: '0.0.0.0',
      port: 4000,
      proxy: mock ? {
        '/api': {
          target: 'http://jsonplaceholder.typicode.com',
          changeOrigin: true,
        },
      } : null
    }
  }
}
