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
    emailFromName: "CVwisely",
    headersLocaleKey: "x-locale",
    templates: {
      en: {
        emailConfirm: process.env.SENDGRID_TEMPLATE_EMAIL_CONFIRM,
        emailContactUs: process.env.SENDGRID_TEMPLATE_EMAIL_CONTACT_US,
        emailRecoveryPassword: process.env.SENDGRID_TEMPLATE_EMAIL_RECOVERY_PASSWORD,
        emailRecoveryPasswordSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_RECOVERY_PASSWORD_SUCCESSFUL,
        emailSignUpWithEmailSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_SIGNUP_WITH_EMAIL_SUCCESSFUL,
        emailSignUpWithGoogleSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_SIGNUP_WITH_GOOGLE_SUCCESSFUL,
        emailAccountSubscriptionCancelation: process.env.SENDGRID_TEMPLATE_EMAIL_ACCOUNT_SUBSCRIPTION_CANCELATION,
        emailAccountInitialPayment: process.env.SENDGRID_TEMPLATE_EMAIL_ACCOUNT_INITIAL_PAYMENT
      },
      ro: {
        emailConfirm: process.env.SENDGRID_TEMPLATE_EMAIL_RO_CONFIRM,
        emailContactUs: process.env.SENDGRID_TEMPLATE_EMAIL_RO_CONTACT_US,
        emailRecoveryPassword: process.env.SENDGRID_TEMPLATE_EMAIL_RO_RECOVERY_PASSWORD,
        emailRecoveryPasswordSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_RO_RECOVERY_PASSWORD_SUCCESSFUL,
        emailSignUpWithEmailSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_RO_SIGNUP_WITH_EMAIL_SUCCESSFUL,
        emailSignUpWithGoogleSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_RO_SIGNUP_WITH_GOOGLE_SUCCESSFUL,
        emailAccountSubscriptionCancelation: process.env.SENDGRID_TEMPLATE_EMAIL_RO_ACCOUNT_SUBSCRIPTION_CANCELATION,
        emailAccountInitialPayment: process.env.SENDGRID_TEMPLATE_EMAIL_RO_ACCOUNT_INITIAL_PAYMENT
      }
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
  },
  awsS3Storage: {
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsAccessKeySecret: process.env.AWS_ACCESS_KEY_SECRET,
    awsS3Region: process.env.AWS_S3_REGION,
    awsS3Bucket: process.env.AWS_S3_BUCKET
  }
})
