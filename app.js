const readline = require("readline");
const fs = require("fs").promises;
const { program } = require("commander");
require("colors");

program.option(
  "-f, --file [type]",
  "file for saving game results",
  "results.json"
);
program.parse(process.argv);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let count = 0;
const logFile = program.opts().file;
const mind = Math.floor(Math.random() * 10) + 1;
let playerName = "";

const isValid = (value) => {
  if (isNaN(value)) {
    console.log("Введіть число!".red);
    return false;
  }
  if (value < 1 || value > 10) {
    console.log("Число повинно бути в діапазоні від 1 до 10".red);
    return false;
  }
  return true;
};

const log = async (data) => {
  try {
    let results = [];
    try {
      const fileData = await fs.readFile(logFile, "utf-8");
      results = JSON.parse(fileData);
    } catch (err) {
      console.log(err);
    }

    results.push(data);
    await fs.writeFile(logFile, JSON.stringify(results, null, 2));
    console.log(`Результат збережено у ${logFile}`.green);
  } catch (err) {
    console.log(`Помилка збереження в ${logFile}`.red);
  }
};

const askName = () => {
  rl.question("Введіть ваше ім'я: ".cyan, (name) => {
    playerName = name || "Гість";
    game();
  });
};

const game = () => {
  rl.question(
    "Введіть число від 1 до 10, щоб вгадати задумане: ".yellow,
    (value) => {
      let a = +value;
      if (!isValid(a)) {
        game();
        return;
      }
      count += 1;
      if (a === mind) {
        console.log("Вітаю, Ви вгадали число за %d крок(ів)".green, count);
        log({
          date: new Date().toISOString(),
          player: playerName,
          attempts: count,
          success: true,
        }).finally(() => rl.close());
        return;
      }
      if (count >= 10) {
        console.log(
          `Ви не вгадали за 5 спроб. Загадане число було ${mind}.`.red
        );
        log({
          date: new Date().toISOString(),
          player: playerName,
          attempts: count,
          success: false,
        }).finally(() => rl.close());
        return;
      }
      console.log("Ви не вгадали, ще спроба".red);
      game();
    }
  );
};

askName();

// npm i commander
// npm i colors
