const path = require("path");
const environment = require("../lib/environment");
const fs = require("../lib/sync-fs");
const { info } = require("../lib/log");

const LAYOUT = {
  "contact-summary.templated.js": `module.exports = {
  fields: [],
  cards: [],
  context: {}
};`,
  "privacy-policies.json": {},
  "privacy-policies": {},
  "resources.json": {},
  "harness.defaults.json": {},
  resources: {},
  "targets.js": "module.exports = [];",
  "tasks.js": "module.exports = [];",
  ".eslintrc": `{
  "env": {
    "node": true,
    "es6": true
  },
  "parserOptions": {
    "ecmaVersion": 6
  }
}`,
  forms: {
    app: {},
    collect: {},
    contact: {},
  },
  translations: {},
  app_settings: {
    "base_settings.json": {},
    "forms.json": {},
    "schedules.json": [],
  },
  test: {
    forms: {},
    "contact-summary": {},
    tasks: {},
    targets: {},
  },
};

function createRecursively(dir: string, layout) {
  fs.mkdir(dir);

  for (const k in layout) {
    const path = `${dir}/${k}`;

    const val = layout[k];
    if (typeof val === "object") {
      if (k.match(/.json$/)) {
        fs.writeJson(path, val);
      } else {
        createRecursively(path, val);
      }
    } else fs.write(path, val);
  }
}

function execute() {
  const { extraArgs } = environment;
  if (extraArgs && extraArgs.length) extraArgs.forEach(createProject);
  else createProject(".");

  function createProject(root: string) {
    const dir = path.join(environment.pathToProject, root);
    info(`Initialising project at ${dir}`);
    createRecursively(dir, LAYOUT);
    return `initialized project at ${dir}`;
  }
}

module.exports = {
  requiresInstance: false,
  execute,
};
