/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "yxopncyruetrkxwpnxkp.supabase.co",
      "rpovvaebkdbcsxjchvjg.supabase.co",
      "ryayqmrpubcflfbzyaok.supabase.co",
      "ui-avatars.com",
      "bit.ly",
    ],
  },
};

module.exports = nextConfig;
