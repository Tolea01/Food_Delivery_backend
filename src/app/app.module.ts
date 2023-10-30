import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { databaseConfig } from "./config/database";
import { AuthMiddleware } from "./middleware/auth.middleware";
import { publicPaths } from "./config";
import AllModules from "./modules";
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from "nestjs-i18n";
import { i18nConfig } from "./config";

@Module({
  imports: [
    ...AllModules,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => databaseConfig()
    }),
    I18nModule.forRootAsync({
      useFactory: () => i18nConfig(),
      resolvers: [
        new QueryResolver(["lang"]),
        new HeaderResolver(["x-custom-lang"]),
        AcceptLanguageResolver
      ]
    })
  ],
  controllers: [],
  providers: []
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddleware)
      .exclude(...publicPaths)
      .forRoutes("*");
  }
}