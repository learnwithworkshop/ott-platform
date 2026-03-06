# Santhal Community Features Documentation

## Overview

This document describes the comprehensive Santhal Community features added to the OTT Platform, including multi-language support, Ol Chiki script rendering, and cultural content categorization.

## Features Added

### 1. Internationalization (i18n) Support

#### Frontend Implementation
- **Library**: next-i18next with react-i18next
- **Languages Supported**: 
  - English (en)
  - Santhali (sat) - Ol Chiki script

#### Language Switcher Component
Component: `src/components/common/LanguageSwitcher.tsx`

Features:
- Dropdown language selector with flags
- Persistent language preference (localStorage)
- Visual indicator for current language
- Language information tooltip
- Responsive design for mobile and desktop

Usage:
```tsx
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

export default function Navbar() {
  return (
    <nav>
      <LanguageSwitcher />
    </nav>
  );
}
```

#### Translation Files Structure
```
frontend/public/locales/
├── en/
│   ├── common.json    (31 UI strings)
│   ├── nav.json       (7 navigation strings)
│   └── categories.json (18 category translations)
└── sat/
    ├── common.json    (31 UI strings in Santhali)
    ├── nav.json       (7 navigation strings in Santhali)
    └── categories.json (18 category translations in Santhali)
```

### 2. Ol Chiki Script Support

#### Font Configuration
- **Font Family**: Noto Sans Ol Chiki (Google Fonts)
- **Weights**: 400, 500, 600, 700
- **File**: `src/styles/santhali.css`

#### CSS Classes for Santhali
```css
.santhali-text      /* Apply to any Santhali text */
[lang="sat"]        /* HTML lang attribute approach */
.ol-chiki-script    /* Inline Santhali text wrapper */
```

#### Features
- Proper character rendering with correct spacing
- Dark mode support
- Mobile optimization
- Print-friendly styles
- Accessibility improvements

### 3. Content Categories System

#### Category Model
Database table: `categories`

Fields:
- `id`: Primary key
- `name`: Category name (e.g., "Folk Songs")
- `slug`: URL-safe identifier (e.g., "folk-songs")
- `description`: Detailed description
- `icon`: Emoji icon (🎵, 💃, 📖, etc.)
- `color`: Gradient color class for styling
- `order`: Display order
- `language`: Language code (en/sat)
- `is_active`: Visibility flag
- `created_at`, `updated_at`: Timestamps

#### Santhal Cultural Categories

| Category | Icon | Description | Color Gradient |
|----------|------|-------------|-----------------|
| Folk Songs | 🎵 | Traditional Santhal music | purple-pink |
| Dance | 💃 | Traditional dance performances | pink-red |
| Stories | 📖 | Folk tales and legends | blue-cyan |
| Education | 🎓 | Cultural and historical content | green-emerald |
| News | 📰 | Community updates and events | orange-amber |
| Arts & Crafts | 🎨 | Traditional art forms | indigo-purple |
| Festivals | 🎉 | Cultural celebrations | yellow-orange |
| Cuisine | 🍲 | Traditional food recipes | red-pink |
| Wisdom | 💡 | Proverbs and teachings | cyan-blue |

#### Category API Endpoints

**Get all categories**
```bash
GET /api/v1/categories?language=en&skip=0&limit=10
```

Response:
```json
{
  "items": [
    {
      "id": 1,
      "name": "Folk Songs",
      "slug": "folk-songs",
      "description": "Traditional Santhal folk songs and music",
      "icon": "🎵",
      "color": "from-purple-500 to-pink-500",
      "order": 1,
      "is_active": true,
      "language": "en",
      "created_at": "2024-03-06T...",
      "updated_at": "2024-03-06T..."
    }
  ],
  "total": 9,
  "skip": 0,
  "limit": 10
}
```

**Get category by ID**
```bash
GET /api/v1/categories/{category_id}
```

Returns category with video count:
```json
{
  "id": 1,
  "name": "Folk Songs",
  "slug": "folk-songs",
  ...
  "video_count": 42
}
```

**Get category by slug**
```bash
GET /api/v1/categories/slug/folk-songs
```

**Create category** (admin only)
```bash
POST /api/v1/categories
Content-Type: application/json

{
  "name": "Folk Songs",
  "slug": "folk-songs",
  "description": "Traditional Santhal folk songs",
  "icon": "🎵",
  "color": "from-purple-500 to-pink-500",
  "order": 1,
  "language": "en"
}
```

**Update category** (admin only)
```bash
PUT /api/v1/categories/{category_id}
Content-Type: application/json

{
  "name": "Folk Songs Updated",
  "order": 2
}
```

**Delete category** (admin only)
```bash
DELETE /api/v1/categories/{category_id}
```

#### Category Components

**CategorySection Component**
File: `src/components/video/CategorySection.tsx`

Features:
- Multiple view modes: grid, featured, minimal
- Responsive design (mobile to desktop)
- Click handlers for navigation
- Dark mode support
- Hover animations and transitions

Usage:
```tsx
import CategorySection from '@/components/video/CategorySection';

// Featured view with 6 categories
<CategorySection view="featured" limit={6} showAllLink={true} />

// Grid view (default)
<CategorySection view="grid" />

// Minimal pill-based view
<CategorySection view="minimal" limit={5} />
```

**Categories Page**
File: `src/app/categories/page.tsx`

Features:
- Showcase all 9 Santhal categories
- Featured card layout
- Cultural information sections
- Educational content cards
- Responsive layout

### 4. Database Integration

#### Database Initialization

Auto-seeding in `init_db()`:
```python
# Automatically creates 9 default English categories on first run
CategoryService.seed_categories(session)
```

#### Model Relationships
```
User
  ├── videos (cascade delete)
  
Video
  ├── owner (User)
  ├── category (Category)  # NEW
  ├── episodes (cascade delete)
  
Category
  └── videos (foreignkey)  # NEW
```

#### Migration Guide
If adding to existing database:
```bash
# Backend
cd backend
python -c "from app.db.init_db import init_db; init_db()"
```

This will:
1. Create `categories` table
2. Add `category_id` column to `videos` table
3. Seed 9 default categories

## Usage Guide

### For Frontend Developers

#### Using i18n

```tsx
import { useTranslation } from 'react-i18next';

export default function MyComponent() {
  const { t, i18n } = useTranslation('categories');

  return (
    <div>
      <h1>{t('categories')}</h1>
      <p>{t('folkSongsDesc')}</p>
      
      <button onClick={() => i18n.changeLanguage('sat')}>
        Switch to Santhali
      </button>
    </div>
  );
}
```

#### Styling Santhali Text

```tsx
{/* Method 1: CSS class */}
<p className="santhali-text">ᱥᱟᱱᱛᱟᱞᱤ ᱥᱟᱦᱮᱫ</p>

{/* Method 2: Lang attribute */}
<div lang="sat">
  <h1>ᱥᱟᱱᱛᱟᱞ ᱠᱚᱢᱭᱩᱱᱤᱴᱤ ᱵᱨᱚᱰᱠᱟᱥᱴᱤᱝ</h1>
</div>

{/* Method 3: Inline wrapper */}
<span className="ol-chiki-script">ᱥᱟᱱᱛᱟᱞᱤ</span>
```

### For Backend Developers

#### Creating Custom Categories

```python
from app.services.category_service import CategoryService
from app.schemas.category import CategoryCreate
from app.db.session import SessionLocal

db = SessionLocal()

new_category = CategoryService.create_category(
    db,
    CategoryCreate(
        name="My Category",
        slug="my-category",
        description="Custom category",
        icon="🎬",
        color="from-blue-500 to-purple-500",
        order=10,
        language="en"
    )
)
```

#### Querying Categories

```python
# Get all categories with pagination
categories, total = CategoryService.get_all_categories(
    db=db,
    language='en',
    skip=0,
    limit=10,
    active_only=True
)

# Get by slug
category = CategoryService.get_category_by_slug(db, 'folk-songs')

# Get with video count
result = CategoryService.get_category_with_video_count(db, category_id=1)
video_count = result['video_count']
```

### For Content Managers

#### Organizing Videos by Category

1. Upload video through `/api/v1/videos`
2. Set `category_id` in video metadata
3. Video automatically appears in category view
4. Category view shows video count

Example:
```bash
POST /api/v1/videos
Content-Type: multipart/form-data

title=Traditional Dance Performance
description=Santhal traditional dance
category_id=2
file=<video_file>
```

## Deployment Considerations

### Font Loading
- Fonts load from Google Fonts CDN
- Fallback fonts: DejaVu Sans, system sans-serif
- Cached locally for offline support (if configured)

### Translations
- Store in version control
- Update locales folder on each deployment
- Cache-bust translations if needed

### Database
- Run migrations before deploying
- Seed categories once on first deployment
- Backup database before adding category_id to videos

### Performance
- i18n uses React Suspense (configured with fallback)
- CSS is optimized for font rendering
- Categories API supports pagination

## Accessibility

### Santhali Text
- Proper font rendering with correct space allocation
- Line height optimized for script readability
- Color contrast maintained in dark mode
- Screen reader friendly (uses proper lang attributes)

### Language Switcher
- ARIA labels for accessibility
- Keyboard navigation support
- Clear visual indicators for current selection

### Categories
- Semantic HTML structure
- Icon + text combination for clarity
- Sufficient color contrast (WCAG AA)

## Future Enhancements

### Planned Features
1. Santhali language subtitles on videos (sat-IN locale)
2. Community moderation in Santhali
3. Multi-level category hierarchy
4. Category recommendations based on history
5. Content creator category selection UI
6. Advanced category filtering and search

### Optimization Ideas
1. Cache popular category lists
2. Lazy load category videos
3. Implement category-based recommendations
4. Add category trending algorithms

## Troubleshooting

### Ol Chiki Characters Not Rendering
1. Check browser font support (modern browsers required)
2. Verify CSS file is loaded (`santhali.css`)
3. Ensure `[lang="sat"]` or `.santhali-text` class applied
4. Clear browser cache and reload

### Language Switcher Not Working
1. Check i18n initialization in `I18nProvider`
2. Verify translation files exist in `public/locales/[lang]/`
3. Check browser console for translation loading errors
4. Ensure localStorage is enabled

### Categories Not Showing
1. Verify database seeding ran: `init_db()`
2. Check categories table has data: `SELECT * FROM categories`
3. Verify `category_id` foreign key exists on videos table
4. Check API endpoint: `curl http://localhost:8000/api/v1/categories`

## Testing

### Frontend
```bash
# Test i18n
npm test -- i18n

# Test components
npm test -- CategorySection
npm test -- LanguageSwitcher
```

### Backend
```bash
# Test category service
pytest backend/tests/test_categories.py

# Test API endpoints
pytest backend/tests/test_api.py::test_get_categories
```

## Resources

- **Ol Chiki Script**: https://en.wikipedia.org/wiki/Ol_Chiki
- **Santhali Language**: https://en.wikipedia.org/wiki/Santhal_people
- **Google Fonts Ol Chiki**: https://fonts.google.com/noto/specimen/Noto+Sans+Ol+Chiki
- **i18next Docs**: https://www.i18next.com/
- **next-i18next**: https://github.com/isaachinman/next-i18next

---

**Last Updated**: March 6, 2026
**Version**: 1.0
