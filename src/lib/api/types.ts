/**
 * Standardized API Types and Response Formats
 * Enterprise-level type definitions for consistent API communication
 */

// Base API Response Format
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: ValidationError[];
  meta?: ResponseMeta;
}

// Response metadata
export interface ResponseMeta {
  timestamp: string;
  requestId: string;
  version: string;
  pagination?: PaginationMeta;
  rateLimit?: RateLimitMeta;
}

// Pagination metadata
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Rate limiting metadata
export interface RateLimitMeta {
  limit: number;
  remaining: number;
  reset: number;
}

// Validation error format
export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

// Pagination parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Filter parameters base
export interface FilterParams {
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

// Request context
export interface RequestContext {
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  ip?: string;
  locale?: string;
  timezone?: string;
}

// Service response wrapper
export interface ServiceResponse<T = any> {
  data?: T;
  error?: Error;
  success: boolean;
  meta?: {
    duration: number;
    cached: boolean;
    source: string;
  };
}

// Repository interface
export interface Repository<T, K = string> {
  findById(id: K): Promise<T | null>;
  findAll(params?: PaginationParams & FilterParams): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: K, data: Partial<T>): Promise<T>;
  delete(id: K): Promise<boolean>;
  count(params?: FilterParams): Promise<number>;
}

// Service interface
export interface Service<T, K = string> {
  get(id: K): Promise<ServiceResponse<T>>;
  list(params?: PaginationParams & FilterParams): Promise<ServiceResponse<T[]>>;
  create(data: Partial<T>): Promise<ServiceResponse<T>>;
  update(id: K, data: Partial<T>): Promise<ServiceResponse<T>>;
  delete(id: K): Promise<ServiceResponse<boolean>>;
}

// Cache interface
export interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  exists(key: string): Promise<boolean>;
}

// Event interface
export interface DomainEvent {
  id: string;
  type: string;
  aggregateId: string;
  aggregateType: string;
  data: any;
  metadata: {
    timestamp: string;
    version: number;
    userId?: string;
    correlationId?: string;
  };
}

// Event handler interface
export interface EventHandler<T extends DomainEvent = DomainEvent> {
  handle(event: T): Promise<void>;
  canHandle(event: DomainEvent): boolean;
}

// Query interface
export interface Query {
  type: string;
  params: any;
}

// Query handler interface
export interface QueryHandler<T extends Query = Query, R = any> {
  handle(query: T): Promise<R>;
  canHandle(query: Query): boolean;
}

// Command interface
export interface Command {
  type: string;
  data: any;
  metadata: {
    userId?: string;
    correlationId?: string;
    timestamp: string;
  };
}

// Command handler interface
export interface CommandHandler<T extends Command = Command, R = any> {
  handle(command: T): Promise<R>;
  canHandle(command: Command): boolean;
}

// Audit log entry
export interface AuditLogEntry {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  oldValues?: any;
  newValues?: any;
  timestamp: string;
  ip?: string;
  userAgent?: string;
  metadata?: any;
}

// Health check result
export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'degraded';
  checks: {
    [key: string]: {
      status: 'healthy' | 'unhealthy';
      message?: string;
      duration?: number;
      timestamp: string;
    };
  };
  timestamp: string;
  version: string;
}

// Configuration interface
export interface AppConfig {
  app: {
    name: string;
    version: string;
    environment: string;
    debug: boolean;
  };
  api: {
    baseUrl: string;
    timeout: number;
    retries: number;
    rateLimit: {
      windowMs: number;
      max: number;
    };
  };
  auth: {
    jwtSecret: string;
    jwtExpiration: string;
    refreshTokenExpiration: string;
    bcryptRounds: number;
  };
  database: {
    url: string;
    maxConnections: number;
    timeout: number;
  };
  cache: {
    ttl: number;
    maxSize: number;
  };
  logging: {
    level: string;
    format: string;
  };
}

// Feature flag interface
export interface FeatureFlag {
  key: string;
  enabled: boolean;
  description?: string;
  conditions?: {
    userIds?: string[];
    roles?: string[];
    percentage?: number;
    startDate?: string;
    endDate?: string;
  };
}

// Metrics interface
export interface Metrics {
  requests: {
    total: number;
    success: number;
    error: number;
    averageResponseTime: number;
  };
  users: {
    active: number;
    registered: number;
    online: number;
  };
  business: {
    orders: number;
    revenue: number;
    conversion: number;
  };
  system: {
    uptime: number;
    memory: number;
    cpu: number;
    disk: number;
  };
}
