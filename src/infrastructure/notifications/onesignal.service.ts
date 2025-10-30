import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type NotificationPayload = {
  title: string;
  body: string;
  data?: Record<string, any>;
};

@Injectable()
export class OneSignalService {
  private readonly appId: string;
  private readonly restApiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.appId = this.configService.get<string>(process.env.ONE_SIGNAL_APP_ID || '');
    this.restApiKey = this.configService.get<string>(process.env.ONE_SIGNAL_REST_API_KEY || '');
  }

  async sendToExternalUser(externalUserId: string, payload: NotificationPayload): Promise<void> {
    if (!this.appId || !this.restApiKey) return; // silently skip if not configured

    const res = await fetch('https://api.onesignal.com/notifications', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${this.restApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_id: this.appId,
        include_external_user_ids: [externalUserId],
        headings: { en: payload.title },
        contents: { en: payload.body },
        data: payload.data ?? {},
      }),
    });

    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.error('[OneSignal] failed', await res.text());
    }
  }
}


