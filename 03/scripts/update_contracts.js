var fs = require('fs')
var metadata_config = require("../cryptoitem-metadata-server/local.db.json").config;

console.log("=======================")
console.log("Updating contract info based on metadata server...")
console.log("=======================")

console.log("Replacing contract template with config variables...");

var contractTemplates = fs.readdirSync('contract-templates');

for (var i = 0; i < contractTemplates.length; i++)
{
  (function(i){
    var source = "contract-templates/" + contractTemplates[i];
    var target = "contracts/" +  contractTemplates[i].replace(".template", "");

    fs.readFile(source, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }

      for (element in metadata_config) {
        var value = metadata_config[element];
        var data = data.replace(new RegExp(element, 'g'), value);

      }

      fs.writeFile(target, data, 'utf8', function (err) {
        if (err) return console.log(err);
      });
    });
  })(i);
}

console.log("Done.")

console.log("=======================")
console.log("Deploying contract...")
console.log("=======================")
