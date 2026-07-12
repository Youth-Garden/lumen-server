import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseWrapperInterceptor } from './shared-kernel/interceptors/response-wrapper.interceptor';
import { ExceptionsFilter } from './shared-kernel/filters/exception.filter';
import { createValidationPipe } from './shared-kernel/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.setGlobalPrefix('api');
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

  await app.listen(parseInt(process.env.PORT || '8080', 10), '0.0.0.0');
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
