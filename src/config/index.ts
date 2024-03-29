export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  db: {
    host: process.env.DB_HOST
  },
  frontendUrl: process.env.FRONTEND_URL,
  jwtSecret: process.env.AUTH_SECRET,
  sendGrid: {
    apiKey: process.env.SENDGRID_API_KEY,
    emailFrom: process.env.SENDGRID_EMAIL_FROM,
    templates: {
      emailConfirm: process.env.SENDGRID_TEMPLATE_EMAIL_CONFIRM,
      emailContactUs: process.env.SENDGRID_TEMPLATE_EMAIL_CONTACT_US
    }
  },
  cloudflare: {
    url: "https://api.cloudflare.com/client/v4/accounts",
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    apiToken: process.env.CLOUDFLARE_API_TOKEN
  },
  stripe: {
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY
  }
})
