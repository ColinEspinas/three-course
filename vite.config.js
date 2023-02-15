import glsl from 'vite-plugin-glsl'
import envPlugin from 'vite-plugin-environment'

const isCodeSandbox = 'SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env

export default {
  plugins: [glsl(), envPlugin([])],
  server: {
    host: true,
    open: !isCodeSandbox, // Open if it's not a CodeSandbox
  },
  build: {
    emptyOutDir: true,
    sourcemap: true,
  },
}
