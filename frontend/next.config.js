/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    },
};

module.exports = nextConfig;
