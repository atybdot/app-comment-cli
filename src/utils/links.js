import terminalLink from "terminal-link";

const links = {
  projectGithub: terminalLink(
    "app-comment-cli-github",
    "https://github.com/atybdot/app-comment-cli"
  ),
  issues: terminalLink(
    "app-comment-cli-issues",
    "https://github.com/atybdot/app-comment-cli/issues"
  ),
  appComment: terminalLink(
    "app-comment-github",
    "https://github.com/atybdot/app-comment"
  ),
  mainIssues: terminalLink(
    "app-comment-issues",
    "https://github.com/atybdot/app-comment/issues"
  ),
  x: terminalLink("twitter", "https://x.com/atybdot"),
  github: terminalLink("github", "https://github.com/atybdot"),
  appwrite: terminalLink("appwrite-website", "https://appwrite.io/"),
  sampleFiles: {
    config: terminalLink(
      "app-comment config sample",
      "https://github.com/atybdot/app-comment-cli/blob/main/src/samples/app-comment-config.sample"
    ),
    env: terminalLink(
      "sample env for appComment",
      "https://github.com/atybdot/app-comment-cli/blob/main/src/samples/env.sample"
    ),
    gitIgnore: terminalLink(
      "sample gitignore",
      "https://github.com/atybdot/app-comment-cli/blob/main/src/samples/gitignore.sample"
    ),
  },
};

export default links