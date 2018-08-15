
let path = require('path');

require('../../scss/screen.scss')

// main file for launching game code
require('./client/app.js');

// importing shared files
require('./shared/message.js')

// grageo files

// importing lib files
require('./grageo/canvaslayer.js');
require('./grageo/colour.js');
require('./grageo/entity.js');
require('./grageo/vector.js');

// requiring main module
require('./grageo/grageo.js');
