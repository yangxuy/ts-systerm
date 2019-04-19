module.exports = {
  devServer: {
    port: '3030',
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API_URL,
        changeOrigin: true
      }
    }
  }
}
