/**
 * Enterprise Cache Service
 * Multi-layer caching with memory, localStorage, and Redis support
 */

import { CacheService } from '@/lib/api/types';

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  tags?: string[];
  version?: string;
}

export interface CacheConfig {
  defaultTtl: number; // in seconds
  maxMemorySize: number; // max entries in memory
  enableLocalStorage: boolean;
  enableRedis: boolean;
  redisUrl?: string;
  keyPrefix: string;
  enableCompression: boolean;
  enableEncryption: boolean;
}

export interface CacheStats {
  memoryHits: number;
  memoryMisses: number;
  localStorageHits: number;
  localStorageMisses: number;
  redisHits: number;
  redisMisses: number;
  totalEntries: number;
  memoryUsage: number;
}

class EnterpriseCache implements CacheService {
  private config: CacheConfig;
  private memoryCache = new Map<string, CacheEntry>();
  private stats: CacheStats = {
    memoryHits: 0,
    memoryMisses: 0,
    localStorageHits: 0,
    localStorageMisses: 0,
    redisHits: 0,
    redisMisses: 0,
    totalEntries: 0,
    memoryUsage: 0,
  };

  constructor(config: CacheConfig) {
    this.config = config;
    
    // Clean up expired entries periodically
    setInterval(() => this.cleanup(), 60000); // Every minute
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    const fullKey = this.buildKey(key);

    try {
      // Try memory cache first
      const memoryResult = this.getFromMemory<T>(fullKey);
      if (memoryResult !== null) {
        this.stats.memoryHits++;
        return memoryResult;
      }
      this.stats.memoryMisses++;

      // Try localStorage
      if (this.config.enableLocalStorage && typeof window !== 'undefined') {
        const localStorageResult = await this.getFromLocalStorage<T>(fullKey);
        if (localStorageResult !== null) {
          this.stats.localStorageHits++;
          // Store in memory for faster access
          await this.setInMemory(fullKey, localStorageResult, this.config.defaultTtl);
          return localStorageResult;
        }
        this.stats.localStorageMisses++;
      }

      // Try Redis (if available)
      if (this.config.enableRedis) {
        const redisResult = await this.getFromRedis<T>(fullKey);
        if (redisResult !== null) {
          this.stats.redisHits++;
          // Store in memory and localStorage for faster access
          await this.setInMemory(fullKey, redisResult, this.config.defaultTtl);
          if (this.config.enableLocalStorage && typeof window !== 'undefined') {
            await this.setInLocalStorage(fullKey, redisResult, this.config.defaultTtl);
          }
          return redisResult;
        }
        this.stats.redisMisses++;
      }

      return null;
    } catch (error) {
      console.warn('Cache get error:', error);
      return null;
    }
  }

  /**
   * Set value in cache
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const fullKey = this.buildKey(key);
    const cacheTtl = ttl || this.config.defaultTtl;

    try {
      // Set in all available cache layers
      await Promise.all([
        this.setInMemory(fullKey, value, cacheTtl),
        this.config.enableLocalStorage && typeof window !== 'undefined' 
          ? this.setInLocalStorage(fullKey, value, cacheTtl)
          : Promise.resolve(),
        this.config.enableRedis 
          ? this.setInRedis(fullKey, value, cacheTtl)
          : Promise.resolve(),
      ]);

      this.stats.totalEntries++;
    } catch (error) {
      console.warn('Cache set error:', error);
    }
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<void> {
    const fullKey = this.buildKey(key);

    try {
      // Delete from all cache layers
      await Promise.all([
        this.deleteFromMemory(fullKey),
        this.config.enableLocalStorage && typeof window !== 'undefined'
          ? this.deleteFromLocalStorage(fullKey)
          : Promise.resolve(),
        this.config.enableRedis
          ? this.deleteFromRedis(fullKey)
          : Promise.resolve(),
      ]);
    } catch (error) {
      console.warn('Cache delete error:', error);
    }
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    try {
      // Clear all cache layers
      await Promise.all([
        this.clearMemory(),
        this.config.enableLocalStorage && typeof window !== 'undefined'
          ? this.clearLocalStorage()
          : Promise.resolve(),
        this.config.enableRedis
          ? this.clearRedis()
          : Promise.resolve(),
      ]);

      this.resetStats();
    } catch (error) {
      console.warn('Cache clear error:', error);
    }
  }

  /**
   * Check if key exists in cache
   */
  async exists(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== null;
  }

  /**
   * Set multiple values
   */
  async setMany<T>(entries: Array<{ key: string; value: T; ttl?: number }>): Promise<void> {
    await Promise.all(
      entries.map(entry => this.set(entry.key, entry.value, entry.ttl))
    );
  }

  /**
   * Get multiple values
   */
  async getMany<T>(keys: string[]): Promise<Array<{ key: string; value: T | null }>> {
    const results = await Promise.all(
      keys.map(async key => ({
        key,
        value: await this.get<T>(key),
      }))
    );

    return results;
  }

  /**
   * Invalidate cache by tags
   */
  async invalidateByTags(tags: string[]): Promise<void> {
    // This is a simplified implementation
    // In a real system, you'd maintain a tag-to-key mapping
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.tags && entry.tags.some(tag => tags.includes(tag))) {
        keysToDelete.push(key);
      }
    }

    await Promise.all(keysToDelete.map(key => this.delete(key)));
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    this.stats.memoryUsage = this.memoryCache.size;
    return { ...this.stats };
  }

  /**
   * Warm up cache with data
   */
  async warmUp<T>(data: Array<{ key: string; value: T; ttl?: number }>): Promise<void> {
    await this.setMany(data);
  }

  // Private methods for memory cache

  private getFromMemory<T>(key: string): T | null {
    const entry = this.memoryCache.get(key);
    
    if (!entry) return null;
    
    if (this.isExpired(entry)) {
      this.memoryCache.delete(key);
      return null;
    }

    return entry.data;
  }

  private async setInMemory<T>(key: string, value: T, ttl: number): Promise<void> {
    // Enforce memory limit
    if (this.memoryCache.size >= this.config.maxMemorySize) {
      this.evictOldestEntries();
    }

    const entry: CacheEntry<T> = {
      data: value,
      timestamp: Date.now(),
      ttl: ttl * 1000, // Convert to milliseconds
    };

    this.memoryCache.set(key, entry);
  }

  private async deleteFromMemory(key: string): Promise<void> {
    this.memoryCache.delete(key);
  }

  private async clearMemory(): Promise<void> {
    this.memoryCache.clear();
  }

  // Private methods for localStorage

  private async getFromLocalStorage<T>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const entry: CacheEntry<T> = JSON.parse(item);
      
      if (this.isExpired(entry)) {
        localStorage.removeItem(key);
        return null;
      }

      return entry.data;
    } catch (error) {
      return null;
    }
  }

  private async setInLocalStorage<T>(key: string, value: T, ttl: number): Promise<void> {
    try {
      const entry: CacheEntry<T> = {
        data: value,
        timestamp: Date.now(),
        ttl: ttl * 1000,
      };

      localStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
      // localStorage might be full or disabled
      console.warn('localStorage set failed:', error);
    }
  }

  private async deleteFromLocalStorage(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('localStorage delete failed:', error);
    }
  }

  private async clearLocalStorage(): Promise<void> {
    try {
      const keys = Object.keys(localStorage);
      const prefixedKeys = keys.filter(key => key.startsWith(this.config.keyPrefix));
      prefixedKeys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.warn('localStorage clear failed:', error);
    }
  }

  // Private methods for Redis (placeholder - implement with actual Redis client)

  private async getFromRedis<T>(key: string): Promise<T | null> {
    // Implement Redis get logic here
    // This is a placeholder
    return null;
  }

  private async setInRedis<T>(key: string, value: T, ttl: number): Promise<void> {
    // Implement Redis set logic here
    // This is a placeholder
  }

  private async deleteFromRedis(key: string): Promise<void> {
    // Implement Redis delete logic here
    // This is a placeholder
  }

  private async clearRedis(): Promise<void> {
    // Implement Redis clear logic here
    // This is a placeholder
  }

  // Utility methods

  private buildKey(key: string): string {
    return `${this.config.keyPrefix}:${key}`;
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() > entry.timestamp + entry.ttl;
  }

  private evictOldestEntries(): void {
    // Remove 10% of oldest entries
    const entriesToRemove = Math.floor(this.config.maxMemorySize * 0.1);
    const sortedEntries = Array.from(this.memoryCache.entries())
      .sort(([, a], [, b]) => a.timestamp - b.timestamp);

    for (let i = 0; i < entriesToRemove && i < sortedEntries.length; i++) {
      this.memoryCache.delete(sortedEntries[i][0]);
    }
  }

  private cleanup(): void {
    // Remove expired entries from memory cache
    for (const [key, entry] of this.memoryCache.entries()) {
      if (this.isExpired(entry)) {
        this.memoryCache.delete(key);
      }
    }
  }

  private resetStats(): void {
    this.stats = {
      memoryHits: 0,
      memoryMisses: 0,
      localStorageHits: 0,
      localStorageMisses: 0,
      redisHits: 0,
      redisMisses: 0,
      totalEntries: 0,
      memoryUsage: 0,
    };
  }
}

// Default cache configuration
const defaultCacheConfig: CacheConfig = {
  defaultTtl: 300, // 5 minutes
  maxMemorySize: 1000,
  enableLocalStorage: true,
  enableRedis: false,
  keyPrefix: 'ecommerce',
  enableCompression: false,
  enableEncryption: false,
};

// Export singleton instance
export const cacheService = new EnterpriseCache(defaultCacheConfig);

// Export for custom configurations
export { EnterpriseCache };
