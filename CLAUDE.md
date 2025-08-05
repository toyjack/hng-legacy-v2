# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HNG単字検索v2 (HNG Character Search v2) is a Next.js application for searching Chinese character glyphs from the HNG (漢字字体規範史) dataset. It's a multilingual web application supporting Japanese, English, and Chinese that displays historical Chinese character variations.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run gen-data` - Generate data files (runs with Bun)

## Architecture

### Key Technologies
- **Next.js 14.2.8** with App Router and static generation
- **next-international** for i18n with locale-based routing (`[locale]`)
- **TypeScript** with custom type definitions
- **Tailwind CSS** + **DaisyUI** for styling with custom "hng" theme
- **React Icons** for UI elements

### Directory Structure

- `src/app/[locale]/` - Internationalized pages with dynamic routing
  - `page.tsx` - Home page with search form
  - `[character]/page.tsx` - Character detail page showing glyph variations
  - `layout.tsx` - Root layout with theme and i18n setup
- `src/components/` - Reusable UI components (header, footer, search form, etc.)
- `src/lib/db/` - Database functions for character/glyph lookups
- `src/constant/` - Static data imports (books, glyphs, main character data)
- `src/locales/` - i18n configuration and translations
- `public/data/tsv/` - TSV data files for characters and books

### Data Architecture

The app uses JSON data files for character lookups:
- `main.json` - Main character entries with DJT (大字典) and DKW (大漢和) numbers
- `glyphs.json` - Glyph image data with book IDs and occurrence info
- `books.tsv` - Book metadata and classifications
- `sub/*.tsv` - Individual book data files

Character search flow:
1. User searches for character in `SearchForm`
2. Routes to `/[locale]/[character]` 
3. `getEntryByChar()` finds character in main data and associated glyphs
4. Displays glyph images from external host `hng-images.kojisho.com`

### Type Definitions

Core types in `src/types.d.ts`:
- `Record` - Character entry with variants, DJT/DKW numbers
- `Glyph` - Individual glyph with book ID, occurrence data

### Image Handling  

Character glyph images are served from external domain `hng-images.kojisho.com` with Next.js Image optimization disabled in config.

## RESTful API

### API Structure

The project includes a comprehensive RESTful API built with Next.js Route Handlers:

- **Base URL**: `/api/v1`
- **Response Format**: Standardized JSON with success/error states
- **Features**: Parameter validation, error handling, pagination, filtering

### Key API Endpoints

#### Character Search
- `GET /api/v1/characters/{character}` - Query by character
- `GET /api/v1/characters/search?q={character}` - Search with options
- `GET /api/v1/characters/djt/{djt_number}` - Query by DJT number (5 digits)
- `GET /api/v1/characters/dkw/{dkw_number}` - Query by DKW number (M+5 digits)
- `GET /api/v1/characters/id/{unified_id}` - Query by unified ID
- `POST /api/v1/characters/batch` - Batch character queries (max 50)
- `GET /api/v1/characters/{character}/glyphs` - Get character glyphs with filtering
- `GET /api/v1/characters/{character}/stats` - Character usage statistics

#### Document/Book Management
- `GET /api/v1/books` - List books with pagination and filtering
- `GET /api/v1/books/{book_id}` - Get book details
- `GET /api/v1/book-types` - List book categories
- `GET /api/v1/book-types/{type_id}/books` - Books by category

#### Glyph Images
- `GET /api/v1/glyphs/{glyph_id}` - Get glyph by ID (format: 00001A)
- `GET /api/v1/glyphs/book/{book_id}/glyph/{glyph_number}` - Get glyph by book and number

#### Statistics
- `GET /api/v1/stats` - Database statistics
- `GET /api/v1` - API documentation

### API Implementation

- **Location**: `src/app/api/v1/` - Route handlers
- **Utils**: `src/lib/api/` - Response formatting and database access
- **Testing**: `/[locale]/api-test` - API testing interface

### Query Parameters

- **Pagination**: `page`, `limit` (max 100)
- **Filtering**: `book_type`, `era`, `date_from`, `date_to`, `location`, `authority`
- **Options**: `include_variants`, `include_images`, `fields`

### Development Notes

- Uses PNPM for package management
- Has custom DaisyUI theme configuration 
- Contains TODO items: variant character search suggestions, table view
- Includes debug output (JSON.stringify in character pages)
- API follows RESTful conventions with proper HTTP status codes
- All API responses use consistent JSON format with error handling