import { globSync, glob } from 'glob';
import { existsSync, readFileSync, writeFileSync, promises } from 'fs';
import { join } from 'path';

async function buildLLMJson() {
  try {
    const pattern = 'data/llm/**/*.json';
    const files = globSync(pattern);

    const llms = [];

    console.log('Compiling LLM data...');

    for (const file of files) {
      console.log('Processing:', file);
      const filePath = join(process.cwd(), file);
      const fileData = readFileSync(filePath, 'utf8');
      llms.push(JSON.parse(fileData));
    }

    const outputPath = join(process.cwd(), 'generated', 'llms.json');

    if (!existsSync(join(process.cwd(), 'generated'))) {
      console.log('Creating generated directory...');
      await promises.mkdir(join(process.cwd(), 'generated'));
    }

    writeFileSync(outputPath, JSON.stringify(llms, null, 2), 'utf8');

    console.log('LLM data has been compiled!');
  } catch (error) {
    console.error('Error compiling LLM data:', error);
  }
}

buildLLMJson();