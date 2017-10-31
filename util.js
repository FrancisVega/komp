const fs = require('fs-extra')
const path = require('path')
const os = require('os')

module.exports = {

  isDir: (f) => {
    try {
      return fs.statSync(f).isDirectory();
    } catch (e) {
      return false;
    }
  },

  isFile: function(f) {
    try {
      return fs.statSync(f).isFile()
    } catch(e) {
      return false
    }
  },

  writeFile: function (f, content) {
    if(this.isFile(f) === false){
      fs.writeFileSync(f, content)
    } else {
      console.log(`The file ${f} already exists. Better call Saul.`.red);
    }
  },

  readJSON: function(f) {
    return JSON.parse(fs.readFileSync(f, 'utf8'));
  },

  writeJSON: function(f, cnt) {
    fs.writeFileSync(f, JSON.stringify(cnt, null, 4))
  },

  readConfig: function (baseDir, configFile) {
    return this.readJSON(baseDir + "/" + configFile);
  },

  getFileFromExtension: function (dir, extension) {
    return fs.readdirSync(dir).filter(file => path.extname(file) == extension);
  },

}
