import figlet from "figlet";
import gradient from "gradient-string";
import links from "./links.js";
import chalk from "chalk";
import { pastel } from "gradient-string";
import { atlas } from "gradient-string";

// Provide an array of colors
const appCommentGr = gradient([
  { color: "#ff70a6", pos: 0 },
  { color: "#FD366E", pos: 0.4 },
  { color: "#FD366E", pos: 0.6 },
  { color: "#ff70a6", pos: 1 },
]);

const splashText = figlet(
  "app-comment-cli",
  {
    font: "Ivrit",
    printDirection: "default",
    whitespaceBreak: true,
    horizontalLayout: "default",
    verticalLayout: "default",
  },
  async (err, data) => {
    if (err) {
      console.error("Something went wrong...");
      console.dir(err);
      return;
    }
    return data;
  }
);
const renderfiglet = async () => {
  const text = await splashText;
  console.log(appCommentGr.multiline(text)); 
};

const renderSocials = () => {
  console.log(chalk.hex("06d6a0")(`\n⟡ ${links.x}   ⟡ ${links.github}`));

  console.log(
    chalk.hex("ff70a6")(`\n● ${links.issues}    ● ${links.mainIssues}`)
  );

  console.log(
    chalk.hex("ff70a6")(
      `\n▲ ${links.projectGithub}    ▲ ${links.appComment}    ▲ ${links.appwrite} \n`
    )
  );
};
export { renderSocials, renderfiglet };
