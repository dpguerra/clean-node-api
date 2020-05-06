export default {
  mongoUrl: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/clean-node-api',
  port: process.env.PORT ?? 5050,
  jwtSecret: process.env.JWT_SECRET ?? '94B765F725AECEE93C12E7FB61791'
}
