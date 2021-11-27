const express = require('express');
const app = express();

require('./inicio/rutas')(app);
require('./inicio/db')();
require('./inicio/servNube')(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Eschuando en puerto ${port}...`));