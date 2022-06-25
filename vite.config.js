import fs from 'fs'
import path from 'path'
import { defineConfig } from 'vite'
import legacy from './scripts/legacy'
import ViteLegacy from '@vitejs/plugin-legacy'


const type = process.env.BUILD_TYPE

if (type === 'demo') {
  fs.rmSync('./demo/dist', { recursive: true, force: true })
} else {
  fs.rmSync('./lib', { recursive: true, force: true })
  if (type !== 'es') {
    fs.rmSync('./dist', { recursive: true, force: true })
  }
}

export default defineConfig(({ command }) => {
  if (command === 'build') {
    if (type === 'demo') {
      return {
        base: './',
        root: './demo',
        css: {
          postcss: { plugins: [require('autoprefixer')] }
        },
        build: {
          emptyOutDir: false,
          minify: 'terser',
          sourcemap: true,
          target: 'es2015',
          outDir: path.resolve(__dirname, 'demo/dist'),
          rollupOptions: {
            input: path.resolve(__dirname, './demo/index.html')
          }
        },
        plugins: [
          ViteLegacy({
            targets: ['defaults', 'IE 11']
          })
        ]
      }
    } else if (type === 'es') {
      return {
        build: {
          emptyOutDir: false,
          minify: false,
          rollupOptions: {
            input: './src/index.ts',
            preserveEntrySignatures: 'strict',
            external: ['wblib'],
            output: {
              manualChunks: undefined,
              format: 'es',
              dir: './lib',
              preserveModules: true,
              entryFileNames: '[name].js',
              assetFileNames: '[name][extname]',
            }
          }
        }
      }
    } else {
      return {
        css: {
          postcss: { plugins: [require('autoprefixer')] }
        },
        build: {
          emptyOutDir: false,
          lib: {
            entry: './src/index.ts',
            name: 'ppbar',
            formats: ['umd'],
            fileName: () => 'index.min.js'
          },
          minify: 'terser',
          rollupOptions: {
            output: {
              assetFileNames: 'index.min.css'
            }
          },
          sourcemap: true
        },
        plugins: [legacy()]
      }
    }
  }
})
