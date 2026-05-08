import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";

export default withMermaid(
  defineConfig({
    lang: "en-US",
    title: "Radar",
    description: "A delegation worker for AI coding agents.",
    base: process.env.DOCS_BASE ?? "/",
    cleanUrls: true,
    lastUpdated: true,
    srcExclude: [".vitepress/dist/**", ".vitepress/cache/**"],
    vite: {
      server: {
        watch: {
          ignored: ["**/docs/.vitepress/dist/**", "**/docs/.vitepress/cache/**"],
        },
      },
    },
    markdown: {
      theme: {
        light: "github-light",
        dark: "github-dark",
      },
    },
    themeConfig: {
      siteTitle: "Radar",
      search: {
        provider: "local",
      },
      nav: [
        { text: "Guide", link: "/getting-started" },
        { text: "Recipes", link: "/recipes/documentation-updates" },
        { text: "Reference", link: "/reference/environment-variables" },
      ],
      sidebar: [
        {
          text: "Start",
          items: [
            { text: "Overview", link: "/" },
            { text: "Getting Started", link: "/getting-started" },
            { text: "Installation", link: "/installation" },
            { text: "Configuration", link: "/configuration" },
          ],
        },
        {
          text: "Delegation",
          items: [
            { text: "Delegation Model", link: "/delegation-model" },
            { text: "Host vs Worker", link: "/concepts/host-vs-worker" },
            { text: "Safety Boundaries", link: "/concepts/safety-boundaries" },
            { text: "Cost and Tokens", link: "/concepts/cost-and-token-savings" },
            { text: "Caching", link: "/concepts/caching-and-corpus-ordering" },
          ],
        },
        {
          text: "Use Radar",
          items: [
            { text: "MCP Clients", link: "/mcp-clients" },
            { text: "CLI Reference", link: "/cli-reference" },
            { text: "Programmatic API", link: "/reference/package-api" },
          ],
        },
        {
          text: "Recipes",
          items: [
            { text: "Documentation Updates", link: "/recipes/documentation-updates" },
            { text: "Bulk Code Reading", link: "/recipes/bulk-code-reading" },
            { text: "Search Before Reading", link: "/recipes/search-before-reading" },
            { text: "Boilerplate Generation", link: "/recipes/boilerplate-generation" },
            { text: "Long Log Summarization", link: "/recipes/long-log-summarization" },
          ],
        },
        {
          text: "Integrations",
          items: [
            { text: "Cursor", link: "/integrations/cursor" },
            { text: "Claude Code", link: "/integrations/claude-code" },
            { text: "Codex", link: "/integrations/codex" },
            { text: "GitHub Actions", link: "/integrations/github-actions" },
          ],
        },
        {
          text: "Reference",
          items: [
            { text: "Environment Variables", link: "/reference/environment-variables" },
            { text: "Tool Schemas", link: "/reference/tool-schemas" },
            { text: "Tool Routing Eval", link: "/reference/tool-routing-eval" },
            { text: "Troubleshooting", link: "/troubleshooting" },
            { text: "Contributing", link: "/contributing" },
            { text: "Release Process", link: "/release" },
            { text: "Security", link: "/security" },
          ],
        },
      ],
      footer: {
        message: "Released under the MIT License.",
        copyright: "Copyright © 2026 Radar contributors",
      },
    },
    mermaid: {
      theme: "neutral",
      darkMode: true,
    },
  }),
);
