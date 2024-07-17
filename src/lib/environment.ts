const url = require("url");

const LOCAL_MATCHER = /^(.*localhost|\[::1\]|127\.0\.0\.\d{1,3})$/;
const DEV_MATCHER = /^(dev|test|staging)(-\w+|\d+)?$/; // dev, test1, test-xx, ...

let state: {
  initialized: boolean;
  pathToProject: string | null;
  isArchiveMode: boolean;
  archiveDestination: string;
  extraArgs: string[];
  apiUrl: string;
  force: boolean;
  skipTranslationCheck: boolean;
  sessionToken: string;
  skipValidate: boolean;
} = {
  pathToProject: null,
  isArchiveMode: false,
  archiveDestination: "",
  extraArgs: [],
  initialized: false,
  apiUrl: "",
  force: false,
  skipTranslationCheck: false,
  sessionToken: "",
  skipValidate: false,
};

const initialize = (
  pathToProject: string,
  isArchiveMode: boolean,
  archiveDestination: string,
  extraArgs: string[],
  apiUrl: string,
  force: boolean,
  skipTranslationCheck: boolean,
  skipValidate: boolean,
  sessionToken: string,
) => {
  // if (state.initialized) {
  // throw Error("environment is already initialized");
  //}

  Object.assign(state, {
    apiUrl: apiUrl && apiUrl.toString(),
    archiveDestination,
    extraArgs,
    initialized: true,
    isArchiveMode,
    pathToProject,
    force,
    skipTranslationCheck,
    skipValidate,
    sessionToken,
  });
};

const getState = (prop: string) => {
  if (!state.initialized) {
    // If this exception is raised, it means that the use of any method of this
    // module was earlier than the state initialization, so the problem is not of
    // how cht-conf was invoked by the user, but a bug introduced in the code
    throw new Error(
      `Cannot return environment.${prop}: state was not initialized yet`,
    );
  }
  return state[prop as keyof typeof state];
};

const destroy = () => {
  state = {
    pathToProject: null,
    isArchiveMode: false,
    archiveDestination: "",
    extraArgs: [],
    initialized: false,
    apiUrl: "",
    force: false,
    skipTranslationCheck: false,
    sessionToken: "",
    skipValidate: false,
  };
};

module.exports = {
  destroy: destroy,
  initialize,

  get pathToProject() {
    return getState("pathToProject") || ".";
  },
  get isArchiveMode() {
    return !!getState("isArchiveMode");
  },
  get archiveDestination() {
    return getState("archiveDestination");
  },
  get instanceUrl() {
    return this.apiUrl && this.apiUrl.replace(/\/medic$/, "");
  },
  get extraArgs() {
    return getState("extraArgs");
  },
  get apiUrl() {
    return getState("apiUrl");
  },
  get force() {
    return getState("force");
  },
  get skipTranslationCheck() {
    return getState("skipTranslationCheck");
  },
  get skipValidate() {
    return getState("skipValidate");
  },
  get sessionToken() {
    return getState("sessionToken");
  },

  isProduction(): boolean {
    if (!this.instanceUrl) {
      return false;
    }
    const hostname = new url.URL(this.instanceUrl).hostname;
    if (LOCAL_MATCHER.test(hostname)) {
      return false;
    }
    return !hostname
      .split(".")
      .some((subdomain: string) => DEV_MATCHER.test(subdomain));
  },
};
