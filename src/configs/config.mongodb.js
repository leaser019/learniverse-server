const production = {
  database: {
    connectionString: process.env.DEV_MONGODB_URI
  }
}
const development = {
  database: {
    connectionString: process.env.PRO_MONGODB_URI
  }
}

const config = {
  production,
  development
}
const env = process.env.NODE_ENV || 'development'
const configEnv = config[env]

module.exports = configEnv
