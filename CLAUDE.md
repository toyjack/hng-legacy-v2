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

### Development Notes

- Uses PNPM for package management
- Has custom DaisyUI theme configuration 
- Contains TODO items: variant character search suggestions, table view
- Includes debug output (JSON.stringify in character pages)