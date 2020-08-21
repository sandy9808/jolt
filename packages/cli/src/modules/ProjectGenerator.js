/* imports */
import { File } from "../utils/File";
import path from "path";
import fs from "fs";
import { spawn, exec } from "child_process";

/**
 * ProjectGenerator that creates projects based on a template.
 * @class
 * @private
 */
export class ProjectGenerator {

    /**
     * @param {string} name - The project name.
     * @param {Object} options - The generation options.
     */
    constructor(name, options = {}) {
        this.project = { name: name, dest: path.join(process.cwd(), name) };

        /* decide what template should be used for the project */
        this.template = (options.template || options.t) ? options.template || options.t : "javascript";
        this.project.template = path.join(__dirname, `../templates/${this.template}`);

        this.project.devPackages = [
            `@jolt/toolchain-${this.template}`,
            "@jolt/cli"
        ];
        this.project.packages = [
            "jolt",
            "@jolt/router"
        ];
    }

    /** Generates the Project. */
    create() {
        /* stop if the project already exists */
        if (fs.existsSync(this.project.dest)) {
            console.error(`${this.project.name} already exists!`);
            return;
        }

        /* check if the requested template exists */
        if (!fs.existsSync(this.project.template)) {
            console.error("The requested template does not exists!");
            return;
        }

        /* copy template files to destination */
        console.log(`Creating ${this.project.name}...\n`);

        File.createDirectory(this.project.dest);
        File.copyDirectoryContents(this.project.template, this.project.dest, this.template);

        /* update the template's package.json to have the project name */
        try {
            const pkgPath = path.join(this.project.dest, "package.json");
            const pkg = File.loadJSON(pkgPath);
            pkg.name = this.project.name;
            File.writeJSON(pkgPath, pkg);
        } catch {
            console.error("Failed to update the package.json with the projet name.\n");
            return;
        }

        /* install all depedencies for the template */
        console.log("Installing depedencies, this could take a while.\n");

        this._installDependencies()
            .then(this._installDevDependencies.bind(this))
            .then(this._initializeGitRepository.bind(this))
            .then(this._printStartInstructions.bind(this))
            .catch(() => {
                console.error(`\nFailed to setup ${this.project.name}`);
                File.deleteDirectory(this.project.dest);
            });
    }

    /**
     * Installs dependencies.
     * @private
     */
    _installDependencies() {
        return new Promise((resolve, reject) => {
            const thread = spawn("npm", ["install", "--save"].concat(this.project.packages), {
                cwd: this.project.dest,
                stdio: ["ignore", 1, 2]
            });

            thread.on("close", (code) => {
                if (code == 0) resolve();
                else reject();
            });
        });
    }

    /**
     * Installs dev dependencies.
     * @private
     */
    _installDevDependencies() {
        return new Promise((resolve, reject) => {
            const thread = spawn("npm", ["install", "--save-dev"].concat(this.project.devPackages), {
                cwd: this.project.dest,
                stdio: ["ignore", 1, 2]
            });

            thread.on("close", (code) => {
                if (code == 0) resolve();
                else reject();
            });
        });
    }

    /**
     * Initializes a git repository.
     * @private
     */
    _initializeGitRepository() {
        console.log("Initializing Git Repository...");

        return new Promise((resolve) => {
            const thread = exec("git init", { cwd: this.project.dest }, (error) => {
                if (error) console.error(error.message);
            });

            thread.on("close", (code) => {
                if (code == 0) {
                    console.log("Successfully initialized the git repository.\n");
                    resolve();
                } else {
                    console.error("Failed to create a new git repository.\n");
                    resolve();
                }
            });
        });
    }

    /**
     * Prints the start instructions.
     * @private
     */
    _printStartInstructions() {
        console.log(`Successfully created ${this.project.name}\n`);
        console.log("----------------------------------");
        console.log("Get started with your new project!\n");
        console.log(` > cd ${this.project.name}`);
        console.log(" > npm run dev");
        console.log("----------------------------------\n");
    }
}