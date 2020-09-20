/* imports */
import { File } from "../utils/File";
import path from "path";
import fs from "fs";

/**
 * ComponentGenerator that creates components.
 * @class
 * @private
 */
export class ComponentGenerator {

    /**
     * @param {string} name
     * @param {string} type
     * @param {string} [dest]
     */
    constructor(name, type, dest) {
        this.name = name;
        this.dest = path.join(process.cwd(), dest, name);
        this.template = path.join(__dirname, `../templates/component-${type}`);
    }

    create() {
        /* stop if the component name is invalid */
        if (!this.name.includes("-")) {
            console.error(`Component names must include a hyphen. (Example: jolt gen hello-world)`);
            return;
        }

        /* stop if the project already exists */
        if (fs.existsSync(this.dest)) {
            console.error(`${this.name} already exists!`);
            return;
        }

        /* copy the template files to the destination */

        const filter = {
            "componentjs.txt": `${this.name}.js`,
            "componentcss.txt": `${this.name}.css`,
            "componentindex.txt": "index.js"
        };

        try {
            File.createDirectory(this.dest);
            File.copyDirectoryContents(this.template, this.dest, filter);
            this._updateTemplate();
        } catch {
            console.error("Failed to generate the component.");
            return;
        }

        console.log(`Generated a ${this.component.name} component.`);
    }

    /** Updates the files of the generated component. */
    _updateTemplate() {
        /* update the component source file */
        const sourcePath = path.join(this.dest, `${this.name}.js`);
        let source = fs.readFileSync(sourcePath, "utf8");
        source = source.replace(/{{component-name}}/g, this.name);

        /* get the component definition name */
        const parts = this.name.split("-");
        const part1 = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        const part2 = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
        const name = part1 + part2;

        source = source.replace(/{{component}}/g, name);

        fs.writeFileSync(sourcePath, source);

        /* update the component index file */
        const indexPath = path.join(this.dest, "index.js");
        source = fs.readFileSync(indexPath, "utf8");
        source = source.replace(/{{component-name}}/g, this.name);

        fs.writeFileSync(indexPath, source);
    }
}