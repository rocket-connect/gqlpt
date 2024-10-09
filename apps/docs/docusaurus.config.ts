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

  // Set the production url of your site here
  url: "https://www.gqlpt.dev",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "rocket-connect", // Usually your GitHub org/user name.
  projectName: "gqlpt", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
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
        docs: {
          sidebarPath: "./sidebars.ts",
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
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
              href: "https://github.com/facebook/docusaurus",
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
