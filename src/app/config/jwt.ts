const jwtConfig = () => ({
  secret: process.env.JWT_SECRET,
  signOptions: {expiresIn: process.env.JWT_EXPIRE},
})

export default jwtConfig;