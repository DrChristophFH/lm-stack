import { glob } from "glob";
import { existsSync } from "fs";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";

async function compileData() {
  try {
    const outputPath = join(process.cwd(), "public/generated");

    if (!existsSync(outputPath)) {
      console.log("Creating generated directory...");
      await mkdir(outputPath);
    }

    // Compile LLM data
    const llms = JSON.stringify(await compileLLMData());
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
  
  const pattern = "../data/referenced_values/insights.json";

  const filePath = join(process.cwd(), pattern);

  if (existsSync(filePath)) {
    const fileData = await readFile(filePath, "utf8");
    return fileData;
  } else {
    throw new Error("Insights data file not found");
  }
}

async function compileLLMData() {
  const pattern = "../data/llms/**/*.json";
  const files = await glob(pattern);
  const parsed_files = [];
  const llms = [];

  console.log("Compiling LLM data...");

  for (const file of files) {
    console.log("Loading:", file);
    const filePath = join(process.cwd(), file);
    const fileData = await readFile(filePath, "utf8");
    parsed_files.push(JSON.parse(fileData));
  }

  while (parsed_files.length > 0) {
    let llm = parsed_files.shift();

    // merge llm with base llm it derives from
    if (llm.derives_from) {
      const parentLLM = llms.find((search_llm) => search_llm.id === llm.derives_from.toLowerCase());

      if (parentLLM) {
        llm = deepCopyAndMerge(parentLLM, llm);
      } else {
        parsed_files.push(llm); // parent not found yet: requeue
        continue;
      }
    }

    // validate and sanitize llm data
    try {
      validateAndSanitizeLLMData(llm);
      llms.push(llm);
      console.log(`Processed LLM ${llm.id}`);
    } catch (error) {
      console.error(`Error processing LLM ${llm.id}: ${error.message}`);
    }
  }

  return llms;
}

/**
 * Deep merge two objects.
 *
 * This function is a recursive function that merges two objects deeply.
 * `target` is the object that will be modified in place.
 * `source` provides the values that will override the values in `target`.
 *
 * @param {*} target
 * @param {*} source
 * @returns  The merged object
 */
function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      if (!target[key] || typeof target[key] !== "object") {
        target[key] = {}; // Ensure the target key is an object
      }
      deepMerge(target[key], source[key]);
    } else {
      // Directly assign values for non-object keys
      target[key] = source[key];
    }
  }
  return target;
}

/**
 * Deep clone an object using structured cloning.
 *
 * @param {*} original
 * @param {*} overrides
 * @returns  The cloned object
 */
function deepCopyAndMerge(original, overrides) {
  const copy = structuredClone(original);
  return deepMerge(copy, overrides);
}

/**
 * Validates and sanitizes the LLM data from the less restrictive JSON schema
 * defined in `docs/llm-data-schema.md` into a more precise format.
 *
 * @param {*} llm The LLM data to validate and sanitize
 */
function validateAndSanitizeLLMData(llm) {
  validateField(llm, "id", "string", false, (id) => id.toLowerCase());
  validateField(llm, "name", "string");
  popFieldIfPresent(llm, "derives_from");
  validateField(llm, "family", "string");
  validateField(llm, "release_date", "string");
  validateField(llm, "from", "string");
  validateField(llm, "usage_type", "string");
  validateField(llm, "description", "string");
  validateObjectField(
    llm, "readme",
    (readme) => {
      validateField(readme, "url", "string");
      validateField(readme, "raw_url", "string", true);
    },
    true
  );
  validateObjectField(llm, "model", (model) => {
    validateField(model, "architecture", "string");
    validateField(model, "subtype", "string");
    validateArrayField(model, "insights", (insight) => {
      if (typeof insight !== "string") {
        throw new Error("Insight must be a string");
      }
    });
    validateField(model, "parameters", "number", false, parametersToNumber);
    validateField(model, "active_parameters", "number", true, parametersToNumber);
    validateField(model, "context_size", "number", false, parametersToNumber);
    validateField(model, "tokenizer", "string");
    validateField(model, "hidden_size", "number", false, parametersToNumber);
    validateField(model, "vocab_size", "number", false, parametersToNumber);
    validateField(model, "positional_embedding", "string");
    validateField(model, "attention_variant", "string");
    validateField(model, "activation", "string");
  });
  validateObjectField(llm, "training", (training) => {
    validateField(training, "tokens", "number", false, parametersToNumber);
  });
  validateField(llm, "license_type", "string");
  validateField(llm, "license_url", "string", true);
  validateField(llm, "download_url", "string", true);
  validateField(llm, "paper_url", "string", true);
  validateArrayField(
    llm, "bonus",
    (bonus) => {
      validateField(bonus, "type", "string");
      validateField(bonus, "title", "string");
      validateField(bonus, "url", "string");
    },
    true
  );
  validateField(llm, "logo_file", "string", true);
  validateField(llm, "updated", "string");
}

/**
 * Takes a parameter count as a string or number and returns it as a number.
 *
 * For string values, it understands the following suffixes:
 * - "K" or "k" for thousands
 * - "M" or "m" for millions
 * - "B" or "b" for billions
 * - "T" or "t" for trillions
 *
 * For convenience, it also accepts number values and returns them as is.
 *
 * @param {*} parameters
 */
function parametersToNumber(parameters) {
  let number = parameters;

  if (typeof parameters === "string") {
    const suffix = parameters.trim().slice(-1).toLowerCase();
    number = parseFloat(parameters.slice(0, -1));

    switch (suffix) {
      case "k":
        number *= 1e3;
        break;
      case "m":
        number *= 1e6;
        break;
      case "b":
        number *= 1e9;
        break;
      case "t":
        number *= 1e12;
        break;
    }
  }

  return number;
}

/**
 * Deep clones an object using structured cloning.
 *
 * @param {*} obj
 * @returns The cloned object
 */
function structuredClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Checks if a field is present according to the optionality of it,
 * performs specified transformations on the field, and validates the field
 * against a specified type.
 *
 * @param {*} field
 * @param {*} type
 * @param {*} optional
 * @param {*} transform
 */
function validateField(object, field, type, optional = false, transform = (x) => x) {
  if (!optional && object[field] === undefined) {
    throw new Error(`Field ${field} is required`);
  }

  object[field] = transform(object[field]);

  if (object[field] !== undefined && typeof object[field] !== type) {
    throw new Error(`Field ${field} is not of type ${type} (got ${typeof object[field]})`);
  }
}

/**
 * Validates an object field against a specified validation function.
 *
 * @param {*} field
 * @param {*} validationFunction
 * @param {*} optional
 */
function validateObjectField(object, field, validationFunction, optional = false) {
  if (!optional && object[field] === undefined) {
    throw new Error(`Field ${field} is required`);
  }

  try {
    validationFunction(object[field]);
  } catch (error) {
    throw new Error(`Field ${field} is invalid: ${error.message}`);
  }
}

/**
 * Validates an array field against a specified validation function.
 *
 * @param {*} field
 * @param {*} validationFunction
 * @param {*} optional
 */
function validateArrayField(object, field, validationFunction, optional = false) {
  if (!optional && object[field] === undefined) {
    throw new Error(`Field ${field} is required`);
  }

  if (!Array.isArray(object[field])) {
    throw new Error(`Field ${field} is not an array`);
  }

  for (const item of object[field]) {
    try {
      validationFunction(item);
    } catch (error) {
      throw new Error(`Field ${field} is invalid: ${error.message}`);
    }
  }
}

/**
 * Removes a field from an object if it is present.
 *
 * @param {*} obj
 * @param {*} field
 */
function popFieldIfPresent(obj, field) {
  if (obj[field]) {
    delete obj[field];
  }
}

await compileData();
