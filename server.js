const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(__dirname + "/src"));

app.get("/", (req, res) => {
  res.render(path.resolve(__dirname, "src/index.ejs"), {
    title: "Les petits plats",
    srcPath: "src",
    assetsPath: "assets",
  });
});

app.listen(process.env.PORT || 33468, () => {
  console.log(`Server running on port ${process.env.PORT || 33468}`);
});
