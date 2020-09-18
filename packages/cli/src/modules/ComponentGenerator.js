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
        this.component = {
            name: name,
            dest: path.join(process.cwd(), dest, name),
            template: path.join(__dirname, `../templates/${type}-component`)
        };
    }

    create() {
        /* stop if the component name is invalid */
        if(!this.component.name.includes("-")) {
            console.error(`Component names must include a hyphen.`);
            return;
        }

        /* stop if the project already exists */
        if (fs.existsSync(this.component.dest)) {
            console.error(`${this.component.name} already exists!`);
            return;
        }

        /* copy the template files to the destination */

        const filter = {
            "componentjs.txt": `${this.component.name}.js`,
            "componentcss.txt": `${this.component.name}.css`
        };

        try {
            File.createDirectory(this.component.dest);
            File.copyDirectoryContents(this.component.template, this.component.dest, filter);
        } catch {
            console.error("Failed to generate the component.");
            return;
        }

        /* update the template's placeholders with the component name */
        try {
            const filepath = path.join(this.component.dest, `${this.component.name}.js`);
            let source = fs.readFileSync(filepath, "utf8");
            source = source.replace(/{{component-name}}/g, this.component.name);

            /* get the component definition name */
            const parts = this.component.name.split("-");
            const word1 = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
            const word2 = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
            const name = word1 + word2;

            source = source.replace(/{{component}}/g, name);

            fs.writeFileSync(filepath, source);
        } catch (error) {
            console.error(`Failed to create ${this.component.name}.\n`);
            return;
        }

        console.log(`Generated a ${this.component.name} component.`);
    }
}