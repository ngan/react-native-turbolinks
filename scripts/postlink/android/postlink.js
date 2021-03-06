var fs = require("fs");
var glob = require("glob");
var path = require("path");

module.exports = () => {

  var ignoreFolders = { ignore: ["node_modules/**", "**/build/**"] };
  var buildGradlePath = path.join("android", "build.gradle");
  var manifestPath = glob.sync("**/AndroidManifest.xml", ignoreFolders)[0];

  function setMinSdkVersion() {
    if (buildGradlePath) {
      var buildGradleContents = fs.readFileSync(buildGradlePath, "utf8");
      var minSdkVersion = buildGradleContents.match(/minSdkVersion.+/)[0]
      var minSdkVersionNew = `minSdkVersion = 19`;
      buildGradleContents = buildGradleContents.replace(minSdkVersion, minSdkVersionNew)
      fs.writeFileSync(buildGradlePath, buildGradleContents);
    } else {
        return Promise.reject('Error setting (minSdkVersion = 19)');
    }
  }

  function setAllowBackup() {
    if (manifestPath) {
      var manifestContents = fs.readFileSync(manifestPath, "utf8");
      var androidAllowBackup = `android:allowBackup="false"`;
      var androidAllowBackupNew = `android:allowBackup="true"`;
      manifestContents = manifestContents.replace(androidAllowBackup, androidAllowBackupNew)
      fs.writeFileSync(manifestPath, manifestContents);
    } else {
        return Promise.reject('Error setting (android:allowBackup="true")');
    }
  }

  setMinSdkVersion()
  setAllowBackup()

  return Promise.resolve();
}
