import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseEntityListener } from './base.listener';
import { RequestContextMiddleware } from './request-context.middleware';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('database.url'),
        autoLoadEntities: true,
        synchronize: process.env.NODE_ENV === 'development',
        subscribers: [BaseEntityListener],
      }),
    }),
  ],
  providers: [BaseEntityListener, RequestContextMiddleware],
  exports: [TypeOrmModule, RequestContextMiddleware],
})
export class DatabaseModule {}
