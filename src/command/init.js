#! /usr/bin/env node

import * as commander from "commander";
import ora from "ora";
import chalk from "chalk";
import inquirer from "inquirer";

import questions from "../utils/questions.js";
import appcomment from "../lib/appwrite.js";
import links from "../utils/links.js";

import {
  createAttributes,
  writeGitIgnore,
  writeEnv,
  writeConfig,
} from "../utils/utils.js";
import { renderfiglet, renderSocials } from "../utils/splash.js";

const paths = {
  attributes: "./src/lib/attributes.json",
};

export const init = new commander.Command()
  .name("init")
  .description("start appcomment")
  .action(async () => {
    await renderfiglet();
    renderSocials();
    inquirer.prompt(questions).then(async (answers) => {
      await handleAnswers(answers);
      console.log(
        chalk.hex("ff70a6")(
          `\nwrapping up...\nCheck out socials below\n${renderSocials()}`
        )
      );
    })
  });

async function handleAnswers(answers) {
  const {
    baseUrl,
    projectId,
    api,
    createDatabase,
    envPath,
    envPrefix,
    configPath,
    gitignorePath,
    createGitignore,
  } = answers;
  const databaseName = answers?.databaseName;

  let databaseId = createDatabase ? "app-comment" : answers?.databaseId;
  let collectionId;

  const app = new appcomment({ baseUrl, projectId, api, databaseId });

  const spinner = ora();
  spinner.color = "yellow";

  // create database
  if (createDatabase) {
    spinner.start(chalk.yellow("creating database..."));

    try {
      const { $id } = await app.createDatabase(databaseName);
      app.setDatabaseId($id);
      spinner.succeed(chalk.green("database created Successfully."));
    } catch (error) {
      spinner.fail(chalk.red("unable to create database.\n"));
      throw new Error(chalk.red(error));
    }
  } else {
    // check if a database exists
    spinner.start("checking for database...");
    try {
      const { $id } = await app.getDatabase(databaseId);
      app.setDatabaseId($id);
      databaseId = $id;
      spinner.succeed(chalk.green("database exists."));
    } catch (error) {
      spinner.fail(chalk.red("Unable to locate database\n"));
      throw new Error(chalk.red(error));
    }
  }

  // create collection
  spinner.start("creating collection...");
  try {
    const { $id } = await app.createCollection(databaseId);
    app.setCollectionId($id);
    collectionId = $id;
    spinner.succeed(chalk.green("collection created successfully."));
  } catch (error) {
    spinner.fail(chalk.red("Unable to create collection"));
    throw new Error(chalk.red(error));
  }

  // create attribues
  await createAttributes(app, paths.attributes);

  // create gitIgnore
  if (createGitignore) {
    await writeGitIgnore(gitignorePath);
  } else {
    console.log(
      chalk.bgRed("CREATE GIT IGNORE FILE BEFORE PUSHING THIS CODE\n"),
      chalk.yellow("See sample file ", links.sampleFiles.gitIgnore)
    );
  }

  // create env file
  const envData = [
    ["baseUrl", baseUrl],
    ["projectId", projectId],
    ["api", api],
    ["databaseId", databaseId],
    ["collectionId", collectionId],
  ];

  await writeEnv({ filePath: envPath, data: envData, prefix: envPrefix });

  // create config
  await writeConfig(configPath, envPrefix);
  spinner.clear();
}
