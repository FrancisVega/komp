#! /usr/bin/env node

const path = require("path")
const fs = require("fs-extra")
const os = require("os")
const colors = require("colors")
const util = require("./util.js")
const findRoot = require("find-root")
const app = require("commander")

let ROOT
let INROOTFOLDER = false
try {
  ROOT = findRoot(process.cwd())
  INROOTFOLDER = true
} catch (e) {}

const initConfigFile = () => {
  if (!util.isFile(ROOT + "/.komp")) {
    console.log("Config file [.komp] (hidden) created.")
    fs.writeFileSync(
      ROOT + "/.komp",
      JSON.stringify(
        {
          baseName: "component",
          basePath: "",
          template: "base"
        },
        null,
        4
      )
    )
  }
}

// Create component folder and template files if doesn't exists
const initComponentFolder = () => {
  if (!util.isDir(ROOT_COMP_FOLDER)) {
    fs.mkdirsSync(ROOT_COMP_FOLDER)
    fs.copySync(path.join(__dirname, "comp-templates"), ROOT_COMP_FOLDER)
    console.log("Template folder [comp-templates] created.")
  }
}

// Read config file
const readConfigFile = () => {
  return (config = util.readConfig(ROOT, ".komp"))
}

// Custom comp-templates folder
const ROOT_COMP_FOLDER = ROOT + "/comp-templates"

// Commander APP
// ----------------------------------------------------------------------------
app
  .version("1.0.0")
  .option("-T, --template <name>", "File base template", "base")
  .option("-F, --file", "File mode. Doesn`t create a folder", false)
  .command("new <name>")
  .alias("n")
  .description("Create new boilerplate folder/files")
  .action(function(env) {
    if (INROOTFOLDER) {
      if (!util.isDir(ROOT_COMP_FOLDER)) {
        console.log("Folder comp-templates doesn't exists, use komp init")
        process.exit(0)
      }

      if (!util.isFile(ROOT + "/.komp")) {
        console.log("Condig file .komp doesn't exists, use komp init")
        process.exit(0)
      }

      // Read cofig file
      const comp = readConfigFile()

      // Template from user
      if (app.template) comp.template = app.template

      // Full path
      const fullPath = path.join(comp.basePath, app.args[0])
      // name & dir
      const componentName = path.basename(fullPath)

      // Buscamos la carpeta de template
      const templateFolderName = fs.readdirSync(ROOT_COMP_FOLDER).filter(folder => {
        const searchSplit = folder.split(app.template)
        return searchSplit.length > 1
      })[0]

      const finalTemplateFolderName = templateFolderName.replace(app.template, componentName)

      let componentDir
      if (!app.file) {
        componentDir = `${path.dirname(fullPath)}/${finalTemplateFolderName}`
        try {
          fs.mkdirsSync(componentDir)
        } catch (e) {
          /* */
        }
      } else {
        componentDir = `${path.dirname(fullPath)}`
      }

      const files = fs.readdirSync(`${ROOT_COMP_FOLDER}/${templateFolderName}`)

      files.map(file => {
        const src_templatePath = `${ROOT_COMP_FOLDER}/${templateFolderName}`
        const src_fileContent = fs.readFileSync(src_templatePath + "/" + file, "utf8")
        const dst_fileContent = src_fileContent.replace(/@@name/g, componentName)
        const dst_templatePath = componentDir
        const dst_templateFile = file.replace(config.baseName, componentName)
        util.writeFile(dst_templatePath + "/" + dst_templateFile, dst_fileContent)
      })

      console.log("\n" + env + " component created :)\n")
    } else {
      console.log("Necesitas estar en una carpeta de proyecto (package.json)")
    }
  })

app
  .command("init")
  .alias("i")
  .description("Create config file and template folder")
  .action(function(env) {
    if (INROOTFOLDER) {
      initConfigFile()
      initComponentFolder()
    } else {
      console.log("Necesitas estar en una carpeta de proyecto (package.json)")
    }
  })

app.parse(process.argv)
process.exit(0)
