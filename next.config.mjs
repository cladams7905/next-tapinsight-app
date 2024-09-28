/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async headers() {
    return [
      {
        // Apply headers to all routes
        source: "/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "https://taplo.io",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: `${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF}.supabase.co`,
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "files.stripe.com",
        port: "",
        pathname: "/links/**",
      },
    ],
  },
  experimental: {
    forceSwcTransforms: true,
  },
};

export default nextConfig;
