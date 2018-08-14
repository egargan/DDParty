
let path = require('path');

// main file for launching game code
require('./client/app.js');

// importing shared files
require('./shared/message.js')

// grageo files

// importing lib files
require('./lib/grageo/canvaslayer.js');
require('./lib/grageo/colour.js');
require('./lib/grageo/entity.js');
require('./lib/grageo/vector.js');

// requiring main module
require('./lib/grageo/grageo.js');
