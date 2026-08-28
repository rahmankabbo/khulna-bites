/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Local images live in /public. Add remote patterns here if you later
    // hotlink external cover images.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
