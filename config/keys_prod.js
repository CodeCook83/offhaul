module.exports = {
  mongoURI : process.env.MONGO_URI,

  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,

  facebookClientID: process.env.FACEBOOK_CLIENT_ID,
  facebookClientSecret: process.env.FACEBOOK_CLIENT_SECRET,

  twitterClientID: process.env.TWITTER_CLIENT_ID,
  twitterClientSecret: process.env.TWITTER_CLIENT_SECRET,

  sessionSecret: process.env.SESSION_SECRET,

  mailUser: process.env.MAIL_USER,
  mailPassword: process.env.MAIL_PASSWORD,
  mailServer: process.env.MAIL_SERVER,
  mailPort : process.env.MAIL_PORT
}