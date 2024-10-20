import chalk from "chalk";
import fs from "fs";
import ora from "ora";
import path from "path";

import links from "./links.js";

const spinner = ora();
spinner.color = "yellow";

const samplePaths = {
  config: "./src/samples/app-comment.config",
  gitignore: "./src/samples/gitignore",
};
// prompt utils

function required(v, length = 0, err = "") {
  if (v && v?.length > length) {
    return true;
  }
  return err || "This field is required";
}

function yesToConfirm(a) {
  return function (answers) {
    return answers[a];
  };
}

// string utils

function transformToUppercase(value) {
  const val = value.split(/(?=[A-Z])/).join("_");
  return val.toUpperCase();
}

function appendPrefix(string, prefixs = []) {
  let tmpPre = " ";
  for (const item of prefixs) {
    tmpPre = item.trim() + tmpPre.trim();
  }
  return tmpPre + string.trim();
}

// file handling utils

function resolveRelativePath(relativePath) {
  const mainDir = process.cwd();
  const absolutePath = path.resolve(mainDir,relativePath);
  return absolutePath;
}
function returnJSON(jsonFile) {
  const abs = resolveRelativePath(jsonFile);
  const raw = fs.readFileSync(abs, "utf8", (err) => console.error(err));
  return JSON.parse(raw);
}

function checkFile(filePath) {
  const exist = fs.existsSync(filePath);
  if (!exist) {
    return false;
  }
  return true;
}

function updateFile(filePath, data, errTxt = "", log = false) {
  const absPath = resolveRelativePath(filePath);
  const fileExist = checkFile(absPath);
  let fileContent;
  if (!fileExist) {
    try {
      fileContent = fs.writeFileSync(absPath, "", "utf8");
    } catch (err) {
      console.error("Unable to create file\n", errTxt, err);
    }
  }
  try {
    fileContent = fs.readFileSync(absPath, "utf8");
    fs.appendFileSync(
      filePath,
      fileContent.length < 1 ? `${data}\n` : `\n${data}`,
      "utf8"
    );
    if (log) {
      console.log(chalk.green("File update successfully"));
    }
  } catch (err) {
    console.error("Unable to write file\n", errTxt, err);
  }
}

function searchInFile(word, filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return data.includes(word);
  } catch (err) {
    console.error("Unable to read given file\n", err);
    return false;
  }
}

// appwrite util
async function createAttributes(appwriteClient, schemafile) {
  spinner.start("creating required attributes");
  const schema = returnJSON(schemafile);
  try {
    schema.forEach((item) => {
      const type = item.type;
      switch (type) {
        case "number":
          try {
            appwriteClient.createNumber({ options: item });
            chalk.green(`created ${type} attribute\n`);
          } catch (err) {
            console.log(err);
          }
          break;

        case "string":
          try {
            appwriteClient.createString({ options: item });
            chalk.green(`created ${type} attribute\n`);
          } catch (err) {
            console.log(err);
          }

          break;

        case "boolean" || "bool":
          try {
            appwriteClient.createBoolean({ options: item });
            chalk.green(`created ${type} attribute\n`);
          } catch (err) {
            console.log(err);
          }
          break;
        default:
          throw new Error(
            chalk.red(
              ("Unbale to get the type \n Please Provide",
              chalk.underline.bold("Proper schema file.\n"))
            )
          );
      }
    });
    spinner.succeed(chalk.green("attributes created Successfully."));
  } catch (error) {
    spinner.fail(chalk.red("Unable to create required attributes\n"));
    throw new Error(chalk.red(error));
  }
}

// handle answers utils
async function writeEnv({ filePath, data, prefix, figletText = true }) {
  try {
    spinner.start("creating env file...");

    if (figletText) {
      updateFile(filePath, `######## APP-COMMENT CONFIG #########\n`);
    }

    data.forEach((item) => {
      let [key, value] = item;
      key = transformToUppercase(key);
      key = appendPrefix(key, ["APPCOMMENT_", prefix]);
      updateFile(
        filePath,
        `${key}=${value}`,
        chalk.bgRed.bold(`
      UNABLE TO CREATE ENV FILE\n
      MANUALLY CREATE ENV FILE \nSEE SAMPLE ENV\n ${links.sampleFiles.env}`)
      );
    });

    if (figletText) {
      updateFile(filePath, `\n\n######## END APPCOMMENT CONFIG #########\n`);
    }

    spinner.succeed(chalk.green("env file created Successfully."));
  } catch (error) {
    spinner.fail(chalk.red("Unable to create env file\n"));
    console.error(err);
  }
}

async function writeGitIgnore(filePath) {
  const absPath = resolveRelativePath(filePath);
  const sample = fs.readFileSync(samplePaths.gitignore, "utf8");
  const content = sample.split("\n");
  spinner.start("creating gitIgnore file...");
  if (!checkFile(absPath)) {
    try {
      updateFile(absPath, "");
    } catch (err) {
      spinner.fail(chalk.red("Unable to create gitignore file\n"));
      console.error(err);
    }
  }
  content.forEach((item) => {
    if (!searchInFile(item, absPath)) {
      try {
        updateFile(absPath, `${item}`);
      } catch (err) {
        spinner.stop();
        console.error("Unable to write gitIgnore file\n");
        console.log(
          chalk.bold.bgRed(
            "DO NOT COMMIT THIS CODE\nAN ENV FILE CONTAINING YOUR APPWRITE API HAS BEEN CREATED\n MANUALLAY CREATE GITIGNORE FILE\n ",
            err
          )
        );
      }
    }
  });
  spinner.succeed(chalk.green("gitIgnore file created Successfully."));
}

async function writeConfig(filePath, envPrefix) {
  filePath = resolveRelativePath(filePath);

  try {
    let data = fs.readFileSync(samplePaths.config, "utf8");
    data = data.replaceAll("<prefix>", envPrefix);
    fs.writeFileSync(filePath, data, "utf8");
    spinner.succeed(chalk.green("config file created Successfully."));
  } catch (err) {
    spinner.fail(
      chalk.red(
        "unable to create config file\nCreate config file manually\n or see sample config"
      )
    );
    console.log(links.sampleFiles.config);
    console.error(err);
  }
}

export {
  required,
  transformToUppercase,
  yesToConfirm,
  checkFile,
  updateFile,
  searchInFile,
  writeEnv,
  writeGitIgnore,
  writeConfig,
  appendPrefix,
  returnJSON,
  createAttributes,
};