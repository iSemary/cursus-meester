/** @type {import('next').NextConfig} */
const nextConfig = {
    staticPageGenerationTimeout: 1000,
    images: {
        domains: [
            "127.0.0.1",
            "placehold.co",
        ],
    },
};

module.exports = nextConfig;
