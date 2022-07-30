/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: { domains: [process.env.VERCEL_URL] },
};
module.exports = nextConfig;
