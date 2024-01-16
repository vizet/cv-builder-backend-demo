export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  db: {
    host: process.env.DB_HOST
  },
  jwtSecret: process.env.AUTH_SECRET
})
