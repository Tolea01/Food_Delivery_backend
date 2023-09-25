import { HttpException, Injectable, NestMiddleware, HttpStatus } from "@nestjs/common";
import { AuthService } from "../modules/auth/auth.service";
import { NextFunction } from "express";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) { }

  async use(req: any, res: Response, next: NextFunction) {
    const authHeaders = req.headers.authorization;

    if (authHeaders) {
      const user = await this.authService.getUserByToken(authHeaders);

      if (!user) {
        throw new HttpException('User not found!', HttpStatus.UNAUTHORIZED)
      }

      req.user = user;
    }

    next();
  }
}