from .auth import (
    TokenResponse,
    TokenData,
    LoginRequest,
    RegisterRequest,
    PasswordChangeRequest,
    PasswordResetRequest,
    PasswordResetConfirm,
    RefreshTokenRequest,
)

# Aliases banao taaki purane imports bhi kaam karein
Token = TokenResponse
UserLogin = LoginRequest
UserRegister = RegisterRequest