import { readFileSync, readdirSync, statSync, writeFileSync } from "fs-extra";
import { extname } from "path";

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
		console.log(`The file ${f} already exists. Better call Saul.`.red);
	}
}

function readJSON(f: string) {
	return JSON.parse(readFileSync(f, "utf8"));
}

function writeJSON(f: string, cnt: unknown) {
	writeFileSync(f, JSON.stringify(cnt, null, 4));
}

function readConfig(baseDir: string, configFile: string) {
	return readJSON(baseDir + "/" + configFile);
}

function getFileFromExtension(dir: string, extension: string) {
	return readdirSync(dir).filter((file) => extname(file) == extension);
}

export { isDir, isFile, readConfig, writeFile };
