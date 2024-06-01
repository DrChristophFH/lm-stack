# lm-stack  

![lm-stack](/public/icon.svg)

lm-stack aims to provide a simple and easy-to-use overview of popular large language models.

## Adding a new model

To add a new model, you need to create a new model .json file in the `data/llm` directory. These get bundled into the app at build time. Logos for a new provider need to be available in the `public/logos` directory as a .svg file.

## TODO

**Public Relations**
- [ ] GitHub Props
  - [x] To Repository
  - [x] To Author
  - [ ] To Contributors
  - [ ] To Libraries Used (in ReadMe)
- [ ] Contributer List

**Models**
- [ ] Incorporate Bonus Section
- [ ] Easy way to add new models
  - [x] Form to standardized filled out GitHub Issue
  - [ ] check if proposal exists already
- [ ] Easy change proposal for changes to existing models
  - [ ] Form to standardized filled out GitHub Issue
- [ ] Add more models

**Timeline Control**
- [x] Grouped view of Models
  - [x] parent model field in model card
  - [x] Popover select child models in parent graph?
- [ ] Model Search
- [ ] Model Filtering
- [ ] Zoom to date range

**General Functionality**
- [x] Copy Model Card Json to Clipboard
- [x] Export Model Card Json to File
- [x] Selected Model as URL Param

**Visual Improvements**
- [x] Dark Mode
  - [x] Fix for readmes
- [ ] Model Card Copy Button Animation or something

**Informational Content**
- [ ] Information on Fields in Model Card
- [ ] Specific Information on Field Values in Model Card