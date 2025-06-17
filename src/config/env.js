const dotenv = require('dotenv');
const Joi = require('joi');

dotenv.config();

const envSchema = Joi.object({
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().allow('').optional(),
  DB_DATABASE: Joi.string().required(),
  DB_SOCKET: Joi.string().optional(), // Allow optional socket
  JWT_SECRET: Joi.string().required(),
  PORT: Joi.number().required(),
}).unknown(true);

const { error, value } = envSchema.validate(process.env);
if (error) throw new Error(`Environment validation error: ${error.message}`);

module.exports = value;