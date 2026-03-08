from fastapi import APIRouter
from app.api.v1.routes.auth import router as auth_router
from app.api.v1.routes.users import router as users_router
from app.api.v1.routes.videos import router as videos_router
from app.api.v1.routes.streaming import router as streaming_router
from app.api.v1.routes.subscriptions import router as subscriptions_router
from app.api.v1.routes.categories import router as categories_router

api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(users_router, prefix="/users", tags=["users"])
api_router.include_router(videos_router, prefix="/videos", tags=["videos"])
api_router.include_router(streaming_router, prefix="/streaming", tags=["streaming"])
api_router.include_router(subscriptions_router, prefix="/subscriptions", tags=["subscriptions"])
api_router.include_router(categories_router, prefix="/categories", tags=["categories"])