/* imports */
import { File } from "../utils/File";
import { Tasks } from "../utils/Tasks";
import { Template } from "../utils/Template";
import path from "path";
import fs from "fs";


/**
 * ProjectGenerator that creates projects based on a template.
 * @class
 * @private
 */
export class ProjectGenerator {

    /**
     * @param {string} name
     * @param {string} [toolchain]
     * @param {string} [dest]
     */
    constructor(name, toolchain, dest) {
        this.name = name;
        this.unresolvedDest = dest;
        this.dest = path.join(process.cwd(), dest, name);
        this.template = path.join(__dirname, `../templates/project`);

        const toolchainMatch = toolchain.match(/^(@[^/]+\/)?([^@]+)?(@.+)?$/);
        const toolchainScope = toolchainMatch[1] || "";
        const toolchainName = toolchainMatch[2] || "";
        const toolchainVersion = toolchainMatch[3] || "";

        this.toolchain = toolchainScope + toolchainName;

        this.devDependencies = [
            this.toolchain + toolchainVersion,
            "@jolt/cli@5.x.x"
        ];

        this.dependencies = [
            "jolt@5.x.x",
            "@jolt/router@5.x.x"
        ];
    }

    async create() {

        /* stop if the project already exists */
        if (fs.existsSync(this.dest)) {
            console.error(`${this.name} already exists!`);
            return;
        }

        /* copy template files to destination */
        console.log(`Creating ${this.name}...\n`);

        const templateValues = {
            "project-name": this.name,
            "toolchain": this.toolchain
        };

        try {
            File.createDirectory(this.dest);
            Template.create(this.template, this.dest, {}, templateValues);

        } catch (error) {
            console.error("Failed to create the project template.");
            return;
        }

        /* install all dependencies for the template */
        console.log("Installing dependencies, this could take a while.\n");

        try {
            await this._installDependencies();
            await this._installDevDependencies();
            await this._initializeGitRepository();
            this._printStartInstructions();

        } catch (error) {
            console.error(`\nFailed to setup ${this.name}`);
            File.deleteDirectory(this.dest);
        }
    }

    /** Installs the template dependencies. */
    _installDependencies() {
        return new Promise((resolve, reject) => {
            const thread = Tasks.npm(["install", "--save"].concat(this.dependencies), {
                cwd: this.dest,
                stdio: ["ignore", 1, 2]
            });

            thread.on("close", (code) => {
                if (code == 0) resolve();
                else reject();
            });
        });
    }

    _installDevDependencies() {
        return new Promise((resolve, reject) => {
            const thread = Tasks.npm(["install", "--save-dev"].concat(this.devDependencies), {
                cwd: this.dest,
                stdio: ["ignore", 1, 2]
            });

            thread.on("close", (code) => {
                if (code == 0) resolve();
                else reject();
            });
        });
    }

    _initializeGitRepository() {
        console.log("Initializing Git Repository...");

        return new Promise((resolve) => {
            const thread = Tasks.git({ cwd: this.dest }, (error) => {
                if (error) console.error(error.message);
            });

            thread.on("close", (code) => {
                if (code == 0) console.log("Successfully initialized the git repository.\n");
                else console.error("Failed to create a new git repository.\n");
                resolve();
            });
        });
    }

    _printStartInstructions() {
        console.log(`Successfully created ${this.name}\n`);
        console.log("----------------------------------");
        console.log("Get started with your new project!\n");

        if (this.unresolvedDest == ".") console.log(` > cd ${this.name}`);
        else console.log(` > cd ${this.unresolvedDest}/${this.name}`);

        console.log(" > npm run serve");
        console.log("----------------------------------\n");
    }
}
