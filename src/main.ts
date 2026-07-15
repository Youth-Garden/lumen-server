import fastifyCookie from '@fastify/cookie';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ExceptionsFilter } from './shared/presentation/filters/exception.filter';
import { ResponseWrapperInterceptor } from './shared/presentation/interceptors/response-wrapper.interceptor';
import { createValidationPipe } from './shared/presentation/pipes/validation.pipe';
import { TypedConfigService } from './shared/infrastructure/config/typed-config.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.setGlobalPrefix('api');

  const configService = app.get(TypedConfigService);
  const cookieSecret = configService.app.cookieSecret;
  const port = configService.app.port;

  await app.register(fastifyCookie, {
    secret: cookieSecret,
  });

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalInterceptors(
    new ResponseWrapperInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
  app.useGlobalFilters(new ExceptionsFilter());
  app.useGlobalPipes(createValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Lumen Backend API')
    .setDescription('Vocabulary Learning API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port, '0.0.0.0');
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
