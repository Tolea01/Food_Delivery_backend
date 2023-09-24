import { ConfigService } from "@nestjs/config";

const jwtConfig = (configService: ConfigService) => ({
  secret: configService.get('JWT_SECRET'),
  signOptions: {expiresIn: configService.get('JWT_EXPIRE')},
})

export default jwtConfig;