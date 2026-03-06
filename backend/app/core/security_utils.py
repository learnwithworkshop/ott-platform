"""
Security utilities for input validation, rate limiting, and protection against common web attacks.
"""

import re
from typing import List, Tuple, Optional
import logging

logger = logging.getLogger(__name__)


class SecurityValidator:
    """Validate user inputs to prevent injection attacks and malicious data."""
    
    # SQL Injection patterns
    SQL_INJECTION_PATTERNS = [
        r"(\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\b)",
        r"(--|#|;)",  # SQL comments
        r"(\*\*|xp_|sp_)",  # Dangerous procedures
        r"(EXEC|EXECUTE)\s*\(",
    ]
    
    # XSS patterns
    XSS_PATTERNS = [
        r"<script[^>]*>.*?</script>",
        r"javascript:",
        r"on\w+\s*=",
        r"<iframe",
        r"<embed",
        r"<object",
    ]
    
    @staticmethod
    def sanitize_string(text: str, max_length: int = 255) -> str:
        """
        Sanitize string input.
        - Remove HTML/script tags
        - Limit length
        - Strip whitespace
        """
        if not text:
            return ""
        
        if len(text) > max_length:
            text = text[:max_length]
        
        # Remove HTML tags
        text = re.sub(r"<[^>]+>", "", text)
        
        # Strip whitespace
        text = text.strip()
        
        return text
    
    @staticmethod
    def check_sql_injection(text: str) -> Tuple[bool, str]:
        """
        Check for SQL injection patterns.
        Returns: (is_safe, message)
        """
        if not text:
            return True, "Safe"
        
        text_upper = text.upper()
        
        for pattern in SecurityValidator.SQL_INJECTION_PATTERNS:
            if re.search(pattern, text_upper, re.IGNORECASE):
                return False, f"Suspicious SQL pattern detected: {pattern}"
        
        return True, "Safe"
    
    @staticmethod
    def check_xss(text: str) -> Tuple[bool, str]:
        """
        Check for XSS patterns.
        Returns: (is_safe, message)
        """
        if not text:
            return True, "Safe"
        
        text_lower = text.lower()
        
        for pattern in SecurityValidator.XSS_PATTERNS:
            if re.search(pattern, text_lower):
                return False, f"Suspicious XSS pattern detected"
        
        return True, "Safe"
    
    @staticmethod
    def validate_email(email: str) -> Tuple[bool, str]:
        """
        Enhanced email validation.
        Returns: (is_valid, message)
        """
        # Basic pattern
        pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        
        if not re.match(pattern, email):
            return False, "Invalid email format"
        
        if len(email) > 255:
            return False, "Email too long"
        
        if ".." in email:
            return False, "Invalid email format"
        
        return True, "Valid"
    
    @staticmethod
    def validate_username(username: str, min_length: int = 3, max_length: int = 30) -> Tuple[bool, str]:
        """
        Validate username.
        - Alphanumeric and underscore only
        - No leading/trailing underscores
        Returns: (is_valid, message)
        """
        if not username or len(username) < min_length or len(username) > max_length:
            return False, f"Username must be {min_length}-{max_length} characters"
        
        if not re.match(r"^[a-zA-Z0-9_]+$", username):
            return False, "Username can only contain letters, numbers, and underscores"
        
        if username.startswith("_") or username.endswith("_"):
            return False, "Username cannot start or end with underscore"
        
        return True, "Valid"
    
    @staticmethod
    def validate_url(url: str) -> Tuple[bool, str]:
        """
        Validate URL.
        Returns: (is_valid, message)
        """
        pattern = r"^https?://[a-zA-Z0-9.-]+(:[0-9]+)?(/[a-zA-Z0-9._~:/?#\[\]@!$&'()*+,;=-]*)?$"
        
        if not re.match(pattern, url):
            return False, "Invalid URL format"
        
        if len(url) > 2048:
            return False, "URL too long"
        
        return True, "Valid"
    
    @staticmethod
    def validate_file_extension(filename: str, allowed_extensions: List[str]) -> Tuple[bool, str]:
        """
        Validate file extension.
        Returns: (is_valid, message)
        """
        if not filename:
            return False, "Filename is empty"
        
        # Get extension
        parts = filename.rsplit(".", 1)
        if len(parts) != 2:
            return False, "No file extension"
        
        extension = parts[1].lower()
        
        if extension not in allowed_extensions:
            return False, f"File extension .{extension} not allowed"
        
        return True, "Valid"


class RateLimiter:
    """Rate limiting helper for preventing brute force attacks."""
    
    @staticmethod
    def get_rate_limit_key(ip: str, endpoint: str) -> str:
        """Generate rate limit key for IP and endpoint."""
        return f"rate_limit:{ip}:{endpoint}"
    
    @staticmethod
    def get_brute_force_key(email: str, action: str = "login") -> str:
        """Generate brute force protection key for email."""
        return f"brute_force:{email}:{action}"


class PasswordPolicy:
    """Password policy enforcement."""
    
    @staticmethod
    def is_password_compromised(password: str) -> bool:
        """
        Check if password is in common compromised password list.
        In production, integrate with Have I Been Pwned API.
        """
        # List of common weak passwords to reject
        weak_passwords = [
            "password", "123456", "password123", "admin", "letmein",
            "qwerty", "12345678", "football", "123123", "1234567890"
        ]
        
        return password.lower() in weak_passwords
    
    @staticmethod
    def get_password_strength(password: str) -> Tuple[int, str]:
        """
        Calculate password strength score (0-5).
        Returns: (score, description)
        """
        score = 0
        
        if len(password) >= 12:
            score += 1
        if len(password) >= 16:
            score += 1
        if any(c.isupper() for c in password):
            score += 1
        if any(c.islower() for c in password):
            score += 1
        if any(c.isdigit() for c in password):
            score += 1
        if any(c in "!@#$%^&*()_+-=[]{}';:\",.<>?" for c in password):
            score += 1
        
        descriptions = {
            0: "Very Weak",
            1: "Weak",
            2: "Fair",
            3: "Good",
            4: "Strong",
            5: "Very Strong",
            6: "Excellent"
        }
        
        return min(score, 6), descriptions.get(min(score, 6), "Unknown")


# Security logging
def log_security_event(event_type: str, user_id: Optional[int], details: str):
    """Log security events for audit trail."""
    logger.warning(f"SECURITY_EVENT - Type: {event_type}, User: {user_id}, Details: {details}")


def log_failed_auth_attempt(email: str, reason: str):
    """Log failed authentication attempts."""
    logger.warning(f"AUTH_FAILED - Email: {email}, Reason: {reason}")


def log_suspicious_activity(user_id: Optional[int], activity: str):
    """Log suspicious user activity."""
    logger.warning(f"SUSPICIOUS_ACTIVITY - User: {user_id}, Activity: {activity}")
