#! /usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const os = require('os');
const colors = require('colors');
const util = require('./util.js');
const findRoot = require('find-root');
const app = require('commander');
const ROOT = findRoot(process.cwd());

// - functions
const initConfigFile = () => {
  if (!util.isFile(ROOT + "/.komp")) {
    console.log("Config file [.komp] (hidden) created.");
    fs.writeFileSync(ROOT + "/.komp", JSON.stringify(
      {
        baseName: 'component',
        template: 'base',
        files: [
          '.html',
          '.js',
          '.json',
          '.yaml',
          '.md',
          '.css',
          '.scss',
        ],
      }
      , null, 4))
  }
}

// Create component folder and template files if doesn't exists
const initComponentFolder = () => {
  if (!util.isDir(ROOT_COMP_FOLDER)) {
    fs.mkdirsSync(ROOT_COMP_FOLDER);
    fs.copySync(path.join(__dirname, 'comp-templates'), ROOT_COMP_FOLDER);
    console.log("Template folder [comp-templates] created.");
  }
}

// Read config file
const readConfigFile = () => {
  return config = util.readConfig(ROOT, '.komp');
}


// Custom comp-templates folder
const ROOT_COMP_FOLDER = ROOT + "/comp-templates";

// Commander APP
// ----------------------------------------------------------------------------
app
  .version('1.0.0')
  .option('-T, --template <name>', 'File base template', 'base')
  .command('create <name>', {isDefault:true})
  .action(function(env){

    if (!util.isDir(ROOT_COMP_FOLDER)) {
      console.log("No se ha encontrado la carpeta comp-templates, utiliza komp init");
      process.exit(0);
    }

    if (!util.isFile(ROOT + "/.komp")) {
      console.log("No se ha encontrado el archivo .komp, utiliza komp init");
      process.exit(0);
    }

    // Read cofig file
    const comp = readConfigFile();

    // Template from user
    if(app.template)
      comp.template = app.template;

    // Full path
    const fullPath = app.args[0]
    // name & dir
    const componentName = path.basename(fullPath);

    // Buscamos la carpeta de template
    const templateFolderName =
      fs.readdirSync(ROOT_COMP_FOLDER)
      .filter(folder => {
        const searchSplit = folder.split(app.template)
        return searchSplit.length > 1
      })[0]

    const finalTemplateFolderName =
      templateFolderName.replace(app.template, componentName)

    const componentDir = `${path.dirname(fullPath)}/${finalTemplateFolderName}`;

    try { fs.mkdirsSync(componentDir); } catch (e) { /* */ }

    // Leemos y escribimos los archivos de los componentes
    config.files.map(extension => {
      const src_templatePath = `${ROOT_COMP_FOLDER}/${templateFolderName}`;
      const src_templateFiles = util.getFileFromExtension(`${src_templatePath}`, extension);
      src_templateFiles.map(src_templateFile => {
        if (src_templateFile) {
          const src_fileContent = fs.readFileSync ( src_templatePath + "/" + src_templateFile , 'utf8' );
          const dst_fileContent = src_fileContent.replace( /@@name/g, componentName );
          const dst_templatePath = componentDir;
          const dst_templateFile = src_templateFile.replace(config.baseName, componentName);
          util.writeFile( dst_templatePath + "/" + dst_templateFile, dst_fileContent );
        } else {
          console.log(`The component file for the extension ${extension} doesn't exists. Better call Saul`.blue);
        }
      })
    })

    console.log(env + " created");
  });

app
  .command('init')
  .action(function(env){
    initConfigFile();
    initComponentFolder();
  });

app.parse(process.argv);
process.exit(0);
