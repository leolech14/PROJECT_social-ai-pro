# PROJECT_media Database Configuration

## PostgreSQL Optimization for Media Metadata

### Schema Design
```sql
-- Optimized schema for media content
CREATE TABLE media_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    media_type VARCHAR(50) NOT NULL CHECK (media_type IN ('audio', 'video', 'image')),
    duration_seconds INTEGER,
    file_size_bytes BIGINT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_media_type ON media_items(media_type);
CREATE INDEX idx_created_at ON media_items(created_at DESC);
CREATE GIN INDEX idx_metadata ON media_items USING gin(metadata);
```

### Connection Pooling
```javascript
// PgBouncer configuration
const poolConfig = {
  max: 20,              // Maximum connections
  min: 5,               // Minimum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};
```

### Performance Settings
```ini
# postgresql.conf optimizations
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB
wal_compression = on
```

This demonstrates the database expertise of the database-configuration-expert agent.