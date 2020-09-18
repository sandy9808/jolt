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
     */
    constructor(name) {
        this.component = {
            name: name,
            dest: path.join(process.cwd(), name),
            template: path.join(__dirname, "../templates/component")
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
        console.log(`Creating ${this.component.name}...\n`);

        const filter = {
            "componentjs.txt": `${this.component.name}.js`,
            "componentcss.txt": `${this.component.name}.css`
        };

        File.createDirectory(this.component.dest);
        File.copyDirectoryContents(this.component.template, this.component.dest, filter);

        /* update the template's placeholders with the component name */
        try {
            const filepath = path.join(this.component.dest, `${this.component.name}.js`);
            let source = fs.readFileSync(filepath, "utf8");
            source = source.replace(/{{component-name}}/g, this.component.name);

            const parts = this.component.name.split("-");
            const name = `${parts[0].charAt(0).toUpperCase() + parts[0].slice(1)}${parts[1].charAt(0).toUpperCase() + parts[1].slice(1)}`;
            source = source.replace(/{{component}}/g, name);

            fs.writeFileSync(filepath, source);
        } catch (error) {
            console.log(error);
            console.error(`Failed to create ${this.component.name}.\n`);
            return;
        }

        console.log(`Successfully created ${this.component.name}\n`);
    }
}