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

    const intervalMs = 10 * 60 * 1000; // Ping every 10 minutes
    this.logger.log(
      `Keep-alive service started for ${backendUrl}/api (active 11:30 AM - 12:00 AM VN time).`,
    );

    // Perform initial ping after 1 minute to avoid blocking bootstrap
    setTimeout(() => {
      this.pingSelf(backendUrl);
    }, 60000);

    setInterval(() => {
      this.pingSelf(backendUrl);
    }, intervalMs);
  }

  private isWithinActiveHours(): boolean {
    const now = new Date();
    const vnHours = (now.getUTCHours() + 7) % 24;
    const vnMinutes = now.getUTCMinutes();
    const currentMinuteOfDay = vnHours * 60 + vnMinutes;

    const startMinuteOfDay = 11 * 60 + 30; // 11:30 AM VN time (UTC+7)
    return currentMinuteOfDay >= startMinuteOfDay;
  }

  private pingSelf(backendUrl: string): void {
    if (!this.isWithinActiveHours()) {
      this.logger.debug(
        'Skipping keep-alive self-ping outside active hours (11:30 AM - 12:00 AM VN time).',
      );
      return;
    }

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
