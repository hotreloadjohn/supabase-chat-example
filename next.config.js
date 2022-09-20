/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "yxopncyruetrkxwpnxkp.supabase.co",
      "rpovvaebkdbcsxjchvjg.supabase.co",
      "bit.ly",
    ],
  },
};

module.exports = nextConfig;
