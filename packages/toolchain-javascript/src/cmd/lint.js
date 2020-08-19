/* imports */
import { ESLint } from "eslint";
import eslintConfig from "../configs/eslint.json";

async function lint() {
    const eslint = new ESLint({ baseConfig: eslintConfig });
    
    const results = await eslint.lintFiles(["src"]);

    const formatter = await eslint.loadFormatter("stylish");
    const resultText = formatter.format(results);

    console.log(resultText);
}

export default lint;