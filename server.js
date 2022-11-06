const express = require('express');
const path = require('path');
const glob = require('glob');

const getServedJavaScriptFile = () => {
  const [servedJavaScriptPath] = glob.sync('src/assets/js/compiled/*.js', {});
  return servedJavaScriptPath.replace('src/assets/js/compiled/', '');
};

const app = express();

app.use(express.static(__dirname + '/src'));
app.use(express.static(__dirname + '/data'));

app.get('/', (req, res) => {
  res.render(path.resolve(__dirname, 'src/index.ejs'), {
    title: 'Les petits plats',
    srcPath: 'src',
    assetsPath: 'assets',
    javascriptFilePath: getServedJavaScriptFile(),
  });
});

app.listen(process.env.PORT || 33468, () => {
  console.log(`Server running on port ${process.env.PORT || 33468}`);
});
