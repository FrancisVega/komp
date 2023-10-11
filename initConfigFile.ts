import fs from "fs-extra";
import { isFile } from "./util";
import { ROOT } from "index";

export const initConfigFile = () => {
	if (!isFile(ROOT + "/.komp")) {
		console.log("Config file [.komp] (hidden) created.");
		fs.writeFileSync(
			ROOT + "/.komp",
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
};
