import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import * as Handlebars from 'handlebars';
import { join } from 'path';
import { Resend } from 'resend';
import { AppException, CommonEx } from '../../domain/exceptions';
import { EmailPayload, EmailTemplateName } from './email.types';
import { registerHandlebarsHelpers } from './handlebars.helper';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend;
  private compiledTemplates = new Map<
    EmailTemplateName,
    HandlebarsTemplateDelegate
  >();
  private globalCss: string = '';

  private readonly TEMPLATE_CONFIG: Record<
    EmailTemplateName,
    { from: string; retryAttempts: number; retryDelayMs: number }
  > = {
    'reset-password': {
      from: 'noreply@lumen.app',
      retryAttempts: 3,
      retryDelayMs: 1000,
    },
    'verify-email': {
      from: 'noreply@lumen.app',
      retryAttempts: 3,
      retryDelayMs: 1000,
    },
    welcome: { from: 'welcome@lumen.app', retryAttempts: 2, retryDelayMs: 500 },
    'progress-milestone': {
      from: 'achievements@lumen.app',
      retryAttempts: 1,
      retryDelayMs: 0,
    },
    'quiz-results': {
      from: 'results@lumen.app',
      retryAttempts: 1,
      retryDelayMs: 0,
    },
    'achievement-unlocked': {
      from: 'achievements@lumen.app',
      retryAttempts: 1,
      retryDelayMs: 0,
    },
  };

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>(
      'infrastructure.resend.apiKey',
    )!;
    this.resend = new Resend(apiKey);
  }

  onModuleInit(): void {
    this.logger.debug('Precompiling Handlebars email templates...');
    registerHandlebarsHelpers();
    this.precompileAllTemplates();
    this.logger.debug('✓ Email templates ready');
  }

  private precompileAllTemplates(): void {
    const templateNames = Object.keys(
      this.TEMPLATE_CONFIG,
    ) as EmailTemplateName[];

    // Load global CSS
    try {
      const cssPath = join(__dirname, 'templates', 'styles.css');
      this.globalCss = readFileSync(cssPath, 'utf-8');
    } catch {
      this.logger.warn('Failed to load global styles.css');
    }

    for (const name of templateNames) {
      try {
        const templatePath = join(__dirname, 'templates', `${name}.html`);
        const source = readFileSync(templatePath, 'utf-8');
        const compiled = Handlebars.compile(source);
        this.compiledTemplates.set(name, compiled);
      } catch {
        // We only log a warning here because some templates might not be implemented yet.
        this.logger.warn(
          `Failed to precompile template: ${name} (File not found or invalid)`,
        );
      }
    }
  }

  private renderTemplate(
    templateName: EmailTemplateName,
    data: Record<string, unknown>,
  ): string {
    const compiled = this.compiledTemplates.get(templateName);

    if (!compiled) {
      throw new AppException({
        ...CommonEx.InternalError,
        message: `Template not found: ${templateName}. Available templates: ${Array.from(this.compiledTemplates.keys()).join(', ')}`,
      });
    }

    const globalData = {
      currentYear: new Date().getFullYear(),
      appName: 'Lumen',
      supportEmail: 'support@lumen.app',
      css: this.globalCss,
      ...data,
    };

    return compiled(globalData);
  }

  async send<T extends Record<string, unknown>>(
    payload: EmailPayload<T>,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const { to, templateName, subject, data, cc, bcc } = payload;

    try {
      const html = this.renderTemplate(templateName, data);
      const config = this.TEMPLATE_CONFIG[templateName];

      const result = await this.resend.emails.send({
        from: config.from, // TODO: Replace with verified domain when going to production
        to,
        cc,
        bcc,
        subject,
        html,
      });

      if (result.error) {
        this.logger.error(`Email send failed for ${to}`, result.error.message);
        return { success: false, error: result.error.message };
      }

      this.logger.log(`✓ Email sent to ${to} (template: ${templateName})`);
      return { success: true, messageId: result.data?.id };
    } catch (error) {
      this.logger.error(
        `Email service error for ${to}`,
        (error as Error).message,
      );
      return { success: false, error: (error as Error).message };
    }
  }
}
