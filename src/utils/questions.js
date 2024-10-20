import { required, yesToConfirm } from "./utils.js";
import chalk from "chalk";

const questions = [
  {
    type: "input",
    name: "baseUrl",
    message: chalk.hex("#ff70a6")("Enter Appwrite API Endpoint: "),
    default: "https://cloud.appwrite.io/v1",
  },
  {
    type: "input",
    name: "projectId",
    message: chalk.hex("#ff70a6")(
      "Enter Appwrite Project ID",
      chalk.red("(required): ")
    ),
    validate: (v) => required(v),
  },
  {
    type: "password",
    name: "api",
    message: chalk.hex("#ff70a6")(
      "Enter Appwrite API",
      chalk.red("(required): ")
    ),
    mask: "*",
    validate: (v) => required(v),
  },
  {
    type: "confirm",
    name: "createDatabase",
    message: chalk.hex("#ff70a6")("Do you want to create a new databse?"),
    default: true,
  },
  {
    type: "input",
    name: "databaseName",
    message: chalk.hex("#ff70a6")("Desired Name of database?"),
    default: "app-comment",
    when(answers) {
      return yesToConfirm("createDatabase")(answers);
    },
  },
  {
    type: "input",
    name: "databaseId",
    message: chalk.hex("#ff70a6")(
      "Enter database ID",
      chalk.red("(required): ")
    ),
    validate: (v) => required(v),
    when(answers) {
      return !yesToConfirm("createDatabase")(answers);
    },
  },
  {
    type: "list",
    name: "envPrefix",
    message: chalk.hex("#ff70a6")("Which framework you are using?"),
    choices: ["astro", "react / vite", "create-react-app"],
    default: "react / vite",
    filter(val) {
      let prefix;
      switch (val) {
        case "astro":
          prefix = "PUBLIC_";
          break;

        case "react / vite":
          prefix = "VITE_";
          break;

        case "create-react-app":
          prefix = "REACT_APP_";
          break;

        default:
          prefix = "VITE_";
          break;
      }
      return prefix;
    },
  },
  {
    type: "input",
    name: "envPath",
    message: chalk.hex("#ff70a6")("Where is your .env file?"),
    default: "./.env",
    validate: (v) => required(v),
  },
  {
    type: "confirm",
    name: "createGitignore",
    message: chalk.hex("#ff70a6")("Do you want to add gitignore file?"),
    default: true,
  },
  {
    type: "input",
    name: "gitignorePath",
    message: chalk.hex("#ff70a6")("Where is your .gitignore file?"),
    default: "./.gitignore",
    validate: (v) => required(v),
    when(answers) {
      return yesToConfirm("createGitignore")(answers);
    },
  },
  {
    type: "input",
    name: "configPath",
    message: chalk.hex("#ff70a6")("Where to create appComment config file?"),
    default: "./appComment.config.js",
    validate: (v) => required(v),
  },
];

export default questions;
