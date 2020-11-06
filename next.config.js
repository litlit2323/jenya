const withImages = require("next-images")
const withFonts = require('next-fonts')
require('dotenv').config()

module.exports = withImages(withFonts({
    env: {
        // HOST_URL: process.env.HOST_URL,
        HOST_URL: "https://avista.vercel.app",
        PORT: process.env.PORT,
        // MONGO_URI: "mongodb://localhost:27017/avista",
        MONGO_URI: process.env.MONGO_URI,
        EMAIL: process.env.EMAIL,
        PASSWORD: process.env.PASSWORD,
        EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
        EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
        SECRET: process.env.SECRET
    },
}))