/* imports */
import { File } from "../utils/File";
import { Template } from "../utils/Template";
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
        this.template = path.join(__dirname, `../templates/${type}-component`);
    }

    create() {
        /* stop if the component name is invalid */
        if (!this.name.includes("-")) {
            console.error(`Component names must include a hyphen. (Example: jolt gen hello-world)`);
            return;
        }

        /* stop if the component already exists */
        if (fs.existsSync(this.dest)) {
            console.error(`${this.name} already exists!`);
            return;
        }

        /* copy the template files to the destination */

        /* get the component definition name */
        const parts = this.name.split("-");
        const part1 = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        const part2 = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
        const name = part1 + part2;

        const filter = {
            "component.js.template": `${this.name}.js`,
            "component.css.template": `${this.name}.css`
        };

        const templateValues = {
            "component-name": this.name,
            "component": name
        };

        try {
            File.createDirectory(this.dest);
            Template.create(this.template, this.dest, filter, templateValues);
        } catch {
            console.error("Failed to generate the component.");
            return;
        }

        console.log(`Generated a ${this.name} component.\n`);
    }
}