/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com"],
  },
  // Better error handling for development
  reactStrictMode: false,
};

export default nextConfig;
