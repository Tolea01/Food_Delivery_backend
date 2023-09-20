import { ConfigService } from "@nestjs/config";

const jwtConfig = (configService: ConfigService) => ({
  secret: configService.get('JWT_SECRET'),
  signOptions: {expiresIn: '30d'},
})

export default jwtConfig;