This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🔍 SEO Optimizations

The NPZ Viewer includes several SEO optimizations to improve discoverability and user experience:

### Metadata and Open Graph

- Enhanced metadata with detailed descriptions and keywords
- Open Graph and Twitter card support for better social media sharing
- Custom 404 page with proper SEO settings

### Search Engine Support

- Dynamic sitemap generation
- Robots.txt configuration
- JSON-LD structured data for rich search results

### PWA Support

- Web app manifest for Progressive Web App capabilities
- Icons for various device sizes

### Required Assets

For full SEO functionality, please create the following assets:

1. Social media images:

   - `/public/og-image.jpg` (1200x630px)
   - `/public/twitter-image.jpg` (1200x600px)

2. PWA icons:

   - `/public/icon-192x192.png`
   - `/public/icon-512x512.png`

3. Update the Google verification code in `layout.tsx` with your actual verification code.
