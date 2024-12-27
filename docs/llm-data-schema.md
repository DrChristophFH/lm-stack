# LLM Data JSON Schema Documentation

This documentation provides a structured explanation of the JSON schema for the **LLM Data** inside the `/data` directory. The schema defines the metadata fields for describing and providing information about the model, training data, and other resources.

## Table of Contents

- [LLM Data JSON Schema Documentation](#llm-data-json-schema-documentation)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Sample JSON](#sample-json)
  - [Schema Fields](#schema-fields)
    - [Top-Level Fields](#top-level-fields)
    - [Readme Object](#readme-object)
    - [Model Object](#model-object)
    - [Training Object](#training-object)
    - [Bonus Array](#bonus-array)
  - [Referenced Values](#referenced-values)

---

## Overview

The JSON schema is designed to provide a structured format for sharing information about language models and related resources. The schema includes top-level fields for general information about the model, such as its name, release date, and download links. It also includes nested objects for detailed information about the model architecture, training data, and additional resources.

---

## Sample JSON

A sample JSON object following the schema is shown below, describing the Apple OpenELM-3B-Instruct model:

```json
{
  "id": "apple/openelm-3b-instruct",
  "name": "OpenELM-3B-Instruct",
  "release_date": "2024-04-22",
  "from": "apple",
  "usage_type": "GP-LLM",
  "description": "",
  "readme": {
    "link": "https://huggingface.co/apple/OpenELM-3B-Instruct/blob/main/README.md",
    "raw": "https://huggingface.co/apple/OpenELM-3B-Instruct/raw/main/README.md"
  },
  "model": {
    "architecture": "Transformer",
    "subtype": "decoder-only",
    "insights": [
      "layer-wise-scaling",
      "flash-attention"
    ],
    "parameters": "3B",
    "active_parameters": "3B",
    "context_size": "2048",
    "tokenizer": "SentencePiece",
    "hidden_size": "3072",
    "vocab_size": "32000",
    "positional_embedding": "RoPE",
    "attention_variant": "grouped-query attention",
    "activation": "SwiGLU"
  },
  "training": {
    "tokens": "1.8T"
  },
  "license_type": "Apple-sample-code-license",
  "license_url": "https://huggingface.co/apple/OpenELM-3B-Instruct/blob/main/LICENSE",
  "download": "https://huggingface.co/apple/OpenELM-3B-Instruct",
  "paper": "https://arxiv.org/pdf/2404.14619",
  "bonus": [
    {
      "type": "repo",
      "title": "CoreNet Repository",
      "url": "https://github.com/apple/corenet"
    }
  ],
  "updated": "2024-05-25",
  "parent": "OpenELM"
}
```

---

## Schema Fields

### Top-Level Fields

| Field            | Type     | Required? | Description                                                                                                                                                                                                                                                                      |
| ---------------- | -------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **id**           | `string` | Yes       | Unique identifier for the model. Usually follows a `username/model-name` format.                                                                                                                                                                                                 |
| **name**         | `string` | Yes       | A human-readable name for the model.                                                                                                                                                                                                                                             |
| **derives_from** | `string` | Optional  | The model that this model is derived from. If provided, the model inherits all properties from the parent model, overriding only the fields that are explicitly defined. **This essentially makes all required fields optional as long as they are provided by the base model!** |
| **family**       | `string` | Yes       | The family or lineage of this model (e.g., `OpenELM`).                                                                                                                                                                                                                           |
| **release_date** | `string` | Yes       | The date of the model release in `YYYY-MM-DD` format.                                                                                                                                                                                                                            |
| **from**         | `string` | Yes       | The entity or organization that provides/publishes the model.                                                                                                                                                                                                                    |
| **usage_type**   | `string` | Yes       | Indicates how this model can be used or the license category (e.g., `GP-LLM`).                                                                                                                                                                                                   |
| **description**  | `string` | Yes       | A brief description of the model or any additional notes.                                                                                                                                                                                                                        |
| **readme**       | `object` | Optional  | See [Readme Object](#readme-object).                                                                                                                                                                                                                                             |
| **model**        | `object` | Yes       | See [Model Object](#model-object).                                                                                                                                                                                                                                               |
| **training**     | `object` | Yes       | See [Training Object](#training-object).                                                                                                                                                                                                                                         |
| **license_type** | `string` | Yes       | The short identifier for the license type. Might be used to deterimine the standard license url/source.                                                                                                                                                                          |
| **license_url**  | `string` | Optional  | A link to the full text of the license for reference. If not provided, `license_type` will be used to determine the standard license url if available.                                                                                                                           |
| **download**     | `string` | Optional  | Link to download or access the model.                                                                                                                                                                                                                                            |
| **paper**        | `string` | Optional  | URL pointing to a paper or publication describing the model.                                                                                                                                                                                                                     |
| **bonus**        | `array`  | Optional  | An array of bonus resources. See [Bonus Array](#bonus-array).                                                                                                                                                                                                                    |
| **logo_file**    | `string` | Optional  | The filename of the logo image for the model.                                                                                                                                                                                                                                    |
| **updated**      | `string` | Yes       | The last updated date in `YYYY-MM-DD` format.                                                                                                                                                                                                                                    |

---

### Readme Object

| Field    | Type     | Required? | Description                                                                                |
| -------- | -------- | --------- | ------------------------------------------------------------------------------------------ |
| **link** | `string` | Yes       | URL pointing to a README page, usually in a rendered form (e.g., on GitHub or HuggingFace) |
| **raw**  | `string` | Optional  | URL pointing to the raw version of the README (plain text / Markdown)                      |

**Example**:
```json
"readme": {
  "link": "https://huggingface.co/apple/OpenELM-3B-Instruct/blob/main/README.md",
  "raw": "https://huggingface.co/apple/OpenELM-3B-Instruct/raw/main/README.md"
}
```

---

### Model Object

| Field                    | Type             | Required? | Description                                                                    |
| ------------------------ | ---------------- | --------- | ------------------------------------------------------------------------------ |
| **architecture**         | `string`         | Yes       | Indicates the type of deep learning architecture (e.g., Transformer).          |
| **subtype**              | `string`         | Yes       | The variant of the architecture, e.g., `decoder-only`.                         |
| **insights**             | `array`          | Yes       | List of special model features, e.g., `layer-wise-scaling`, `flash-attention`. |
| **parameters**           | `number\|string` | Yes       | Size of the model in terms of parameters (e.g., `3B`).                         |
| **active_parameters**    | `number\|string` | Optional  | Sometimes needed to clarify the total number of parameters.                    |
| **context_size**         | `number\|string` | Yes       | Maximum sequence context length supported by the model (e.g., `2048`).         |
| **tokenizer**            | `string`         | Yes       | Indicates the type of tokenizer used (e.g., SentencePiece).                    |
| **hidden_size**          | `number\|string` | Yes       | The dimension of the hidden layers (e.g., `3072`).                             |
| **vocab_size**           | `number\|string` | Yes       | The size of the vocabulary (e.g., `32000`).                                    |
| **positional_embedding** | `string`         | Yes       | Type of positional embedding used (e.g., `RoPE`).                              |
| **attention_variant**    | `string`         | Yes       | The attention mechanism (e.g., `grouped-query attention`).                     |
| **activation**           | `string`         | Yes       | The activation function used (e.g., `SwiGLU`).                                 |

**Note: The `parameters`, `active_parameters`, `context_size`, `hidden_size`, and `vocab_size` fields can be either a number or a string to allow for flexibility in representing large numbers.**

**Example**:
```json
"model": {
  "architecture": "Transformer",
  "subtype": "decoder-only",
  "insights": [
    "layer-wise-scaling",
    "flash-attention"
  ],
  "parameters": "3B",
  "active_parameters": "3B",
  "context_size": "2048",
  "tokenizer": "SentencePiece",
  "hidden_size": "3072",
  "vocab_size": "32000",
  "positional_embedding": "RoPE",
  "attention_variant": "grouped-query attention",
  "activation": "SwiGLU"
}
```

---

### Training Object

| Field        | Type     | Description                                         |
|--------------|----------|-----------------------------------------------------|
| **tokens**   | `string` | The number of tokens used to train the model (e.g., `1.8T`). |

**Example**:
```json
"training": {
  "tokens": "1.8T"
}
```

---

### Bonus Array

Each element in the `bonus` array is an object with fields describing additional urls as bonus resources:

| Field     | Type     | Description                                |
| --------- | -------- | ------------------------------------------ |
| **type**  | `string` | The type of bonus resource (e.g., `repo`). |
| **title** | `string` | A short name or title for the resource.    |
| **url**   | `string` | A URL pointing to the resource.            |

**Example**:
```json
"bonus": [
  {
    "type": "repo",
    "title": "CoreNet Repository",
    "url": "https://github.com/apple/corenet"
  }
]
```

---

## Referenced Values

Referenced values are special identifiers for specific fields that are used to avoid duplication and ensure consistency across multiple models. 

Fields that use referenced values are usually of type `string`. Here is a list of the fields that use referenced values and where to find the definitions available:

- **`from`**
  - **Definition**: The entity or organization that provides/publishes the model.
  - **Values**: Refer to [the defining json file](data/referenced_values/organizations.json) for the list of available values.
- **`usage_type`**
  - **Definition**: Indicates the intended use case of the model
  - **Values**: Refer to [the defining json file](data/referenced_values/usage_types.json) for the list of available values.
- **`model/architecture`**
  - **Definition**: Indicates the general type of deep learning architecture used in the model.
  - **Values**: Refer to [the defining json file](data/referenced_values/architectures.json) for the list of available values.
- **`model/subtype`**
  - **Definition**: The variant of the architecture used in the model.
  - **Values**: Refer to [the defining json file](data/referenced_values/subtypes.json) for the list of available values.
- **`model/insights`**
  - **Definition**: Special features or insights of the model.
  - **Values**: Refer to [the defining json file](data/referenced_values/insights.json) for the list of available values.
- **`model/tokenizer`**
  - **Definition**: The type of tokenizer used in the model.
  - **Values**: Refer to [the defining json file](data/referenced_values/tokenizers.json) for the list of available values.
- **`model/positional_embedding`**
  - **Definition**: The type of positional embedding used in the model.
  - **Values**: Refer to [the defining json file](data/referenced_values/positional_embeddings.json) for the list of available values.
- **`model/attention_variant`**
  - **Definition**: The attention mechanism used in the model.
  - **Values**: Refer to [the defining json file](data/referenced_values/attention_variants.json) for the list of available values.
- **`model/activation`**
  - **Definition**: The activation function used in the model.
  - **Values**: Refer to [the defining json file](data/referenced_values/activations.json) for the list of available values.
- **`license_type`**
  - **Definition**: The short identifier for the license type.
  - **Values**: Refer to [the defining json file](data/referenced_values/licenses.json) for the list of available values.

*That’s it! By following this structure, you provide a clear overview of each field and its meaning, as well as direct links to more information.*