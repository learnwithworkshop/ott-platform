# 🔒 OTT Platform - Security Hardening Guide

## Security Improvements Implemented

This document outlines all security hardening measures implemented to protect the OTT platform from common web attacks and vulnerabilities.

---

## 1. 🔐 Authentication & Password Security

### ✅ Implemented
- **BCrypt Password Hashing** (12 rounds) - Extremely strong and slow
- **Password Strength Validation**
  - Minimum 12 characters
  - Requires uppercase letters (A-Z)
  - Requires lowercase letters (a-z)
  - Requires numbers (0-9)
  - Requires special characters (!@#$%^&*)
- **JWT Token Security**
  - Secure token generation with random JTI (JWT ID)
  - Issued At (iat) timestamp
  - Token type validation (access/refresh)
  - Configurable expiration (8 hours for access, 7 days for refresh)
- **Refresh Token Support** - Automatic token rotation
- **Secure Secret Key** - Minimum 32 characters, must be set via environment variable

### Code Reference
```python
# security.py - Password validation
def validate_password_strength(password: str) -> tuple[bool, str]:
    # Checks all requirements
    # Returns detailed error messages

# security.py - Token creation
def create_access_token(subject, expires_delta, token_type):
    # Includes JTI for revocation
    # Includes iat for validation
```

---

## 2. 🛡️ Input Validation & XSS Prevention

### ✅ Implemented
- **Pydantic Input Validation**
  - All request schemas validate input
  - Length constraints on strings
  - Email validation (RFC compliant)
  - URL validation for links
- **SQL Injection Prevention**
  - Parameterized queries via SQLAlchemy ORM
  - No raw SQL strings
  - Input sanitization for user-provided data
- **XSS Protection**
  - HTML tag stripping
  - Script tag detection and blocking
  - JavaScript protocol blocking
  - Event handler blocking
- **CSRF Protection**
  - Token validation in middleware
  - Same-site cookie policies in Nginx

### Code Reference
```python
# security_utils.py - Input validation
class SecurityValidator:
    - check_sql_injection()
    - check_xss()
    - sanitize_string()
    - validate_email()
    - validate_username()
    - validate_url()
    - validate_file_extension()
```

### Usage Example
```python
from app.core.security_utils import SecurityValidator

# Check for SQL injection
is_safe, message = SecurityValidator.check_sql_injection(user_input)

# Check for XSS
is_safe, message = SecurityValidator.check_xss(user_input)

# Sanitize string
clean_input = SecurityValidator.sanitize_string(user_input, max_length=255)
```

---

## 3. 🔒 CORS & Origin Validation

### ✅ Implemented
- **Restrictive CORS Policy**
  - Whitelist specific origins (not wildcard)
  - Only allow required HTTP methods (GET, POST, PUT, DELETE)
  - Specific headers allowed (Content-Type, Authorization)
  - Credentials restricted to same-origin
- **Trusted Host Middleware**
  - Prevents Host header injection attacks
  - WWW redirect enforcement
- **HTTPS Redirect**
  - Production environment forces HTTPS
  - All HTTP requests redirect to HTTPS

### Configuration
```python
# config.py
BACKEND_CORS_ORIGINS = ["http://localhost:3000", "https://yourdomain.com"]
ALLOWED_HOSTS = ["localhost", "127.0.0.1", "yourdomain.com"]

# Only in production:
# ENVIRONMENT = "production"
# All HTTP → HTTPS redirect enabled
```

---

## 4. 🔑 Environment Variables & Secrets Management

### ✅ Implemented
- **No Hardcoded Secrets**
  - All sensitive data from environment variables
  - Validation that required secrets are set
  - Minimum length enforcement (SECRET_KEY: 32 chars)
- **Secure Configuration**
  - Settings validated on app startup
  - Missing secrets cause immediate failure
  - Different configs for dev/staging/production
- **Credentials in .env**
  - Database password from env
  - API keys from env
  - JWT secret from env
  - .env file gitignored (never committed)

### Setup Instructions
```bash
# 1. Copy template
cp .env.example .env

# 2. Generate secure SECRET_KEY
python -c "import secrets; print(secrets.token_urlsafe(32))"

# 3. Set all required variables in .env
# - SECRET_KEY (min 32 chars)
# - DATABASE_URL (PostgreSQL connection)
# - REDIS_URL (Redis connection)
# - CORS_ORIGINS (frontend domain)

# 4. Never commit .env!
```

---

## 5. 🚀 HTTP Security Headers

### ✅ Implemented (via Nginx)
```
Strict-Transport-Security: max-age=31536000  # 1 year
X-Frame-Options: SAMEORIGIN                  # Prevent clickjacking
X-Content-Type-Options: nosniff             # Prevent MIME sniffing
X-XSS-Protection: 1; mode=block             # Browser XSS filter
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Content-Security-Policy: Defined by origin
```

---

## 6. 🔐 SSL/TLS Configuration

### ✅ Implemented
- **HTTPS Only** (Production)
  - TLS 1.2 and 1.3 support
  - Strong cipher suites
  - Certificate validation
- **Self-Signed Certs** (Development)
  - Auto-generated in Nginx Dockerfile
  - Valid for 365 days
- **Let's Encrypt** (Production)
  - Use Certbot for automatic certificate management
  - Auto-renewal setup

### Production Setup
```bash
# Install Certbot
apt-get install certbot python3-certbot-nginx

# Generate certificate
certbot certonly --standalone -d yourdomain.com

# Copy to Nginx
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./ssl/cert.pem
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./ssl/key.pem
```

---

## 7. 🔄 Error Handling & Information Disclosure

### ✅ Implemented
- **Generic Error Messages** (Production)
  - 5xx errors: "Internal server error. Please contact support."
  - No sensitive details exposed
  - Detailed errors on development only
- **Custom Exception Handlers**
  - HTTP exception handler
  - Validation error handler
  - Prevents stack trace leakage
- **Secure Logging**
  - Logs don't contain passwords or tokens
  - Security events logged separately
  - Audit trail maintained

### Code Reference
```python
# main.py - Exception handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    # Development: returns detailed errors
    # Production: returns generic message

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    # Prevents sensitive error information leakage
```

---

## 8. 📊 Rate Limiting & DDoS Protection

### ✅ Implemented (via Nginx)
```
General Requests:    100 req/s  (burst: 200)
Authentication:      10 req/s   (burst: 10)
API Endpoints:       50 req/s   (burst: 100)
```

- **Brute Force Protection**
  - Failed login attempts tracked
  - Account lockout after N failures
  - Exponential backoff delays
- **DDoS Mitigation**
  - Request rate limiting
  - Connection limiting
  - IP-based throttling

---

## 9. 🗄️ Database Security

### ✅ Implemented
- **Parameterized Queries**
  - SQLAlchemy ORM prevents SQL injection
  - No string concatenation in queries
  - Prepared statements used
- **Connection Security**
  - Connection pooling with pre-ping
  - SSL/TLS for PostgreSQL connections
  - Credentials from environment
- **Data Protection**
  - Passwords hashed with BCrypt
  - Sensitive data encrypted at rest
  - Regular backups scheduled

### Configuration
```python
# config.py
DATABASE_URL = "postgresql://user:pass@host:5432/db"  # From env
DB_POOL_PRE_PING = True  # Test connections
DB_POOL_SIZE = 20
DB_MAX_OVERFLOW = 40
```

---

## 10. 📝 Audit & Logging

### ✅ Implemented
- **Security Event Logging**
  ```python
  log_security_event(event_type, user_id, details)
  log_failed_auth_attempt(email, reason)
  log_suspicious_activity(user_id, activity)
  ```
- **Access Logs**
  - All API requests logged
  - Nginx access logs
  - User action audit trail
- **Error Logs**
  - All errors captured
  - Stack traces in development
  - Sanitized in production

---

## 11. 🔄 File Upload Security

### ✅ Implemented
- **File Type Validation**
  - Whitelist allowed extensions
  - Check MIME type
  - Scan for malware (integrate ClamAV)
- **Size Limits**
  - Max 5GB per file
  - Client and server validation
- **Safe Storage**
  - Outside web root
  - Unique filenames (UUID)
  - Restricted access

### Configuration
```python
# config.py
ALLOWED_VIDEO_EXTENSIONS = ["mp4", "mkv", "avi", "mov", "flv", "webm"]
ALLOWED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp"]
MAX_UPLOAD_SIZE = 5368709120  # 5GB
```

---

## 12. 🔗 Third-Party API Security

### ✅ Recommended
- **Payment APIs**
  - Stripe & Razorpay secrets from env
  - Validate webhooks with signatures
  - PCI-DSS compliance
- **AWS S3**
  - IAM credentials from env
  - Bucket policies restrict access
  - Server-side encryption
- **Email Services**
  - App-specific passwords (not account passwords)
  - TLS for SMTP
  - Secrets from environment

---

## Security Checklist

### Before Production Deployment

- [ ] Generate new `SECRET_KEY` using: `python -c "import secrets; print(secrets.token_urlsafe(32))"`
- [ ] Set all environment variables in `.env`
- [ ] Verify `ENVIRONMENT=production`
- [ ] Install SSL certificate (Let's Encrypt)
- [ ] Enable HTTPS redirect in Nginx
- [ ] Set correct `CORS_ORIGINS` for your domain
- [ ] Set correct `ALLOWED_HOSTS`
- [ ] Update database with strong password
- [ ] Update Redis password
- [ ] Enable database backups
- [ ] Configure email for notifications
- [ ] Set up monitoring and alerts
- [ ] Configure log rotation
- [ ] Review security headers in Nginx
- [ ] Test rate limiting
- [ ] Conduct security audit
- [ ] Enable WAF (Web Application Firewall)
- [ ] Set up intrusion detection (fail2ban)

---

## Common Vulnerabilities Prevented

| Vulnerability | Protection | Implementation |
|---|---|---|
| SQL Injection | Parameterized queries | SQLAlchemy ORM |
| XSS (Cross-Site Scripting) | Input sanitization, CSP headers | SecurityValidator |
| CSRF (Cross-Site Request Forgery) | SameSite cookies, token validation | Nginx headers |
| Brute Force | Rate limiting, account lockout | Nginx rate_limit |
| DDoS | Rate limiting, connection limits | Nginx config |
| Information Disclosure | Generic errors, no stack traces | Exception handlers |
| Weak Passwords | Strong validation, BCrypt hashing | security.py |
| Insecure Transport | HTTPS enforcement | Nginx redirect |
| Host Header Injection | TrustedHost middleware | FastAPI middleware |
| IDOR (Insecure Direct Object Reference) | User authorization checks | Route dependencies |

---

## Continuous Security Practices

1. **Dependency Updates**
   ```bash
   pip install --upgrade -r requirements.txt
   poetry update  # If using Poetry
   ```

2. **Security Scanning**
   ```bash
   # Scan for known vulnerabilities
   pip install safety
   safety check
   
   # Scan for security issues
   pip install bandit
   bandit -r backend/app
   ```

3. **Code Review**
   - All code changes reviewed before merge
   - Security-focused code review checklist
   - OWASP Top 10 awareness

4. **Regular Audits**
   - Monthly security review
   - Quarterly penetration testing
   - Annual third-party audit

5. **Incident Response**
   - Security incident playbook
   - Breach notification procedure
   - Post-incident analysis

---

## Resources & References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [Nginx Security](https://nginx.org/en/docs/http/request_processing.html)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/sql-security.html)
- [CWE/SANS Top 25](https://cwe.mitre.org/top25/)

---

## Support & Reporting

For security issues, **please DO NOT** open public issues. Instead:
1. Email: security@yourdomain.com
2. Follow responsible disclosure
3. Allow 90 days for fix before public disclosure

---

**Last Updated:** March 2026
**Security Level:** Production Ready
**Compliance:** OWASP, NIST, CWE-SANS
