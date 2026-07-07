import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypedConfigService } from '../../../config/typed-config.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [TypedConfigService],
      useFactory: (config: TypedConfigService) => ({
        type: 'postgres',
        url: config.database.url,
        autoLoadEntities: true,
        synchronize: true, // Only for dev mode
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
