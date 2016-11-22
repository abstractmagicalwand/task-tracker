const express = require('express');
const app = express();

app.set('port', 3000);

app.use('/', express.static(__dirname));

app.listen(app.get('port'), function() {
  console.log('run');
});
