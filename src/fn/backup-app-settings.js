const api = require("../lib/api");
const backupFileFor = require("../lib/backup-file-for");
const environment = require("../lib/environment");
const fs = require("../lib/sync-fs");
const log = require("../lib/log");

module.exports = {
  requiresInstance: true,
  execute: () => {
    const backupLocation = backupFileFor(
      environment.pathToProject,
      "app_settings.json",
    );

    return api()
      .getAppSettings()
      .then((body) => {
        fs.writeJson(backupLocation, body.settings);
        return body.seetings;
      })
      .then((settings) => {
        log("Backed up to:", backupLocation);
        return { success: true, file: backupLocation, settings: settings };
      });
  },
};
