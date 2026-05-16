/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable caching for static assets
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Exclude HTML pages from long-term caching
        source: '/:path*.{html}',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
  
  // Optimize for production
  reactStrictMode: true,
  
  // Enable static export if needed
  output: 'standalone',
};

module.exports = nextConfig;

// Disable TypeScript type checking during build
nextConfig.typescript = { ignoreBuildErrors: true };