/* imports */
import { File } from "./File";
import path from "path";
import fs from "fs";

/**
 * Template Utilities
 * @class
 */
export class Template  {

    /**
     * Copy Template Files into a directory.
     * @param {string} src 
     * @param {string} dest 
     * @param {Object.<string, string>} [filter] 
     * @param {Object.<string, string>} [templateValues] 
     */
    static create(src, dest, filter={}, templateValues={}) {
        const filesToCreate = File.readDirectory(src);

        for(let file of filesToCreate) {
            const originalPath = path.join(src, file);

            if(filter[file]) file = filter[file];

            if(file.endsWith(".template")) file = file.replace(/.template$/, "");

            const newPath = path.join(dest, file);
            const stats = fs.statSync(originalPath);

            if(stats.isFile()) {
                if(path.extname(originalPath) == ".template") {
                    const content = Template.render(fs.readFileSync(originalPath, "utf8"), templateValues);
                    fs.writeFileSync(newPath, content);
                } else {
                    fs.writeFileSync(newPath, fs.readFileSync(originalPath));
                }
            } else if (stats.isDirectory()) {
                File.createDirectory(newPath);
                Template.create(originalPath, newPath, filter, templateValues);
            }
        }
    }

    /**
     * Render the data into a template file.
     * @param {string} content 
     * @param {Object.<string, string>} values 
     */
    static render(content, values) {
        const keys = Object.keys(values);

        for(let key of keys) {
            content = content.replace(new RegExp(`{{${key}}}`, "g"), values[key]);
        }

        return content;
    }
}