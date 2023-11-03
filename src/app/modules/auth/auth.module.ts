import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "@user/user.module";
import { JwtModule } from "@nestjs/jwt";
import jwtConfig from "src/app/config/jwt";

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      useFactory: jwtConfig
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {
}
