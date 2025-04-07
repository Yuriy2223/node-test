const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use((req, res, next) => {
  console.log("Наше проміжне ПЗ");
  next();
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
