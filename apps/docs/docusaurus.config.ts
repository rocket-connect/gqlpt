import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
// add this
import dotenv from "dotenv";
import { themes as prismThemes } from "prism-react-renderer";

import tailwindPlugin from "./tailwind-plugin.cjs";

dotenv.config();

const config: Config = {
  title: "GQLPT",
  tagline: "Leverage AI to generate GraphQL queries from plain text",
  favicon: "img/favicon.svg",
  url: "https://www.gqlpt.dev",
  baseUrl: "/",
  organizationName: "rocket-connect",
  projectName: "gqlpt",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  customFields: {
    API_URL: process.env.API_URL || "",
  },
  plugins: [tailwindPlugin],
  presets: [
    [
      "classic",
      {
        gtag: {
          trackingID: "G-WFF8SCPT93",
        },
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl:
            "https://github.com/rocket-connect/gqlpt/edit/main/apps/docs/",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    metadata: [
      { name: "robots", content: "index, follow" },
      { name: "author", content: "rconnect.tech" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "https://gqlpt.dev/" },
      { name: "twitter:image", content: "https://gqlpt.dev/img/banner.png" },
      { property: "og:url", content: "https://gqlpt.dev/" },
      { property: "og:image", content: "https://gqlpt.dev/img/banner.png" },
    ],
    image: "img/banner.png",
    navbar: {
      title: "GQLPT",
      logo: {
        alt: "GQLPT",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Docs",
        },
        {
          position: "left",
          label: "About",
          href: "/docs/about",
        },
        {
          href: "https://github.com/rocket-connect/gqlpt",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    colorMode: {
      defaultMode: "light",
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Getting Started",
              to: "/docs/getting-started",
            },
            {
              label: "About",
              to: "/docs/about",
            },
            {
              label: "Client SDK",
              to: "/docs/client-sdk",
            },
            {
              label: "CLI",
              to: "/docs/cli",
            },
            {
              label: "Adapters",
              to: "/docs/adapters",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/rocket-connect",
            },
            {
              label: "Rconnect.tech",
              href: "https://rconnect.tech",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/rconnect_tech",
            },
            {
              label: "Contributing",
              href: "https://github.com/rocket-connect/gqlpt/blob/main/docs/CONTRIBUTING.md",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              href: "https://www.rconnect.tech/blog/gqlpt",
            },
            {
              label: "GitHub",
              href: "https://github.com/rocket-connect/gqlpt",
            },
            {
              label: "Example",
              href: "https://github.com/danstarns/talk-to-graphql",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} <a href="https://rconnect.tech">rconnect.tech</a>`,
    },
    prism: {
      theme: prismThemes.vsLight,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
