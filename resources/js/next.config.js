/** @type {import('next').NextConfig} */
const nextConfig = {
    staticPageGenerationTimeout: 10000,
    images: {
        domains: ["127.0.0.1", "placehold.co", "abdelrahman.online"],
        unoptimized: true,
    },
    distDir: "_next",
    compress: false,
};

module.exports = nextConfig;
