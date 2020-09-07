require('dotenv').config();
const config = {
    PORT: process.env.PORT,
    URL_DB: process.env.URL_DB,
    JWT_SEED: process.env.JWT_SEED,
    TOKEN_EXPIRATION: eval(process.env.TOKEN_EXPIRATION),
};

module.exports = config;