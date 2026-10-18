const serverUrl = process.env.SERVER_URL ?? "http://localhost:4000";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "s3.eu-north-1.amazonaws.com" },
    ],
  },
  reactStrictMode: false,
  // Browser calls to /api/server/* are proxied to the API server, so they stay
  // same-origin and carry the session cookie.
  async rewrites() {
    return [{ source: "/api/server/:path*", destination: `${serverUrl}/:path*` }];
  },
};

export default nextConfig;
