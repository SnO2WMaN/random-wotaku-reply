/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: [
    process.env.NEXT_PUBLIC_VERCEL_URL,
  ],
};
module.exports = nextConfig;
