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
     * Reads a JSON file from the disk.
     * @param {string} filename
     * @return {Object} 
     */
    static readJSON(filename) {
        return JSON.parse(fs.readFileSync(filename));
    }

    /**
     * Writes a JSON file to the disk.
     * @param {string} filename 
     * @param {Object} data 
     */
    static writeJSON(filename, data) {
        fs.writeFileSync(filename, JSON.stringify(data, null, 4));
    }

    /**
     * Creates a directory.
     * @param {string} directory 
     */
    static createDirectory(directory) {
        if(!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });
    }

    /**
     * Reads the contents of a directory.
     * @param {string} directory
     * @return {Array.<string>}
     */
    static readDirectory(directory) {
        return fs.readdirSync(directory);
    }

    /**
     * Copies the contents from one directory to another.
     * @param {string} src 
     * @param {string} dest 
     * @param {Object.<string,string>} [filterMap] 
     */
    static copyDirectoryContents(src, dest, filterMap={}) {
        const filesToCreate = File.readDirectory(src);

        for(let file of filesToCreate) {
            const originalPath = path.join(src, file);

            if(filterMap[file]) file = filterMap[file];

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
     * Deletes a directory and all files and subdirectories.
     * @param {string} directory 
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

    /**
     * Chceks if a string is a filepath without attempting to load it.
     * @param {string} filepath 
     * @return {boolean}
     */
    static isFilePath(filepath) {
        return (filepath.includes("/") && !filepath.startsWith("@"));
    }
}