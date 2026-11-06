/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['my.matterport.com'],
    unoptimized: true
  }
};

export default nextConfig;
