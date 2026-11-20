const { withPodfile } = require("expo/config-plugins");

/**
 * Sube la versión mínima de iOS de todos los pods (y sus bundles de recursos)
 * a la de la app. Algunas librerías declaran iOS 9–13 y Xcode 27 solo admite
 * de 15.0 en adelante, así que el build falla con "IPHONEOS_DEPLOYMENT_TARGET
 * is set to 12.0, but the range of supported deployment target versions is…".
 *
 * Va como plugin porque ios/ se regenera con `expo prebuild`.
 */
const MARKER = "# withPodsDeploymentTarget";

module.exports = function withPodsDeploymentTarget(config, { minimum = "15.1" } = {}) {
  return withPodfile(config, (podfile) => {
    const { contents } = podfile.modResults;
    if (contents.includes(MARKER)) return podfile;

    const eol = contents.includes("\r\n") ? "\r\n" : "\n";
    const block = (indent) =>
      [
        `${indent}  ${MARKER}`,
        `${indent}  installer.pods_project.targets.each do |target|`,
        `${indent}    target.build_configurations.each do |build_config|`,
        `${indent}      current = build_config.build_settings['IPHONEOS_DEPLOYMENT_TARGET']`,
        `${indent}      if current.nil? || Gem::Version.new(current) < Gem::Version.new('${minimum}')`,
        `${indent}        build_config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '${minimum}'`,
        `${indent}      end`,
        `${indent}    end`,
        `${indent}  end`,
        "",
      ].join(eol) + eol;

    podfile.modResults.contents = contents.replace(
      /^([ \t]*)post_install do \|installer\|\r?\n/m,
      (match, indent) => match + block(indent)
    );
    return podfile;
  });
};
