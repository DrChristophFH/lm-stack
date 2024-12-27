/**
 * LLM Data API
 * ----------------------------------------------------------------------------
 * This file provides a small TypeScript API for:
 *  
 */

import { LLM } from "./types/llm";
import { RVCollection } from "./types/referenced-values";


export class LLMDataManager {
  /** 
   * Map of all loaded models by their `id`. 
   */
  private models: Map<string, LLM> = new Map();

  /**
   * Collection of all referenced values, loaded from JSON files.
   */
  private references: RVCollection | null = null;

  /**
   * The constructor doesn’t do any loading by default. 
   * You can load references or models by calling the relevant methods below.
   */
  constructor() { }

  /**
   * Loads the referenced values from the provided URL.
   * 
   * The referenced values are expected to be in the shape of the `RVCollection` interface.
   * 
   * @param rv_url The URL to load the referenced values from.
   */
  public async loadReferencedValues(rv_url: string): Promise<void> {
    let response = await fetch(rv_url);

    if (!response.ok) {
      throw new Error(`Failed to load referenced values from ${rv_url}`);
    }

    this.references = await response.json();
  }

  /**
   * Loads all .json files from the provided directory
   * that match the shape of an LLM object.
   */
  public async loadModels(models_url: string): Promise<void> {
    let response = await fetch(models_url);

    if (!response.ok) {
      throw new Error(`Failed to load models from ${models_url}`);
    }

    let data: LLM[] = await response.json();

    data.forEach((model) => {
      this.models.set(model.id, model);
    });

  }


 
}