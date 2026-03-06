from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.category import Category
from app.models.video import Video
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
import logging

logger = logging.getLogger(__name__)


class CategoryService:
    """Service for managing content categories"""

    @staticmethod
    def create_category(db: Session, category_data: CategoryCreate) -> Category:
        """Create a new category"""
        db_category = Category(
            **category_data.model_dump()
        )
        db.add(db_category)
        db.commit()
        db.refresh(db_category)
        logger.info(f"Created category: {db_category.slug}")
        return db_category

    @staticmethod
    def get_category_by_id(db: Session, category_id: int) -> Category | None:
        """Get category by ID"""
        return db.query(Category).filter(Category.id == category_id).first()

    @staticmethod
    def get_category_by_slug(db: Session, slug: str) -> Category | None:
        """Get category by slug"""
        return db.query(Category).filter(Category.slug == slug).first()

    @staticmethod
    def get_all_categories(
        db: Session, 
        language: str = 'en',
        skip: int = 0, 
        limit: int = 100,
        active_only: bool = True
    ) -> tuple[list[Category], int]:
        """Get all categories with pagination"""
        query = db.query(Category).filter(Category.language == language)
        
        if active_only:
            query = query.filter(Category.is_active == True)
        
        query = query.order_by(Category.order, Category.name)
        
        total = query.count()
        categories = query.offset(skip).limit(limit).all()
        
        return categories, total

    @staticmethod
    def get_category_with_video_count(
        db: Session, 
        category_id: int
    ) -> dict | None:
        """Get category with video count"""
        result = db.query(
            Category,
            func.count(Video.id).label('video_count')
        ).outerjoin(Video).filter(
            Category.id == category_id
        ).group_by(Category.id).first()
        
        if not result:
            return None
        
        category, video_count = result
        return {
            'category': category,
            'video_count': video_count
        }

    @staticmethod
    def update_category(
        db: Session, 
        category_id: int, 
        category_data: CategoryUpdate
    ) -> Category | None:
        """Update a category"""
        db_category = CategoryService.get_category_by_id(db, category_id)
        
        if not db_category:
            return None
        
        update_data = category_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_category, field, value)
        
        db.add(db_category)
        db.commit()
        db.refresh(db_category)
        logger.info(f"Updated category: {db_category.slug}")
        
        return db_category

    @staticmethod
    def delete_category(db: Session, category_id: int) -> bool:
        """Delete a category"""
        db_category = CategoryService.get_category_by_id(db, category_id)
        
        if not db_category:
            return False
        
        db.delete(db_category)
        db.commit()
        logger.info(f"Deleted category: {db_category.slug}")
        
        return True

    @staticmethod
    def get_default_categories() -> list[dict]:
        """Get default Santhal cultural categories template"""
        return [
            {
                'name': 'Folk Songs',
                'slug': 'folk-songs',
                'description': 'Traditional Santhal folk songs and music',
                'icon': '🎵',
                'color': 'from-purple-500 to-pink-500',
                'order': 1,
                'language': 'en'
            },
            {
                'name': 'Dance',
                'slug': 'dance',
                'description': 'Traditional Santhal dance performances and tutorials',
                'icon': '💃',
                'color': 'from-pink-500 to-red-500',
                'order': 2,
                'language': 'en'
            },
            {
                'name': 'Stories',
                'slug': 'stories',
                'description': 'Folk tales, legends, and cultural stories',
                'icon': '📖',
                'color': 'from-blue-500 to-cyan-500',
                'order': 3,
                'language': 'en'
            },
            {
                'name': 'Education',
                'slug': 'education',
                'description': 'Educational content about Santhal culture and history',
                'icon': '🎓',
                'color': 'from-green-500 to-emerald-500',
                'order': 4,
                'language': 'en'
            },
            {
                'name': 'News',
                'slug': 'news',
                'description': 'Latest news and updates from Santhal communities',
                'icon': '📰',
                'color': 'from-orange-500 to-amber-500',
                'order': 5,
                'language': 'en'
            },
        ]

    @staticmethod
    def seed_categories(db: Session) -> None:
        """Seed default categories (only if none exist)"""
        # Check if categories already exist
        existing_count = db.query(Category).filter(
            Category.language == 'en'
        ).count()
        
        if existing_count > 0:
            logger.info("Categories already exist, skipping seed")
            return
        
        default_categories = CategoryService.get_default_categories()
        
        for cat_data in default_categories:
            db_category = Category(**cat_data)
            db.add(db_category)
        
        db.commit()
        logger.info(f"Seeded {len(default_categories)} default categories")
