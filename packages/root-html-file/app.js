var express = require('express');
const path = require('path')
var app = express();
app.use(express.static(path.resolve(__dirname, './public')));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});