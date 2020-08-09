/* import */
import { File } from "../utils/File";
import path from "path";
import fs from "fs";
import { spawn, exec } from "child_process";

/**
 * Project Generator that creates projects based on a template.
 * @class
 * @private
 */
export class ProjectGenerator {

    /**
     * @param {string} name - The project name.
     */
    constructor(name) {
        this.project = {
            name: name,
            template: path.join(__dirname, "../template"),
            dest: path.join(process.cwd(), name),
            devPackages: [
                "rollup@1.x.x",
                "@rollup/plugin-node-resolve@8.x.x",
                "@rollup/plugin-commonjs@11.x.x",
                "@rollup/plugin-url@5.x.x",
                "rollup-plugin-css-bundle@1.x.x",
                "rollup-plugin-minify-html-literals@1.x.x",
                "rollup-plugin-terser@5.x.x",
                "@jolt/server@1.x.x",
                "npm-run-all@4.x.x",
                "jsdoc@3.x.x",
                "eslint@7.x.x"
            ],
            packages: [
                "jolt",
                "@jolt/router"
            ]
        };
    }

    /** Generates the project and sets it up */
    create() {
        /* stop if the project already exists */
        if (fs.existsSync(this.project.dest)) {
            console.error(`${this.project.name} already exists!`);
            return;
        }

        /* copy template files */
        console.log(`Creating ${this.project.name}...\n`);

        File.createDirectory(this.project.dest);
        File.copyDirectoryContents(this.project.template, this.project.dest);

        /* update template package.json to have the project name */
        try {
            const pkgPath = path.join(this.project.dest, "package.json");
            let pkg = JSON.parse(fs.readFileSync(pkgPath));
            pkg.name = this.project.name;
            fs.writeFileSync(pkgPath, JSON.stringify(pkg));
        } catch {
            console.error("Failed to update the package.json with the project name.\n");
        }

        console.log("Installing dependencies, this could take a while.\n");

        /* install all dependencies for the template */
        this.installDependencies()
            .then(this.initializeGitRepository.bind(this))
            .then(this.printStartInstructions.bind(this))
            .catch(() => {
                console.error(`\nFailed to setup ${this.project.name}`);
            });
    }

    /** install template dependencies */
    installDependencies() {
        return new Promise((resolve, reject) => {
            const devThread = spawn("npm", ["install", "--save-dev"].concat(this.project.devPackages), {
                cwd: this.project.dest,
                stdio: ["ignore", 1, 2]
            });

            devThread.on("close", (code) => {
                if (code != 0) reject();
                else {
                    const thread = spawn("npm", ["install", "--save"].concat(this.project.packages), {
                        cwd: this.project.dest,
                        stdio: ["ignore", 1, 2]
                    });

                    thread.on("close", (code) => {
                        if (code == 0) {
                            console.log(`Successfully created ${this.project.name}\n`);
                            resolve();
                        }
                        else reject();
                    });
                }
            });
        });
    }

    /** initialize a new github repository */
    initializeGitRepository() {
        console.log("Initializing git respository...");


        return new Promise((resolve) => {
            const git = exec("git init", { cwd: this.project.dest }, function (error) {
                if (error) {
                    console.error(error.message);
                }
            });

            git.on("close", function (code) {
                if (code == 0) {
                    console.log("Successfully initialized the git repository\n");
                    resolve();
                } else {
                    console.error("Failed to create a new git repository.\n");
                    resolve();
                }
            });
        });
    }

    /** Prints the start instructions for the project */
    printStartInstructions() {
        console.log("----------------------------------");
        console.log("Get started with your new project!\n");
        console.log(` > cd ${this.project.name}`);
        console.log(" > npm run dev");
        console.log("----------------------------------\n");
    }
}