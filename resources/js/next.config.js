/** @type {import('next').NextConfig} */
const nextConfig = {
    staticPageGenerationTimeout: 10000,
    images: {
        domains: ["127.0.0.1", "placehold.co"],
    },
    distDir: "_next",
};

module.exports = nextConfig;
