import { glob } from "glob";
import { existsSync } from "fs";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";

async function compileData() {
  try {
    const pattern = "data/llm/**/*.json";
    const files = await glob(pattern);
    const outputPath = join(process.cwd(), "public/generated");
    
    if (!existsSync(outputPath)) {
      console.log("Creating generated directory...");
      await mkdir(outputPath);
    }

    // Compile LLM data
    const llms = JSON.stringify(await compileLLMData(files));
    const llm_output_path = join(outputPath, "llm.json");
    await writeFile(llm_output_path, llms, "utf8");

    // Compile insights data
    const insights = await compileReferencedValuesData();
    const insights_output_path = join(outputPath, "insights.json");
    await writeFile(insights_output_path, insights, "utf8");

    console.log("Data compiled successfully!");
  } catch (error) {
    console.error("Error compiling data:", error);
  }
}

async function compileReferencedValuesData() {
  console.log("Compiling insights data...");
  //TODO: Implement this function to compile insights according to RVCollection interface
}

async function compileLLMData(files) {
  const llms = [];

  console.log("Compiling LLM data...");

  for (const file of files) {
    console.log("Processing:", file);
    const filePath = join(process.cwd(), file);
    const fileData = await readFile(filePath, "utf8");

    // TODO: transform data, resolve hierarchy, etc.

    llms.push(JSON.parse(fileData));
  }
  return llms;
}


await compileData();
