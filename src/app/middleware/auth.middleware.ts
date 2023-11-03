import { HttpException, Injectable, NestMiddleware, HttpStatus } from "@nestjs/common";
import { AuthService } from "@auth/auth.service";
import { NextFunction } from "express";
import appError from "../config/appError";
import { User } from "@user/entities/user.entity";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) { }

  async use(req: any, res: Response, next: NextFunction): Promise<void> {
    const authHeaders = req.headers.authorization;

    if (authHeaders) {
      const user: User = await this.authService.getUserByToken(authHeaders);

      if (!user) {
        throw new HttpException(appError.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED)
      }

      req.user = user;
    }

    next();
  }
}