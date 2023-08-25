declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      SMTP_PORT: string;
      DATABASE_URL: string;
      SMTP_HOST: string;
      SMTP_USERNAME: string;
      SMTP_PASSWORD: string;
      SMTP_PORT: string;
      SMTP_SENDER: string;
      JWT_SECRET: string;
      RECAPTCHA_SECRET_KEY: string;
      SIGN_IN_URL: string;
      RESET_PASSWORD_URL: string;
      CORS_ORIGIN: string;
      FILE_STORAGE_PATH: string;
      GOOGLE_AUTH_CLIENT_ID: string;
    }
  }
}

export {}
