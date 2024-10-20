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
  mainIssues: terminalLink("app-comment-issues","https://github.com/atybdot/app-comment/issues"),
  x: terminalLink("twitter", "https://x.com/atybdot"),
  github: terminalLink("github", "https://github.com/atybdot"),
  appwrite: terminalLink("appwrite-website", "https://appwrite.io/"),
  sampleFiles: {
    config: terminalLink(
      "app-comment config sample",
      "https://github.com/atybdot/app-comment-cli"
    ),
    env: terminalLink(
      "sample env for appComment",
      "https://github.com/atybdot/app-comment-cli/"
    ),
    gitIgnore: terminalLink(
      "sample gitignore",
      "https://github.com/atybdot/app-comment-cli/"
    ),
  },
};

export default links