# Nginx Configuration for OTT Platform

## Overview
Production-ready Nginx reverse proxy configuration for the OTT Platform with complete frontend and backend routing, SSL/TLS support, rate limiting, and security headers.

## Features

### 🔒 Security
- **SSL/TLS Support** - HTTPS only with HTTP redirect
- **Security Headers** - HSTS, CSP, X-Frame-Options, etc.
- **Rate Limiting** - DDoS protection for API endpoints
- **Input Validation** - Client max body size limits

### 📊 Performance
- **Gzip Compression** - For all text/API responses
- **Caching Headers** - Static file caching (30 days)
- **Connection Pooling** - Keepalive connections to upstreams
- **Load Balancing** - Least connections algorithm

### 🎬 Streaming Support
- **WebSocket Support** - For real-time features
- **Byte Range Requests** - For seeking in videos
- **Large File Uploads** - 5GB max body size
- **Buffering Control** - Optimized for video streaming

### 📍 Routing
```
/                          → Frontend (Next.js on :3000)
/api/v1/*                  → Backend API (FastAPI on :8000)
/api/v1/streaming/stream/* → Video Streaming (special handling)
/api/v1/auth/*             → Auth endpoints (rate limited)
/flower/*                  → Celery Dashboard (monitoring)
/api/docs                  → Swagger Documentation
/health                    → Health check endpoint
```

## SSL/TLS Certificate Setup

### Option 1: Self-Signed Certificate (Development)
The Dockerfile automatically generates a self-signed certificate valid for 365 days.

### Option 2: Let's Encrypt (Production)
```bash
# Install Certbot
apt-get install certbot python3-certbot-nginx

# Generate certificate
certbot certonly --standalone -d yourdomain.com

# Copy certificate to nginx
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./ssl/cert.pem
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./ssl/key.pem

# Update nginx.conf with your domain
```

### Option 3: Manual Certificate
Place your existing certificates in `./ssl/` directory:
- `cert.pem` - SSL certificate
- `key.pem` - Private key

## Rate Limiting Zones

| Zone | Limit | Usage |
|------|-------|-------|
| general | 100 req/s | Frontend requests |
| auth | 10 req/s | Login/Register endpoints |
| api | 50 req/s | General API endpoints |

## Upstream Configuration

### Frontend Upstream
- Server: `frontend:3000`
- Strategy: Least connections
- Health Check: 3 failures = 30s timeout

### Backend Upstream
- Server: `backend:8000`
- Strategy: Least connections
- Health Check: 3 failures = 30s timeout

### Flower Upstream (Monitoring)
- Server: `flower:5555`
- Used for Celery task monitoring dashboard

## Proxy Settings

### Standard API Requests
- Connection timeout: 600s
- Read timeout: 600s
- Write timeout: 600s
- Buffer size: 16k
- Max buffers: 256 x 4k

### Video Streaming
- Connection timeout: 7d
- Read timeout: 7d
- Write timeout: 7d
- Buffering: Disabled
- Request buffering: Disabled
- Range requests: Enabled

## Gzip Compression

Automatically compresses:
- text/plain
- text/css
- text/xml
- text/javascript
- application/javascript
- application/json
- application/rss+xml
- image/svg+xml
- font files (woff, woff2, ttf)

Minimum file size: 1KB

## Health Check Endpoint

```bash
# Test health
curl http://localhost/health

# Response
healthy
```

## Logging

### Access Log
- Path: `/var/log/nginx/access.log`
- Format: Combined log format
- Buffer: 32KB, flush every 5s

### Error Log
- Path: `/var/log/nginx/error.log`
- Level: Warning

## Building the Docker Image

```bash
# Build
docker build -t ott-nginx .

# Run
docker run -p 80:80 -p 443:443 \
  -v ./ssl:/etc/nginx/ssl:ro \
  ott-nginx
```

## Testing Configuration

```bash
# Test Nginx configuration
docker run --rm -v $(pwd):/etc/nginx:ro nginx:alpine nginx -t

# View configuration
docker exec <container-id> nginx -T
```

## Performance Tuning

### Worker Connections
Currently: `auto` (based on CPU cores)
Adjust in `nginx.conf` if needed:
```
worker_processes 8;  # For 8 cores
worker_connections 4096;
```

### Compression
Compression quality: 6 (default, balanced)
Adjust for more compression (slower) or less (faster):
```
gzip_comp_level 9;  # Maximum compression
```

## Troubleshooting

### 502 Bad Gateway
- Backend service not running
- Check upstream server connectivity
- Review proxy timeout settings

### SSL Certificate Errors
- Certificate files not found in `/etc/nginx/ssl/`
- Certificate expired
- Wrong certificate path in config

### Slow Streaming
- Increase `proxy_buffer_size`
- Disable `proxy_buffering` (already done)
- Check network bandwidth

## Production Checklist

- [ ] Replace self-signed certificate with Let's Encrypt
- [ ] Configure custom domain in nginx.conf
- [ ] Update CORS headers for your frontend domain
- [ ] Enable SSL session caching
- [ ] Set up log rotation
- [ ] Configure backup certificates
- [ ] Test failover scenarios
- [ ] Monitor error logs
- [ ] Set up rate limiting per customer
- [ ] Enable ModSecurity/WAF (optional)
