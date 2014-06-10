/**
 * Created by Nercury on 2014-06-08.
 */

try {
    var reporter = require('nodeunit').reporters.default;
}
catch(e) {
    console.log("Cannot find nodeunit module.");
    process.exit();
}

process.chdir(__dirname);
reporter.run(['test']);