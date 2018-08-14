
// Handlebars default config
const hbs = require('hbs');
const fs = require('fs');
const path = require('path');

function init(app){

  // directory string pointing to the view folder ( folder with templates and partials in it )
  var viewDir = path.join(__dirname, '/../views')

  // registering all the top level partials
  registerPartialFiles(viewDir + '/partials');

  // view engine setup
  app.set('views', viewDir);
  app.set('view engine', 'hbs');

  hbs.registerHelper('json', function(context) {
      return JSON.stringify(context, null, 2);
  });

}

// this method takes a directory and fetches all files within that folder to
// be used as partials for dynamic page loading
function registerPartialFiles(directory){

  // returning a file name array from the given directory and iterating over it
  fs.readdirSync(directory).forEach(function (filename) {

    // pattern matching the extension to detect if its a handle bar file
    const matches = /^([^.]+).hbs$/.exec(filename);

    // returning if not a hbs file
    if (!matches) {
      return;
    }

    // fetching file name
    const name = matches[1];

    // registering partial with handle bars
    const template = fs.readFileSync(directory + '/' + filename, 'utf8');
    hbs.registerPartial(name, template);

  });

  // registering helper
  hbs.registerHelper('json', function(context) {
      return JSON.stringify(context, null, 2);
  });

}

module.exports = init
