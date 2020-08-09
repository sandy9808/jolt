/* imports */
import fs from "fs";
import path from "path";

/**
 * File Utilities
 * @class
 * @private
 */
export class File {

    /**
     * Creates a directory
     * @param {string} directory - The directory to create.
     */
    static createDirectory(directory) {
        if(!fs.existsSync(directory)) {
            fs.mkdirSync(directory);
        }
    }

    /**
     * Reads the contents of a directory.
     * @param {string} directory - The directory to read the contents from.
     * @return {Array}
     */
    static readDirectory(directory) {
        return fs.readdirSync(directory);
    }

    /**
     * Copies the contents from one directory to another.
     * @param {string} src - The source directory.
     * @param {string} dest - The destination directory.
     */
    static copyDirectoryContents(src, dest) {
        const filesToCreate = File.readDirectory(src);

        for(let file of filesToCreate) {
            const originalPath = path.join(src, file);

            /* stop npm from renaming .gitingore files to .npmignore files */
            if(file == "gitignore.txt") file = ".gitignore";

            const newPath = path.join(dest, file);
            const stats = fs.statSync(originalPath);

            if(stats.isFile()) fs.writeFileSync(newPath, fs.readFileSync(originalPath));
            else if (stats.isDirectory()) {
                File.createDirectory(newPath);
                File.copyDirectoryContents(originalPath, newPath);
            }
        }
    }
}