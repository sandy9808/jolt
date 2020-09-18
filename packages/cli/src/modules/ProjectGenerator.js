/* imports */
import { File } from "../utils/File";
import { Process } from "../utils/Process";
import path from "path";
import fs from "fs";
import { exec } from "child_process";


/**
 * ProjectGenerator that creates projects based on a template.
 * @class
 * @private
 */
export class ProjectGenerator {

    /**
     * @param {string} name
     * @param {string} dest
     */
    constructor(name, dest) {
        this.project = {
            name: name,
            dest: path.join(process.cwd(), dest, name),
            rawDest: dest,
            template: path.join(__dirname, "../templates/project")
        };

        this.project.devPackages = [
            "@jolt/toolchain-javascript@4.x.x",
            "@jolt/cli@4.x.x"
        ];

        this.project.packages = [
            "jolt@4.x.x",
            "@jolt/router@4.x.x"
        ];
    }

    async create() {

        /* stop if the project already exists */
        if (fs.existsSync(this.project.dest)) {
            console.error(`${this.project.name} already exists!`);
            return;
        }

        /* copy template files to destination */
        console.log(`Creating ${this.project.name}...\n`);

        const filter = {
            "gitignore.txt": ".gitignore"
        };

        try {
            File.createDirectory(this.project.dest);
            File.copyDirectoryContents(this.project.template, this.project.dest, filter);
        } catch {
            console.error("Failed to create the project template.");
            return;
        }

        /* update the template's package.json to have the project name */
        try {
            const pkgPath = path.join(this.project.dest, "package.json");
            const pkg = File.readJSON(pkgPath);
            pkg.name = this.project.name;
            File.writeJSON(pkgPath, pkg);
        } catch {
            console.error("Failed to update the package.json with the project name.\n");
            return;
        }

        /* update the template's index.html title tag to have the project name */
        try {
            const indexPath = path.join(this.project.dest, "public", "index.html");
            let index = fs.readFileSync(indexPath, "utf8");
            index = index.replace("<title>Template</title>", `<title>${this.project.name}</title>`);
            fs.writeFileSync(indexPath, index);
        } catch(error) {
            console.error("Failed to update the index.html with the project name.\n");
            return;
        }

        /* install all dependencies for the template */
        console.log("Installing dependencies, this could take a while.\n");

        try {
            await this._installDependencies();
            await this._installDevDependencies();
            await this._initializeGitRepository();
            this._printStartInstructions();

        } catch(error) {
            console.error(error);
            console.error(`\nFailed to setup ${this.project.name}`);
            File.deleteDirectory(this.project.dest);
        }
    }

    _installDependencies() {
        return new Promise((resolve, reject) => {
            const thread = Process.npm(["install", "--save"].concat(this.project.packages), {
                cwd: this.project.dest,
                stdio: ["ignore", 1, 2]
            });

            thread.on("close", (code) => {
                if(code == 0) resolve();
                else reject();
            });
        });
    }

    _installDevDependencies() {
        return new Promise((resolve, reject) => {
            const thread = Process.npm(["install", "--save-dev"].concat(this.project.devPackages), {
                cwd: this.project.dest,
                stdio: ["ignore", 1, 2]
            });

            thread.on("close", (code) => {
                if(code == 0) resolve();
                else reject();
            });
        });
    }

    _initializeGitRepository() {
        console.log("Initializing Git Repository...");

        return new Promise((resolve) => {
            const thread = exec("git init", { cwd: this.project.dest }, (error) => {
                if(error) console.error(error.message);
            });

            thread.on("close", (code) => {
                if(code == 0) {
                    console.log("Successfully initialized the git repository.\n");
                    resolve();
                } else {
                    console.error("Failed to create a new git repository.\n");
                    resolve();
                }
            });
        });
    }

    _printStartInstructions() {
        console.log(`Successfully created ${this.project.name}\n`);
        console.log("----------------------------------");
        console.log("Get started with your new project!\n");
        if(this.project.rawDest == ".") console.log(` > cd ${this.project.name}`);
        else console.log(` > cd ${this.project.rawDest}/${this.project.name}`);
        console.log(" > npm run dev");
        console.log("----------------------------------\n");
    }
}
