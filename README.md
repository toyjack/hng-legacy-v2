# HNG Character Search v2 (HNG単字検索v2)

[![Next.js](https://img.shields.io/badge/Next.js-14.2.8-black?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/DaisyUI-4.12-pink.svg?logo=data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaC02IHctNiBtZDpoLTggbWQ6dy04IiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCA0MTUgNDE1IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHg9IjgyLjUiIHk9IjI5MCIgd2lkdGg9IjI1MCIgaGVpZ2h0PSIxMjUiIHJ4PSI2Mi41IiBmaWxsPSIjMUFEMUE1Ij48L3JlY3Q+PGNpcmNsZSBjeD0iMjA3LjUiIGN5PSIxMzUiIHI9IjEzMCIgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iLjMiPjwvY2lyY2xlPjxjaXJjbGUgY3g9IjIwNy41IiBjeT0iMTM1IiByPSIxMjUiIGZpbGw9IndoaXRlIj48L2NpcmNsZT48Y2lyY2xlIGN4PSIyMDcuNSIgY3k9IjEzNSIgcj0iNTYiIGZpbGw9IiNGRjk5MDMiPjwvY2lyY2xlPjwvc3ZnPg==)](https://v4.daisyui.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

A Next.js web application for searching Chinese character glyphs from the HNG (漢字字体規範史) dataset. This multilingual application supports Japanese, English, and Chinese, providing access to historical Chinese character variations with a modern, responsive interface.

## ✨ Features

- 🔍 **Advanced Character Search** - Search by character, DJT number, DKW number, or unified ID
- 🌍 **Multilingual Support** - Japanese, English, and Chinese interfaces
- 📱 **Responsive Design** - Modern UI with Tailwind CSS and DaisyUI
- 🖼️ **Historical Glyph Display** - View character variations across different historical documents
- 📚 **Document Classification** - Browse manuscripts by era, region, and type
- 🔗 **RESTful API** - Complete API for programmatic access to the dataset
- ⚡ **Fast Performance** - Static generation with Next.js App Router

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PNPM (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/hng-legacy-v2.git
   cd hng-legacy-v2
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Web Interface

1. **Character Search**: Enter a Chinese character in the search box
2. **Browse Results**: View glyph variations organized by document type and era
3. **Document Details**: Click on document names to see metadata
4. **Language Selection**: Switch between Japanese, English, and Chinese interfaces

### API Access

The application provides a comprehensive RESTful API:

```bash
# Search for a character
GET /api/v1/characters/一

# Get character statistics
GET /api/v1/characters/一/stats

# List historical documents
GET /api/v1/books?type=CM&era=初唐写本

# Batch character search
POST /api/v1/characters/batch
Content-Type: application/json
{
  "characters": ["一", "二", "三"],
  "include_variants": true
}
```

**API Documentation**: Visit `/api/v1` for complete endpoint documentation

**API Testing**: Use `/[locale]/api-test` for interactive API testing

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 14.2.8 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + DaisyUI
- **Internationalization**: next-international
- **Icons**: React Icons
- **Package Manager**: PNPM

### Project Structure

```
src/
├── app/
│   ├── [locale]/              # Internationalized pages
│   │   ├── [character]/       # Character detail pages
│   │   ├── api-test/          # API testing interface
│   │   └── layout.tsx         # Root layout
│   └── api/v1/               # RESTful API endpoints
├── components/               # Reusable UI components
├── lib/
│   ├── api/                 # API utilities and database access
│   └── db/                  # Data access layer
├── locales/                 # Internationalization files
├── constant/                # Static data and configurations
└── types.d.ts              # TypeScript type definitions

public/
└── data/tsv/               # Character and document data files
```

### Data Sources

- **main.json**: Character entries with DJT/DKW numbers
- **glyphs.json**: Glyph image metadata and occurrence data
- **books.tsv**: Historical document metadata
- **sub/*.tsv**: Individual document data files

## 🛠️ Development

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm gen-data     # Generate data files (requires Bun)
```

### API Development

- **Route Handlers**: Located in `src/app/api/v1/`
- **Response Utils**: `src/lib/api/response.ts`
- **Database Layer**: `src/lib/api/db.ts`
- **Testing**: Use the built-in API test page at `/[locale]/api-test`

### Adding New Features

1. Follow the existing code structure and naming conventions
2. Add proper TypeScript types
3. Update API documentation if adding new endpoints
4. Test with multiple locales
5. Ensure responsive design

## 📊 Data Format

### Character Data
```typescript
interface Record {
  entry: string;      // Main character
  variants: string;   // Variant characters
  id: string;         // Unified ID
  djt: string;        // DJT number
  dkw: string;        // DKW number
  ucs: string;        // Unicode point
}
```

### Glyph Data
```typescript
interface Glyph {
  id: string;         // Glyph ID
  glyph_num: string;  // Glyph number in document
  glyphs: string;     // Character variants
  occerrences: string;// Usage count
  book_id: string;    // Document ID
}
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
# Add any required environment variables here
```

### Customization

- **Theme**: Modify `tailwind.config.ts` for custom styling
- **Locales**: Add new languages in `src/locales/`
- **Data**: Update data files in `public/data/tsv/`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📋 Roadmap

- [x] Internationalization (i18n)
- [x] RESTful API implementation
- [x] Character search functionality
- [x] Historical document browsing
- [ ] Variant character search suggestions (異体字検索候補)
- [ ] Table view for data display
- [ ] Advanced filtering options
- [ ] Export functionality
- [ ] User favorites/bookmarks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- HNG (漢字字体規範史) dataset contributors
- Historical document preservation institutions
- Open source community

## 📞 Support

- **Issues**: Please use the [GitHub Issues](https://github.com/your-username/hng-legacy-v2/issues) page
- **Discussions**: Join our [GitHub Discussions](https://github.com/your-username/hng-legacy-v2/discussions)
- **Documentation**: Check the [CLAUDE.md](CLAUDE.md) file for detailed technical documentation

---

<div align="center">
  <strong>Made with ❤️ for preserving Chinese character history</strong>
</div>