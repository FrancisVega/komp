import { readJSONSync, statSync, writeFileSync } from "fs-extra";

function isDir(f: string) {
	try {
		return statSync(f).isDirectory();
	} catch (e) {
		return false;
	}
}

function isFile(f: string) {
	try {
		return statSync(f).isFile();
	} catch (e) {
		return false;
	}
}

function writeFile(f: string, content: string) {
	if (isFile(f) === false) {
		writeFileSync(f, content);
	} else {
		console.log(`The file ${f} already exists. Better call Saul.`);
	}
}

function readConfig(baseDir: string, configFile: string) {
	return readJSONSync(`${baseDir}/${configFile}`, "utf8");
}

export { isDir, isFile, readConfig, writeFile };
