import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthCheck(): string {
    return 'Lumen API is up and running!';
  }
}
