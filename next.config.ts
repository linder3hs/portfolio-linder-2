import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "github.com" },
      { hostname: "avatars.githubusercontent.com" },
    ],
  },
  // The courses are gone, but their links were shared on WhatsApp.
  // ponytail: temporary (307) so browsers don't cache it if a cohort comes back.
  async redirects() {
    return [
      {
        source: "/:locale(en|es)/courses/:path*",
        destination: "/:locale/plans",
        permanent: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
