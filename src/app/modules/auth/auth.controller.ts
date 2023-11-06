import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { CreateUserDto } from "@user/dto/create-user.dto";
import { User } from "@user/entities/user.entity";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { LanguageHeader } from "@app/helpers/language-header";

@ApiBearerAuth()
@ApiTags("Authentification")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post("login")
  @LanguageHeader()
  @ApiOperation({ summary: "User login" })
  async login(@Body() data: LoginDto): Promise<string> {
    return await this.authService.login(data);
  }

  @Post("register")
  @LanguageHeader()
  @ApiOperation({ summary: "User registration" })
  async registerUser(@Body() data: CreateUserDto): Promise<Partial<User>> {
    return await this.authService.registerUser(data);
  }
}