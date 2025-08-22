/**
 * Base Service Class
 * Abstract service layer with common functionality for all domain services
 */

import { httpClient } from './http-client';
import { 
  Service, 
  ServiceResponse, 
  PaginationParams, 
  FilterParams,
  CacheService,
  AuditLogEntry 
} from './types';
import { BaseError, ErrorCode, ErrorSeverity } from '@/lib/errors/types';
import { handleError } from '@/lib/errors/error-handler';

export interface BaseServiceConfig {
  baseUrl: string;
  cacheService?: CacheService;
  enableAudit?: boolean;
  defaultCacheTtl?: number;
}

export abstract class BaseService<T, K = string> implements Service<T, K> {
  protected readonly baseUrl: string;
  protected readonly cacheService?: CacheService;
  protected readonly enableAudit: boolean;
  protected readonly defaultCacheTtl: number;
  protected readonly resourceName: string;

  constructor(resourceName: string, config: BaseServiceConfig) {
    this.resourceName = resourceName;
    this.baseUrl = config.baseUrl;
    this.cacheService = config.cacheService;
    this.enableAudit = config.enableAudit ?? false;
    this.defaultCacheTtl = config.defaultCacheTtl ?? 300; // 5 minutes
  }

  /**
   * Get single resource by ID
   */
  async get(id: K): Promise<ServiceResponse<T>> {
    const startTime = Date.now();
    const cacheKey = this.getCacheKey('get', id);

    try {
      // Try cache first
      if (this.cacheService) {
        const cached = await this.cacheService.get<T>(cacheKey);
        if (cached) {
          return {
            data: cached,
            success: true,
            meta: {
              duration: Date.now() - startTime,
              cached: true,
              source: 'cache',
            },
          };
        }
      }

      // Fetch from API
      const response = await httpClient.get<T>(`${this.baseUrl}/${id}`);

      if (!response.success || !response.data) {
        throw new BaseError({
          code: ErrorCode.NOT_FOUND,
          message: `${this.resourceName} not found`,
          severity: ErrorSeverity.LOW,
        });
      }

      // Cache the result
      if (this.cacheService && response.data) {
        await this.cacheService.set(cacheKey, response.data, this.defaultCacheTtl);
      }

      return {
        data: response.data,
        success: true,
        meta: {
          duration: Date.now() - startTime,
          cached: false,
          source: 'api',
        },
      };
    } catch (error) {
      return {
        error: handleError(error as Error, {
          additionalData: { 
            service: this.resourceName, 
            action: 'get', 
            id 
          },
        }),
        success: false,
        meta: {
          duration: Date.now() - startTime,
          cached: false,
          source: 'error',
        },
      };
    }
  }

  /**
   * List resources with pagination and filtering
   */
  async list(params?: PaginationParams & FilterParams): Promise<ServiceResponse<T[]>> {
    const startTime = Date.now();
    const cacheKey = this.getCacheKey('list', params);

    try {
      // Try cache first
      if (this.cacheService && !params?.search) { // Don't cache search results
        const cached = await this.cacheService.get<T[]>(cacheKey);
        if (cached) {
          return {
            data: cached,
            success: true,
            meta: {
              duration: Date.now() - startTime,
              cached: true,
              source: 'cache',
            },
          };
        }
      }

      // Build query parameters
      const queryParams = this.buildQueryParams(params);
      const url = queryParams ? `${this.baseUrl}?${queryParams}` : this.baseUrl;

      // Fetch from API
      const response = await httpClient.get<T[]>(url);

      if (!response.success) {
        throw new BaseError({
          code: ErrorCode.SERVER_ERROR,
          message: `Failed to fetch ${this.resourceName} list`,
          severity: ErrorSeverity.MEDIUM,
        });
      }

      const data = response.data || [];

      // Cache the result (only if not a search)
      if (this.cacheService && !params?.search) {
        await this.cacheService.set(cacheKey, data, this.defaultCacheTtl);
      }

      return {
        data,
        success: true,
        meta: {
          duration: Date.now() - startTime,
          cached: false,
          source: 'api',
        },
      };
    } catch (error) {
      return {
        error: handleError(error as Error, {
          additionalData: { 
            service: this.resourceName, 
            action: 'list', 
            params 
          },
        }),
        success: false,
        meta: {
          duration: Date.now() - startTime,
          cached: false,
          source: 'error',
        },
      };
    }
  }

  /**
   * Create new resource
   */
  async create(data: Partial<T>): Promise<ServiceResponse<T>> {
    const startTime = Date.now();

    try {
      // Validate data
      await this.validateCreate(data);

      // Create via API
      const response = await httpClient.post<T>(this.baseUrl, data);

      if (!response.success || !response.data) {
        throw new BaseError({
          code: ErrorCode.SERVER_ERROR,
          message: `Failed to create ${this.resourceName}`,
          severity: ErrorSeverity.MEDIUM,
        });
      }

      // Invalidate related caches
      if (this.cacheService) {
        await this.invalidateCache('list');
      }

      // Audit log
      if (this.enableAudit) {
        await this.createAuditLog('create', undefined, response.data);
      }

      return {
        data: response.data,
        success: true,
        meta: {
          duration: Date.now() - startTime,
          cached: false,
          source: 'api',
        },
      };
    } catch (error) {
      return {
        error: handleError(error as Error, {
          additionalData: { 
            service: this.resourceName, 
            action: 'create', 
            data 
          },
        }),
        success: false,
        meta: {
          duration: Date.now() - startTime,
          cached: false,
          source: 'error',
        },
      };
    }
  }

  /**
   * Update existing resource
   */
  async update(id: K, data: Partial<T>): Promise<ServiceResponse<T>> {
    const startTime = Date.now();

    try {
      // Get current data for audit
      let oldData: T | undefined;
      if (this.enableAudit) {
        const current = await this.get(id);
        oldData = current.data;
      }

      // Validate data
      await this.validateUpdate(id, data);

      // Update via API
      const response = await httpClient.put<T>(`${this.baseUrl}/${id}`, data);

      if (!response.success || !response.data) {
        throw new BaseError({
          code: ErrorCode.SERVER_ERROR,
          message: `Failed to update ${this.resourceName}`,
          severity: ErrorSeverity.MEDIUM,
        });
      }

      // Invalidate related caches
      if (this.cacheService) {
        await this.invalidateCache('get', id);
        await this.invalidateCache('list');
      }

      // Audit log
      if (this.enableAudit) {
        await this.createAuditLog('update', oldData, response.data, id);
      }

      return {
        data: response.data,
        success: true,
        meta: {
          duration: Date.now() - startTime,
          cached: false,
          source: 'api',
        },
      };
    } catch (error) {
      return {
        error: handleError(error as Error, {
          additionalData: { 
            service: this.resourceName, 
            action: 'update', 
            id, 
            data 
          },
        }),
        success: false,
        meta: {
          duration: Date.now() - startTime,
          cached: false,
          source: 'error',
        },
      };
    }
  }

  /**
   * Delete resource
   */
  async delete(id: K): Promise<ServiceResponse<boolean>> {
    const startTime = Date.now();

    try {
      // Get current data for audit
      let oldData: T | undefined;
      if (this.enableAudit) {
        const current = await this.get(id);
        oldData = current.data;
      }

      // Delete via API
      const response = await httpClient.delete(`${this.baseUrl}/${id}`);

      if (!response.success) {
        throw new BaseError({
          code: ErrorCode.SERVER_ERROR,
          message: `Failed to delete ${this.resourceName}`,
          severity: ErrorSeverity.MEDIUM,
        });
      }

      // Invalidate related caches
      if (this.cacheService) {
        await this.invalidateCache('get', id);
        await this.invalidateCache('list');
      }

      // Audit log
      if (this.enableAudit) {
        await this.createAuditLog('delete', oldData, undefined, id);
      }

      return {
        data: true,
        success: true,
        meta: {
          duration: Date.now() - startTime,
          cached: false,
          source: 'api',
        },
      };
    } catch (error) {
      return {
        error: handleError(error as Error, {
          additionalData: { 
            service: this.resourceName, 
            action: 'delete', 
            id 
          },
        }),
        success: false,
        meta: {
          duration: Date.now() - startTime,
          cached: false,
          source: 'error',
        },
      };
    }
  }

  // Protected methods for subclasses to override

  protected async validateCreate(data: Partial<T>): Promise<void> {
    // Override in subclasses
  }

  protected async validateUpdate(id: K, data: Partial<T>): Promise<void> {
    // Override in subclasses
  }

  protected buildQueryParams(params?: PaginationParams & FilterParams): string {
    if (!params) return '';

    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    return searchParams.toString();
  }

  protected getCacheKey(action: string, params?: any): string {
    const paramsStr = params ? JSON.stringify(params) : '';
    return `${this.resourceName}:${action}:${paramsStr}`;
  }

  protected async invalidateCache(action: string, params?: any): Promise<void> {
    if (!this.cacheService) return;

    if (action === 'list') {
      // Invalidate all list caches (this is a simplified approach)
      // In a real implementation, you might want to be more specific
      await this.cacheService.delete(`${this.resourceName}:list:`);
    } else {
      const cacheKey = this.getCacheKey(action, params);
      await this.cacheService.delete(cacheKey);
    }
  }

  protected async createAuditLog(
    action: string,
    oldData?: T,
    newData?: T,
    resourceId?: K
  ): Promise<void> {
    try {
      const auditEntry: Partial<AuditLogEntry> = {
        action,
        resource: this.resourceName,
        resourceId: resourceId?.toString(),
        oldValues: oldData,
        newValues: newData,
        timestamp: new Date().toISOString(),
      };

      // Send to audit service (implement based on your audit requirements)
      await httpClient.post('/audit/logs', auditEntry, { 
        skipErrorHandling: true 
      });
    } catch (error) {
      // Don't fail the main operation if audit logging fails
      console.warn('Audit logging failed:', error);
    }
  }
}
