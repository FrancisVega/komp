#! /usr/bin/env node

import app from "commander";
import findRoot from "find-root";
import fs from "fs-extra";
import path from "path";
import { isDir, isFile, readConfig, writeFile } from "./util";

let ROOT = "";
let INROOTFOLDER = false;

try {
	ROOT = findRoot(process.cwd());
	INROOTFOLDER = true;
} catch (e) {}

// Custom comp-templates folder
const ROOT_COMP_FOLDER = `${ROOT}/comp-templates`;

// ----------------------------------------------------------------------------
// Commander APP
// ----------------------------------------------------------------------------
app
	.version("2.0.0")
	.option("-T, --template <name>", "File base template", "base")
	.option("-F, --file", "File mode. Doesn`t create a folder", false)
	.command("new <name>")
	.alias("n")
	.description("Create new boilerplate folder/files")
	.action(function (env) {
		if (INROOTFOLDER) {
			if (!isDir(ROOT_COMP_FOLDER)) {
				console.log("Folder comp-templates doesn't exists, use komp init");
				process.exit(0);
			}

			if (!isFile(ROOT + "/.komprc")) {
				console.log("Condig file .komprc doesn't exists, use komp init");
				process.exit(0);
			}

			// Read cofig file
			const comp = readConfigFile();

			// Template from user
			if (app.template) comp.template = app.template;

			// Full path
			const fullPath = path.join(comp.basePath, app.args[0]);

			// name & dir
			const componentName = path.basename(fullPath);

			// Buscamos la carpeta de template
			const templateFolderName = fs
				.readdirSync(ROOT_COMP_FOLDER)
				.filter((folder) => {
					const searchSplit = folder.split(app.template);
					return searchSplit.length > 1;
				})[0];

			const finalTemplateFolderName = templateFolderName.replace(
				app.template,
				componentName,
			);

			let componentDir: string;
			if (!app.file) {
				componentDir = `${path.dirname(fullPath)}/${finalTemplateFolderName}`;
				try {
					fs.mkdirsSync(componentDir);
				} catch (e) {
					/* ... */
				}
			} else {
				componentDir = `${path.dirname(fullPath)}`;
			}

			const files = fs.readdirSync(`${ROOT_COMP_FOLDER}/${templateFolderName}`);

			files.map((file) => {
				const src_templatePath = `${ROOT_COMP_FOLDER}/${templateFolderName}`;
				const src_fileContent = fs.readFileSync(
					src_templatePath + "/" + file,
					"utf8",
				);
				const dst_fileContent = src_fileContent.replace(
					/@@name/g,
					componentName,
				);
				const dst_templatePath = componentDir;
				console.log(comp);
				const dst_templateFile = file.replace(comp.baseName, componentName);
				writeFile(dst_templatePath + "/" + dst_templateFile, dst_fileContent);
			});

			console.log("\n" + env + " component created :)\n");
		} else {
			console.log("Necesitas estar en una carpeta de proyecto (package.json)");
		}
	});

app
	.command("init")
	.alias("i")
	.description("Create config file and template folder")
	.action(function (env) {
		if (INROOTFOLDER) {
			initConfigFile();
			initComponentFolder();
		} else {
			console.log("Necesitas estar en una carpeta de proyecto (package.json)");
		}
	});

app.parse(process.argv);
process.exit(0);

function initConfigFile() {
	if (!isFile(ROOT + "/.komprc")) {
		console.log("Config file [.komprc] (hidden) created.");
		fs.writeFileSync(
			ROOT + "/.komprc",
			JSON.stringify(
				{
					baseName: "component",
					basePath: "",
					template: "base",
				},
				null,
				4,
			),
		);
	}
}

// Create component folder and template files if doesn't exists
function initComponentFolder() {
	if (!isDir(ROOT_COMP_FOLDER)) {
		fs.mkdirsSync(ROOT_COMP_FOLDER);
		fs.copySync(path.join(__dirname, "comp-templates"), ROOT_COMP_FOLDER);
		console.log("Template folder [comp-templates] created.");
	}
}

// Read config file
function readConfigFile() {
	return readConfig(ROOT, ".komprc");
}
