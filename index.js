#! /usr/bin/env node

/*
 *                                                                       _             _ _ 
 *       __ _ _ __  _ __         ___ ___  _ __ ___  _ __ ___   ___ _ __ | |_       ___| (_)
 *      / _` | '_ \| '_ \ _____ / __/ _ \| '_ ` _ \| '_ ` _ \ / _ \ '_ \| __|____ / __| | |
 *     | (_| | |_) | |_) |_____| (_| (_) | | | | | | | | | | |  __/ | | | ||_____| (__| | |
 *      \__,_| .__/| .__/       \___\___/|_| |_| |_|_| |_| |_|\___|_| |_|\__|     \___|_|_|
 *           |_|   |_|                                                                     
 *
 * This project is developed during appwrite's hf24 hackathon
 * 
 * author : atybdot
 * github :https://github.com/atybdot/app-comment-cli
 * twitter : https://x.com/atybdot
 * 
 * LICENSE : MIT (https://github.com/atybdot/app-comment-cli/blob/main/LICENSE) 
 *
 * 
 */

import { Command } from "commander";
import { init } from "./src/command/init.js";
import { returnJSON } from "./src/utils/utils.js";

const program = new Command();
const metadata = returnJSON("./package.json");

program
  .name(metadata.name)
  .description(metadata.description)
  .version(metadata.version);

program.addCommand(init);
program.parse();
