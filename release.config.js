/**
 * @type {import("semantic-release").GlobalConfig}
 */
export default {
  branches: [
    "main",
    { name: "next", channel: "next", prerelease: "next" },
    { name: "beta", channel: "beta", prerelease: true },
  ],
  tagFormat: "v${version}",
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    ["@semantic-release/changelog", { changelogFile: "CHANGELOG.md" }],
    [
      "@semantic-release/npm",
      {
        npmPublish: true,
        tarballDir: "release",
      },
    ],
    [
      "@semantic-release/github",
      {
        assets: [{ path: "release/*.tgz", label: "npm package tarball" }],
        successComment: false,
        failComment: false,
        labels: false,
        releasedLabels: false,
      },
    ],
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md", "package.json", "pnpm-lock.yaml"],
        message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
  ],
};
