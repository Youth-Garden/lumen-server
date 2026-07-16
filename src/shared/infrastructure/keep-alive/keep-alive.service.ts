import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import { TypedConfigService } from '../config/typed-config.service';

@Injectable()
export class KeepAliveService implements OnModuleInit {
  private readonly logger = new Logger(KeepAliveService.name);

  constructor(private readonly configService: TypedConfigService) {}

  onModuleInit(): void {
    const backendUrl = this.configService.app.backendUrl;
    if (!backendUrl) {
      this.logger.log(
        'BACKEND_URL is not set. Self-ping keep-alive service is disabled.',
      );
      return;
    }

    const intervalMs = 15 * 60 * 1000; // Ping every 15 minutes
    this.logger.log(
      `Keep-alive service started. Pinging ${backendUrl}/api every 15 minutes.`,
    );

    // Perform initial ping after 1 minute to avoid blocking bootstrap
    setTimeout(() => {
      this.pingSelf(backendUrl);
    }, 60000);

    setInterval(() => {
      this.pingSelf(backendUrl);
    }, intervalMs);
  }

  private pingSelf(backendUrl: string): void {
    const pingUrl = `${backendUrl.replace(/\/$/, '')}/api`;
    this.logger.debug(`Sending keep-alive self-ping to ${pingUrl}...`);
    axios
      .get(pingUrl)
      .then((response) => {
        this.logger.debug(
          `Keep-alive self-ping successful: ${JSON.stringify(response.data)}`,
        );
      })
      .catch((error: Error) => {
        this.logger.warn(`Keep-alive self-ping failed: ${error.message}`);
      });
  }
}
