const express = require('express'),
  app = express();

app.set('port', 8101);

app.use('/', express.static(__dirname));

app.listen(app.get('port'), () => null);
