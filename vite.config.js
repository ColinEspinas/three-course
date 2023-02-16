import glsl from 'vite-plugin-glsl'

const isCodeSandbox = 'SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env

export default {
  plugins: [glsl()],
  server: {
    host: true,
    open: !isCodeSandbox, // Open if it's not a CodeSandbox
  },
  build: {
    emptyOutDir: true,
    sourcemap: true,
  },
}
