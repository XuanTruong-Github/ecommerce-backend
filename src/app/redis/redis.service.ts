import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}
  async get<T = any>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }
  async set(key: string, value: any, ttl?: number): Promise<void> {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    if (ttl) {
      await this.redis.set(key, stringValue, 'EX', ttl);
    } else {
      await this.redis.set(key, stringValue);
    }
  }
  // Delete key
  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }

  // Check key exists
  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }

  // Set expire (seconds)
  async expire(key: string, seconds: number): Promise<void> {
    await this.redis.expire(key, seconds);
  }

  // Get raw Redis client để dùng các tính năng nâng cao
  getClient(): Redis {
    return this.redis;
  }
}
