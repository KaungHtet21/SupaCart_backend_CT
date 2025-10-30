import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const host = this.configService.get('redis.host');
    const port = this.configService.get('redis.port');
    const password = this.configService.get('redis.password');

    if (!host || !port) {
      throw new Error('Redis configuration missing. Set REDIS_HOST and REDIS_PORT.');
    }

    this.client = new Redis({
      host,
      port,
      password,
      lazyConnect: false, // connect immediately
      enableReadyCheck: true,
      enableOfflineQueue: false,
      maxRetriesPerRequest: 1,
      retryStrategy: (times) => Math.min(times * 50, 500),
      reconnectOnError: () => false,
    });

    this.client.on('error', (err) => {
      // Surface connection errors clearly in logs
      // eslint-disable-next-line no-console
      console.error('[Redis] error:', err?.message || err);
    });

    // With lazyConnect=false, the client will start connecting automatically.
    // Do not call connect() here to avoid double-connecting errors.
  }

  async onModuleDestroy() {
    try { await this.client.quit(); } catch {}
  }

  getClient(): Redis | undefined {
    return this.client;
  }

  private async ensureConnected(): Promise<void> {
    if (!this.client) throw new Error('Redis client not initialized');
    if (this.client.status !== 'ready' && this.client.status !== 'connecting') {
      await this.client.connect();
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    await this.ensureConnected();
    if (ttl) await this.client.setex(key, ttl, value);
    else await this.client.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    await this.ensureConnected();
    return await this.client.get(key);
  }

  async del(key: string): Promise<void> {
    await this.ensureConnected();
    await this.client.del(key);
  }

  async publish(channel: string, message: string): Promise<void> {
    if (!this.client) return;
    await this.ensureConnected();
    try { await this.client.publish(channel, message); } catch { /* ignore */ }
  }

  async subscribe(channel: string, callback: (message: string) => void): Promise<void> {
    if (!this.client) return;
    await this.ensureConnected();
    try {
      await this.client.subscribe(channel);
      this.client.on('message', (receivedChannel, message) => {
        if (receivedChannel === channel) callback(message);
      });
    } catch { /* ignore */ }
  }
}
