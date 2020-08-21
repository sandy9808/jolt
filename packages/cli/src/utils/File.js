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
     * loads a JSON file from the disk.
     * @param {string} filename - The file to load.
     * @return {Object}
     */
    static loadJSON(filename) {
        return JSON.parse(fs.readFileSync(filename));
    }

    /**
     * writes a JSON file to disk.
     * @param {string} filename 
     * @param {Object} data 
     */
    static writeJSON(filename, data) {
        fs.writeFileSync(filename, JSON.stringify(data));
    }

    /**
     * Creates a directory.
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
     * @param {Object.<string,string>} filterMap - a map of files to filter to new filenames.
     */
    static copyDirectoryContents(src, dest, filterMap={}) {
        const filesToCreate = File.readDirectory(src);

        for(let file of filesToCreate) {
            const originalPath = path.join(src, file);

            if(filterMap[file] != undefined) {
                file = filterMap[file];
            }

            const newPath = path.join(dest, file);
            const stats = fs.statSync(originalPath);

            if(stats.isFile()) fs.writeFileSync(newPath, fs.readFileSync(originalPath));
            else if (stats.isDirectory()) {
                File.createDirectory(newPath);
                File.copyDirectoryContents(originalPath, newPath, filterMap);
            }
        }
    }

    /**
     * Deletes a directory and all files or folders inside it.
     * @param {string} directory - The directory to delete.
     */
    static deleteDirectory(directory) {
        if(fs.existsSync(directory)) {
            const files = File.readDirectory(directory);

            for(let file of files) {
                const filepath = path.join(directory, file);
    
                if(fs.statSync(filepath).isDirectory()) File.deleteDirectory(filepath);
                else fs.unlinkSync(filepath);
            }

            fs.rmdirSync(directory);
        }
    }
}