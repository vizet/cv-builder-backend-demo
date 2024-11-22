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
    unsubscribeAsm: {
        group_id: 65084,
        groups_to_display: [65084, 65076]
    },
    templates: {
      en: {
        emailConfirm: process.env.SENDGRID_TEMPLATE_EMAIL_CONFIRM,
        emailContactUs: process.env.SENDGRID_TEMPLATE_EMAIL_CONTACT_US,
        emailRecoveryPassword: process.env.SENDGRID_TEMPLATE_EMAIL_RECOVERY_PASSWORD,
        emailRecoveryPasswordSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_RECOVERY_PASSWORD_SUCCESSFUL,
        emailSignUpWithEmailSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_SIGNUP_WITH_EMAIL_SUCCESSFUL,
        emailSignUpWithGoogleSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_SIGNUP_WITH_GOOGLE_SUCCESSFUL,
        emailAccountSubscriptionCancelation: process.env.SENDGRID_TEMPLATE_EMAIL_ACCOUNT_SUBSCRIPTION_CANCELATION,
        emailAccountInitialPayment: process.env.SENDGRID_TEMPLATE_EMAIL_ACCOUNT_INITIAL_PAYMENT,
        emailReminder1st: process.env.SENDGRID_TEMPLATE_EMAIL_REMINDER_1ST,
        emailReminder2st: process.env.SENDGRID_TEMPLATE_EMAIL_REMINDER_2ST
      },
      ro: {
        emailConfirm: process.env.SENDGRID_TEMPLATE_EMAIL_RO_CONFIRM,
        emailContactUs: process.env.SENDGRID_TEMPLATE_EMAIL_RO_CONTACT_US,
        emailRecoveryPassword: process.env.SENDGRID_TEMPLATE_EMAIL_RO_RECOVERY_PASSWORD,
        emailRecoveryPasswordSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_RO_RECOVERY_PASSWORD_SUCCESSFUL,
        emailSignUpWithEmailSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_RO_SIGNUP_WITH_EMAIL_SUCCESSFUL,
        emailSignUpWithGoogleSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_RO_SIGNUP_WITH_GOOGLE_SUCCESSFUL,
        emailAccountSubscriptionCancelation: process.env.SENDGRID_TEMPLATE_EMAIL_RO_ACCOUNT_SUBSCRIPTION_CANCELATION,
        emailAccountInitialPayment: process.env.SENDGRID_TEMPLATE_EMAIL_RO_ACCOUNT_INITIAL_PAYMENT,
        emailReminder1st: process.env.SENDGRID_TEMPLATE_EMAIL_RO_REMINDER_1ST,
        emailReminder2st: process.env.SENDGRID_TEMPLATE_EMAIL_RO_REMINDER_2ST
      },
      tr: {
        emailConfirm: process.env.SENDGRID_TEMPLATE_EMAIL_TR_CONFIRM,
        emailContactUs: process.env.SENDGRID_TEMPLATE_EMAIL_TR_CONTACT_US,
        emailRecoveryPassword: process.env.SENDGRID_TEMPLATE_EMAIL_TR_RECOVERY_PASSWORD,
        emailRecoveryPasswordSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_TR_RECOVERY_PASSWORD_SUCCESSFUL,
        emailSignUpWithEmailSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_TR_SIGNUP_WITH_EMAIL_SUCCESSFUL,
        emailSignUpWithGoogleSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_TR_SIGNUP_WITH_GOOGLE_SUCCESSFUL,
        emailAccountSubscriptionCancelation: process.env.SENDGRID_TEMPLATE_EMAIL_TR_ACCOUNT_SUBSCRIPTION_CANCELATION,
        emailAccountInitialPayment: process.env.SENDGRID_TEMPLATE_EMAIL_TR_ACCOUNT_INITIAL_PAYMENT,
        emailReminder1st: process.env.SENDGRID_TEMPLATE_EMAIL_TR_REMINDER_1ST,
        emailReminder2st: process.env.SENDGRID_TEMPLATE_EMAIL_TR_REMINDER_2ST
      },
      pt: {
        emailConfirm: process.env.SENDGRID_TEMPLATE_EMAIL_PT_CONFIRM,
        emailContactUs: process.env.SENDGRID_TEMPLATE_EMAIL_PT_CONTACT_US,
        emailRecoveryPassword: process.env.SENDGRID_TEMPLATE_EMAIL_PT_RECOVERY_PASSWORD,
        emailRecoveryPasswordSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_PT_RECOVERY_PASSWORD_SUCCESSFUL,
        emailSignUpWithEmailSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_PT_SIGNUP_WITH_EMAIL_SUCCESSFUL,
        emailSignUpWithGoogleSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_PT_SIGNUP_WITH_GOOGLE_SUCCESSFUL,
        emailAccountSubscriptionCancelation: process.env.SENDGRID_TEMPLATE_EMAIL_PT_ACCOUNT_SUBSCRIPTION_CANCELATION,
        emailAccountInitialPayment: process.env.SENDGRID_TEMPLATE_EMAIL_PT_ACCOUNT_INITIAL_PAYMENT,
        emailReminder1st: process.env.SENDGRID_TEMPLATE_EMAIL_PT_REMINDER_1ST,
        emailReminder2st: process.env.SENDGRID_TEMPLATE_EMAIL_PT_REMINDER_2ST
      },
      bg: {
        emailConfirm: process.env.SENDGRID_TEMPLATE_EMAIL_BG_CONFIRM,
        emailContactUs: process.env.SENDGRID_TEMPLATE_EMAIL_BG_CONTACT_US,
        emailRecoveryPassword: process.env.SENDGRID_TEMPLATE_EMAIL_BG_RECOVERY_PASSWORD,
        emailRecoveryPasswordSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_BG_RECOVERY_PASSWORD_SUCCESSFUL,
        emailSignUpWithEmailSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_BG_SIGNUP_WITH_EMAIL_SUCCESSFUL,
        emailSignUpWithGoogleSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_BG_SIGNUP_WITH_GOOGLE_SUCCESSFUL,
        emailAccountSubscriptionCancelation: process.env.SENDGRID_TEMPLATE_EMAIL_BG_ACCOUNT_SUBSCRIPTION_CANCELATION,
        emailAccountInitialPayment: process.env.SENDGRID_TEMPLATE_EMAIL_BG_ACCOUNT_INITIAL_PAYMENT,
        emailReminder1st: process.env.SENDGRID_TEMPLATE_EMAIL_BG_REMINDER_1ST,
        emailReminder2st: process.env.SENDGRID_TEMPLATE_EMAIL_BG_REMINDER_2ST
      },
      fi: {
        emailConfirm: process.env.SENDGRID_TEMPLATE_EMAIL_FI_CONFIRM,
        emailContactUs: process.env.SENDGRID_TEMPLATE_EMAIL_FI_CONTACT_US,
        emailRecoveryPassword: process.env.SENDGRID_TEMPLATE_EMAIL_FI_RECOVERY_PASSWORD,
        emailRecoveryPasswordSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_FI_RECOVERY_PASSWORD_SUCCESSFUL,
        emailSignUpWithEmailSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_FI_SIGNUP_WITH_EMAIL_SUCCESSFUL,
        emailSignUpWithGoogleSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_FI_SIGNUP_WITH_GOOGLE_SUCCESSFUL,
        emailAccountSubscriptionCancelation: process.env.SENDGRID_TEMPLATE_EMAIL_FI_ACCOUNT_SUBSCRIPTION_CANCELATION,
        emailAccountInitialPayment: process.env.SENDGRID_TEMPLATE_EMAIL_FI_ACCOUNT_INITIAL_PAYMENT,
        emailReminder1st: process.env.SENDGRID_TEMPLATE_EMAIL_FI_REMINDER_1ST,
        emailReminder2st: process.env.SENDGRID_TEMPLATE_EMAIL_FI_REMINDER_2ST
      },
      se: {
        emailConfirm: process.env.SENDGRID_TEMPLATE_EMAIL_SE_CONFIRM,
        emailContactUs: process.env.SENDGRID_TEMPLATE_EMAIL_SE_CONTACT_US,
        emailRecoveryPassword: process.env.SENDGRID_TEMPLATE_EMAIL_SE_RECOVERY_PASSWORD,
        emailRecoveryPasswordSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_SE_RECOVERY_PASSWORD_SUCCESSFUL,
        emailSignUpWithEmailSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_SE_SIGNUP_WITH_EMAIL_SUCCESSFUL,
        emailSignUpWithGoogleSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_SE_SIGNUP_WITH_GOOGLE_SUCCESSFUL,
        emailAccountSubscriptionCancelation: process.env.SENDGRID_TEMPLATE_EMAIL_SE_ACCOUNT_SUBSCRIPTION_CANCELATION,
        emailAccountInitialPayment: process.env.SENDGRID_TEMPLATE_EMAIL_SE_ACCOUNT_INITIAL_PAYMENT,
        emailReminder1st: process.env.SENDGRID_TEMPLATE_EMAIL_SE_REMINDER_1ST,
        emailReminder2st: process.env.SENDGRID_TEMPLATE_EMAIL_SE_REMINDER_2ST
      },
      no: {
        emailConfirm: process.env.SENDGRID_TEMPLATE_EMAIL_NO_CONFIRM,
        emailContactUs: process.env.SENDGRID_TEMPLATE_EMAIL_NO_CONTACT_US,
        emailRecoveryPassword: process.env.SENDGRID_TEMPLATE_EMAIL_NO_RECOVERY_PASSWORD,
        emailRecoveryPasswordSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_NO_RECOVERY_PASSWORD_SUCCESSFUL,
        emailSignUpWithEmailSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_NO_SIGNUP_WITH_EMAIL_SUCCESSFUL,
        emailSignUpWithGoogleSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_NO_SIGNUP_WITH_GOOGLE_SUCCESSFUL,
        emailAccountSubscriptionCancelation: process.env.SENDGRID_TEMPLATE_EMAIL_NO_ACCOUNT_SUBSCRIPTION_CANCELATION,
        emailAccountInitialPayment: process.env.SENDGRID_TEMPLATE_EMAIL_NO_ACCOUNT_INITIAL_PAYMENT,
        emailReminder1st: process.env.SENDGRID_TEMPLATE_EMAIL_NO_REMINDER_1ST,
        emailReminder2st: process.env.SENDGRID_TEMPLATE_EMAIL_NO_REMINDER_2ST
      },
      hu: {
        emailConfirm: process.env.SENDGRID_TEMPLATE_EMAIL_HU_CONFIRM,
        emailContactUs: process.env.SENDGRID_TEMPLATE_EMAIL_HU_CONTACT_US,
        emailRecoveryPassword: process.env.SENDGRID_TEMPLATE_EMAIL_HU_RECOVERY_PASSWORD,
        emailRecoveryPasswordSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_HU_RECOVERY_PASSWORD_SUCCESSFUL,
        emailSignUpWithEmailSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_HU_SIGNUP_WITH_EMAIL_SUCCESSFUL,
        emailSignUpWithGoogleSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_HU_SIGNUP_WITH_GOOGLE_SUCCESSFUL,
        emailAccountSubscriptionCancelation: process.env.SENDGRID_TEMPLATE_EMAIL_HU_ACCOUNT_SUBSCRIPTION_CANCELATION,
        emailAccountInitialPayment: process.env.SENDGRID_TEMPLATE_EMAIL_HU_ACCOUNT_INITIAL_PAYMENT,
        emailReminder1st: process.env.SENDGRID_TEMPLATE_EMAIL_HU_REMINDER_1ST,
        emailReminder2st: process.env.SENDGRID_TEMPLATE_EMAIL_HU_REMINDER_2ST
      },
      de: {
        emailConfirm: process.env.SENDGRID_TEMPLATE_EMAIL_DE_CONFIRM,
        emailContactUs: process.env.SENDGRID_TEMPLATE_EMAIL_DE_CONTACT_US,
        emailRecoveryPassword: process.env.SENDGRID_TEMPLATE_EMAIL_DE_RECOVERY_PASSWORD,
        emailRecoveryPasswordSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_DE_RECOVERY_PASSWORD_SUCCESSFUL,
        emailSignUpWithEmailSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_DE_SIGNUP_WITH_EMAIL_SUCCESSFUL,
        emailSignUpWithGoogleSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_DE_SIGNUP_WITH_GOOGLE_SUCCESSFUL,
        emailAccountSubscriptionCancelation: process.env.SENDGRID_TEMPLATE_EMAIL_DE_ACCOUNT_SUBSCRIPTION_CANCELATION,
        emailAccountInitialPayment: process.env.SENDGRID_TEMPLATE_EMAIL_DE_ACCOUNT_INITIAL_PAYMENT,
        emailReminder1st: process.env.SENDGRID_TEMPLATE_EMAIL_DE_REMINDER_1ST,
        emailReminder2st: process.env.SENDGRID_TEMPLATE_EMAIL_DE_REMINDER_2ST
      },
      fr: {
        emailConfirm: process.env.SENDGRID_TEMPLATE_EMAIL_FR_CONFIRM,
        emailContactUs: process.env.SENDGRID_TEMPLATE_EMAIL_FR_CONTACT_US,
        emailRecoveryPassword: process.env.SENDGRID_TEMPLATE_EMAIL_FR_RECOVERY_PASSWORD,
        emailRecoveryPasswordSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_FR_RECOVERY_PASSWORD_SUCCESSFUL,
        emailSignUpWithEmailSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_FR_SIGNUP_WITH_EMAIL_SUCCESSFUL,
        emailSignUpWithGoogleSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_FR_SIGNUP_WITH_GOOGLE_SUCCESSFUL,
        emailAccountSubscriptionCancelation: process.env.SENDGRID_TEMPLATE_EMAIL_FR_ACCOUNT_SUBSCRIPTION_CANCELATION,
        emailAccountInitialPayment: process.env.SENDGRID_TEMPLATE_EMAIL_FR_ACCOUNT_INITIAL_PAYMENT,
        emailReminder1st: process.env.SENDGRID_TEMPLATE_EMAIL_FR_REMINDER_1ST,
        emailReminder2st: process.env.SENDGRID_TEMPLATE_EMAIL_FR_REMINDER_2ST
      },
      hr: {
        emailConfirm: process.env.SENDGRID_TEMPLATE_EMAIL_HR_CONFIRM,
        emailContactUs: process.env.SENDGRID_TEMPLATE_EMAIL_HR_CONTACT_US,
        emailRecoveryPassword: process.env.SENDGRID_TEMPLATE_EMAIL_HR_RECOVERY_PASSWORD,
        emailRecoveryPasswordSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_HR_RECOVERY_PASSWORD_SUCCESSFUL,
        emailSignUpWithEmailSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_HR_SIGNUP_WITH_EMAIL_SUCCESSFUL,
        emailSignUpWithGoogleSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_HR_SIGNUP_WITH_GOOGLE_SUCCESSFUL,
        emailAccountSubscriptionCancelation: process.env.SENDGRID_TEMPLATE_EMAIL_HR_ACCOUNT_SUBSCRIPTION_CANCELATION,
        emailAccountInitialPayment: process.env.SENDGRID_TEMPLATE_EMAIL_HR_ACCOUNT_INITIAL_PAYMENT,
        emailReminder1st: process.env.SENDGRID_TEMPLATE_EMAIL_HR_REMINDER_1ST,
        emailReminder2st: process.env.SENDGRID_TEMPLATE_EMAIL_HR_REMINDER_2ST
      },
      el: { //GREEK name by spec
        emailConfirm: process.env.SENDGRID_TEMPLATE_EMAIL_EL_CONFIRM,
        emailContactUs: process.env.SENDGRID_TEMPLATE_EMAIL_EL_CONTACT_US,
        emailRecoveryPassword: process.env.SENDGRID_TEMPLATE_EMAIL_EL_RECOVERY_PASSWORD,
        emailRecoveryPasswordSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_EL_RECOVERY_PASSWORD_SUCCESSFUL,
        emailSignUpWithEmailSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_EL_SIGNUP_WITH_EMAIL_SUCCESSFUL,
        emailSignUpWithGoogleSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_EL_SIGNUP_WITH_GOOGLE_SUCCESSFUL,
        emailAccountSubscriptionCancelation: process.env.SENDGRID_TEMPLATE_EMAIL_EL_ACCOUNT_SUBSCRIPTION_CANCELATION,
        emailAccountInitialPayment: process.env.SENDGRID_TEMPLATE_EMAIL_EL_ACCOUNT_INITIAL_PAYMENT,
        emailReminder1st: process.env.SENDGRID_TEMPLATE_EMAIL_EL_REMINDER_1ST,
        emailReminder2st: process.env.SENDGRID_TEMPLATE_EMAIL_EL_REMINDER_2ST
      },
      gr: { //GREEK name by IP detect
        emailConfirm: process.env.SENDGRID_TEMPLATE_EMAIL_EL_CONFIRM,
        emailContactUs: process.env.SENDGRID_TEMPLATE_EMAIL_EL_CONTACT_US,
        emailRecoveryPassword: process.env.SENDGRID_TEMPLATE_EMAIL_EL_RECOVERY_PASSWORD,
        emailRecoveryPasswordSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_EL_RECOVERY_PASSWORD_SUCCESSFUL,
        emailSignUpWithEmailSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_EL_SIGNUP_WITH_EMAIL_SUCCESSFUL,
        emailSignUpWithGoogleSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_EL_SIGNUP_WITH_GOOGLE_SUCCESSFUL,
        emailAccountSubscriptionCancelation: process.env.SENDGRID_TEMPLATE_EMAIL_EL_ACCOUNT_SUBSCRIPTION_CANCELATION,
        emailAccountInitialPayment: process.env.SENDGRID_TEMPLATE_EMAIL_EL_ACCOUNT_INITIAL_PAYMENT,
        emailReminder1st: process.env.SENDGRID_TEMPLATE_EMAIL_EL_REMINDER_1ST,
        emailReminder2st: process.env.SENDGRID_TEMPLATE_EMAIL_EL_REMINDER_2ST
      },
      nl: {
        emailConfirm: process.env.SENDGRID_TEMPLATE_EMAIL_NL_CONFIRM,
        emailContactUs: process.env.SENDGRID_TEMPLATE_EMAIL_NL_CONTACT_US,
        emailRecoveryPassword: process.env.SENDGRID_TEMPLATE_EMAIL_NL_RECOVERY_PASSWORD,
        emailRecoveryPasswordSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_NL_RECOVERY_PASSWORD_SUCCESSFUL,
        emailSignUpWithEmailSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_NL_SIGNUP_WITH_EMAIL_SUCCESSFUL,
        emailSignUpWithGoogleSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_NL_SIGNUP_WITH_GOOGLE_SUCCESSFUL,
        emailAccountSubscriptionCancelation: process.env.SENDGRID_TEMPLATE_EMAIL_NL_ACCOUNT_SUBSCRIPTION_CANCELATION,
        emailAccountInitialPayment: process.env.SENDGRID_TEMPLATE_EMAIL_NL_ACCOUNT_INITIAL_PAYMENT,
        emailReminder1st: process.env.SENDGRID_TEMPLATE_EMAIL_NL_REMINDER_1ST,
        emailReminder2st: process.env.SENDGRID_TEMPLATE_EMAIL_NL_REMINDER_2ST
      },
      sk: {
        emailConfirm: process.env.SENDGRID_TEMPLATE_EMAIL_SK_CONFIRM,
        emailContactUs: process.env.SENDGRID_TEMPLATE_EMAIL_SK_CONTACT_US,
        emailRecoveryPassword: process.env.SENDGRID_TEMPLATE_EMAIL_SK_RECOVERY_PASSWORD,
        emailRecoveryPasswordSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_SK_RECOVERY_PASSWORD_SUCCESSFUL,
        emailSignUpWithEmailSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_SK_SIGNUP_WITH_EMAIL_SUCCESSFUL,
        emailSignUpWithGoogleSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_SK_SIGNUP_WITH_GOOGLE_SUCCESSFUL,
        emailAccountSubscriptionCancelation: process.env.SENDGRID_TEMPLATE_EMAIL_SK_ACCOUNT_SUBSCRIPTION_CANCELATION,
        emailAccountInitialPayment: process.env.SENDGRID_TEMPLATE_EMAIL_SK_ACCOUNT_INITIAL_PAYMENT,
        emailReminder1st: process.env.SENDGRID_TEMPLATE_EMAIL_SK_REMINDER_1ST,
        emailReminder2st: process.env.SENDGRID_TEMPLATE_EMAIL_SK_REMINDER_2ST
      },
      cs: {
        emailConfirm: process.env.SENDGRID_TEMPLATE_EMAIL_CS_CONFIRM,
        emailContactUs: process.env.SENDGRID_TEMPLATE_EMAIL_CS_CONTACT_US,
        emailRecoveryPassword: process.env.SENDGRID_TEMPLATE_EMAIL_CS_RECOVERY_PASSWORD,
        emailRecoveryPasswordSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_CS_RECOVERY_PASSWORD_SUCCESSFUL,
        emailSignUpWithEmailSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_CS_SIGNUP_WITH_EMAIL_SUCCESSFUL,
        emailSignUpWithGoogleSuccessful: process.env.SENDGRID_TEMPLATE_EMAIL_CS_SIGNUP_WITH_GOOGLE_SUCCESSFUL,
        emailAccountSubscriptionCancelation: process.env.SENDGRID_TEMPLATE_EMAIL_CS_ACCOUNT_SUBSCRIPTION_CANCELATION,
        emailAccountInitialPayment: process.env.SENDGRID_TEMPLATE_EMAIL_CS_ACCOUNT_INITIAL_PAYMENT,
        emailReminder1st: process.env.SENDGRID_TEMPLATE_EMAIL_CS_REMINDER_1ST,
        emailReminder2st: process.env.SENDGRID_TEMPLATE_EMAIL_CS_REMINDER_2ST
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
  },
  openai:{
    apiKey: process.env.OPENAI_API_KEY
  }
})
