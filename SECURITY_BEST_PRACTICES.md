# 🛡️ Developer Security Best Practices Guide

This guide outlines security practices developers should follow when contributing to the OTT platform.

---

## 1. ✅ Password & Secret Management

### DO's
✅ Use environment variables for all secrets
✅ Generate strong secrets: `python -c "import secrets; print(secrets.token_urlsafe(32))"`
✅ Never log passwords, tokens, or API keys
✅ Rotate secrets regularly
✅ Use different secrets for dev/staging/production

### DON'Ts
❌ Hardcode secrets in code
❌ Commit `.env` file to version control
❌ Share secrets via email or chat
❌ Use weak passwords for testing
❌ Log sensitive user data

### Example
```python
# ✅ CORRECT - Use environment variables
from app.core.config import settings
api_key = settings.STRIPE_SECRET_KEY

# ❌ WRONG - Hardcoded secret
api_key = "sk_live_1234567890"
```

---

## 2. 🔐 Input Validation

### Always Validate User Input

```python
# ✅ CORRECT - Pydantic validation
from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    email: EmailStr = Field(..., description="User email")
    username: str = Field(min_length=3, max_length=30)
    password: str = Field(min_length=12)

# ❌ WRONG - No validation
def create_user(email, username, password):
    # Vulnerable to SQL injection, XSS, etc.
    pass
```

### Use Security Validator for Custom Validation

```python
from app.core.security_utils import SecurityValidator

# Check for SQL injection
is_safe, msg = SecurityValidator.check_sql_injection(user_input)
if not is_safe:
    raise ValueError(msg)

# Check for XSS
is_safe, msg = SecurityValidator.check_xss(user_input)
if not is_safe:
    raise ValueError(msg)

# Sanitize strings
clean_input = SecurityValidator.sanitize_string(user_input)
```

---

## 3. 🔒 Query Security

### Use ORM, Never Raw SQL

```python
# ✅ CORRECT - Using SQLAlchemy ORM
from sqlalchemy.orm import Session
from app.models.user import User

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

# ❌ WRONG - Raw SQL (vulnerable!)
def get_user_by_email_bad(db: Session, email: str):
    query = f"SELECT * FROM users WHERE email = '{email}'"
    return db.execute(query)
```

### Always Use Filters

```python
# ✅ CORRECT - Use filter()
user = db.query(User).filter(User.id == user_id).first()

# ❌ WRONG - String formatting
user = db.query(User).filter(f"id = {user_id}").first()
```

---

## 4. 👤 Authentication & Authorization

### Check User Permissions

```python
from fastapi import Depends
from app.core.dependencies import get_current_active_user

# ✅ CORRECT - Check ownership
@router.get("/users/{user_id}")
def get_user(user_id: int, current_user = Depends(get_current_active_user)):
    user = db.query(User).filter(User.id == user_id).first()
    
    # Check if user owns this resource or is admin
    if current_user.id != user_id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return user

# ❌ WRONG - No permission check
@router.get("/users/{user_id}")
def get_user(user_id: int):
    return db.query(User).filter(User.id == user_id).first()
```

### Prevent IDOR (Insecure Direct Object Reference)

```python
# ✅ CORRECT - Verify ownership
@router.delete("/posts/{post_id}")
def delete_post(post_id: int, current_user = Depends(get_current_active_user)):
    post = db.query(Post).filter(Post.id == post_id).first()
    
    if post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Cannot delete other's post")
    
    db.delete(post)
    return {"message": "Post deleted"}

# ❌ WRONG - Doesn't check ownership
@router.delete("/posts/{post_id}")
def delete_post(post_id: int):
    post = db.query(Post).filter(Post.id == post_id).first()
    db.delete(post)
    return {"message": "Post deleted"}
```

---

## 5. 🔐 Password Handling

### Use Secure Password Hashing

```python
from app.core.security import get_password_hash, verify_password

# ✅ CORRECT - Hash passwords
@router.post("/register")
def register(user_data: UserCreate):
    # Validates strength
    hashed_password = get_password_hash(user_data.password)
    user = User(email=user_data.email, hashed_password=hashed_password)
    db.add(user)
    db.commit()

# ✅ CORRECT - Verify passwords
@router.post("/login")
def login(credentials: LoginRequest):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return create_access_token(user.id)

# ❌ WRONG - Storing plain text passwords
def register_bad(email: str, password: str):
    user = User(email=email, password=password)  # NEVER!
    db.add(user)
    db.commit()
```

---

## 6. 💾 File Upload Security

### Validate File Uploads

```python
from fastapi import UploadFile
from app.core.security_utils import SecurityValidator

# ✅ CORRECT - Validate file
@router.post("/upload")
def upload_file(file: UploadFile):
    # Check extension
    is_valid, msg = SecurityValidator.validate_file_extension(
        file.filename,
        ALLOWED_VIDEO_EXTENSIONS
    )
    if not is_valid:
        raise HTTPException(status_code=400, detail=msg)
    
    # Check size
    if len(file.file.read()) > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=413, detail="File too large")
    
    # Save with unique name
    unique_name = f"{uuid.uuid4()}_{file.filename}"
    save_file(unique_name, file.file)
    return {"filename": unique_name}

# ❌ WRONG - No validation
@router.post("/upload")
def upload_file(file: UploadFile):
    save_file(file.filename, file.file)  # Dangerous!
    return {"filename": file.filename}
```

---

## 7. 🔐 API Key & Token Security

### Handle Tokens Securely

```python
from app.core.security import create_access_token, decode_token

# ✅ CORRECT - Secure token creation
def authenticate_user(email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        logger.warning(f"Failed login attempt: {email}")
        return None
    
    token = create_access_token(user.id)
    return {"access_token": token, "token_type": "bearer"}

# ✅ CORRECT - Validate token
def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# ❌ WRONG - Storing token in code
TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGc..."  # Never hardcode!
```

---

## 8. 🔍 Error Handling

### Don't Leak Information in Errors

```python
# ✅ CORRECT - Generic errors in production
@router.get("/data")
def get_data():
    try:
        data = process_data()
        return data
    except Exception as e:
        logger.error(f"Data processing error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred. Please contact support."
        )

# ❌ WRONG - Exposing internal details
@router.get("/data")
def get_data():
    try:
        data = process_data()
        return data
    except Exception as e:
        # Leaks database/system information!
        raise HTTPException(status_code=500, detail=str(e))
```

---

## 9. 📝 Logging Security

### Log Security Events, Not Secrets

```python
from app.core.security_utils import log_security_event, log_failed_auth_attempt

# ✅ CORRECT - Log events without sensitive data
def login(email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        log_failed_auth_attempt(email, "Invalid credentials")
        raise HTTPException(status_code=401)
    
    log_security_event("LOGIN_SUCCESS", user.id, f"User {email} logged in")
    return create_access_token(user.id)

# ✅ CORRECT - Log suspicious activity
if login_attempts > 5:
    log_suspicious_activity(user.id, "Multiple failed login attempts")
    raise HTTPException(status_code=429, detail="Too many login attempts")

# ❌ WRONG - Logging secrets
logger.info(f"Login: {email} with password {password}")  # Never!
logger.info(f"Token: {access_token}")  # Never!
```

---

## 10. 🔒 CORS & Headers

### Use Correct CORS Configuration

```python
# ✅ CORRECT - Restrict origins
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Specific domain
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # Specific methods
    allow_headers=["Content-Type", "Authorization"],  # Specific headers
)

# ❌ WRONG - Allowing all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Dangerous!
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Security Checklist for Code Review

Before submitting code, verify:

- [ ] No hardcoded secrets or API keys
- [ ] All user inputs validated with Pydantic
- [ ] No raw SQL queries (use ORM)
- [ ] Permission checks on all endpoints
- [ ] Passwords hashed with `get_password_hash()`
- [ ] Tokens validated before use
- [ ] Errors don't leak sensitive information
- [ ] Security events are logged
- [ ] No exposed credentials in logs
- [ ] Files uploaded validated and sanitized
- [ ] API keys required via env variables
- [ ] Database operations use parameterized queries

---

## Common Security Mistakes

| Mistake | Risk | Solution |
|---------|------|----------|
| Hardcoded secrets | Exposure if code leaked | Use environment variables |
| No input validation | SQL injection, XSS | Use Pydantic validators |
| Raw SQL queries | SQL injection | Use SQLAlchemy ORM |
| No auth checks | Unauthorized access | Use `get_current_user` dependency |
| Plain text passwords | Easy password cracking | Use `get_password_hash()` |
| Not checking ownership | IDOR vulnerability | Verify user owns resource |
| Detailed error messages | Information leakage | Use generic error messages |
| Logging secrets | Credential exposure | Never log sensitive data |
| Wild CORS origins | CSRF attacks | Restrict to specific origins |
| No rate limiting | Brute force attacks | Use API rate limiting |

---

## Testing Security

### Run Security Checks

```bash
# Check for known vulnerabilities
pip install safety
safety check

# Find security issues in code
pip install bandit
bandit -r backend/app

# Check dependencies
pip install pip-audit
pip-audit
```

### Write Security Tests

```python
def test_password_strength_validation():
    # Test weak password rejected
    with pytest.raises(ValueError):
        from app.core.security import get_password_hash
        get_password_hash("weak")

def test_sql_injection_prevention():
    # Test malicious input sanitized
    from app.core.security_utils import SecurityValidator
    input_str = "'; DROP TABLE users; --"
    is_safe, _ = SecurityValidator.check_sql_injection(input_str)
    assert not is_safe

def test_user_cannot_access_others_data():
    # Test authorization
    response = client.get("/users/999", headers={"Authorization": f"Bearer {user1_token}"})
    assert response.status_code == 403
```

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [SQLAlchemy Security](https://docs.sqlalchemy.org/en/14/faq/security.html)
- [NIST Guidelines](https://csrc.nist.gov/publications/detail/sp/800-63b/3)

---

## Questions?

Contact the security team for any questions about secure coding practices.

---

**Last Updated:** March 2026
**Version:** 1.0.0
