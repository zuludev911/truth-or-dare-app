#!/usr/bin/env node
/**
 * Sube la versión de la app en todos los archivos donde aparece.
 *
 *   node scripts/bump-version.js <patch|minor|major|x.y.z> [--keep-runtime]
 *
 * - versionCode de Android siempre sube en 1.
 * - El runtime de expo-updates sube junto con la versión, salvo con --keep-runtime
 *   (úsalo solo si el build nuevo NO cambia código nativo: así los updates OTA
 *   siguen llegando a la versión anterior y a la nueva).
 *
 * Proyecto bare: como android/ e ios/ están versionados, los valores nativos se
 * editan aquí directamente (Expo no los regenera).
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const target = args.find((arg) => !arg.startsWith("--"));
const keepRuntime = args.includes("--keep-runtime");

if (!target) {
  console.error("Uso: node scripts/bump-version.js <patch|minor|major|x.y.z> [--keep-runtime]");
  process.exit(1);
}

const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const write = (file, content) => fs.writeFileSync(path.join(root, file), content);

/** Reemplaza exactamente una coincidencia; si no hay o hay varias, falla. */
function replaceOnce(file, regex, replacement) {
  const content = read(file);
  const matches = content.match(new RegExp(regex.source, regex.flags.replace("g", "") + "g"));
  if (!matches || matches.length !== 1) {
    throw new Error(`${file}: se esperaba 1 coincidencia de ${regex}, hay ${matches ? matches.length : 0}`);
  }
  write(file, content.replace(regex, replacement));
}

const pkg = JSON.parse(read("package.json"));
const current = pkg.version;

function nextVersion(version, kind) {
  if (/^\d+\.\d+\.\d+$/.test(kind)) return kind;
  const [major, minor, patch] = version.split(".").map(Number);
  if (kind === "major") return `${major + 1}.0.0`;
  if (kind === "minor") return `${major}.${minor + 1}.0`;
  if (kind === "patch") return `${major}.${minor}.${patch + 1}`;
  throw new Error(`Tipo de versión inválido: ${kind}`);
}

const version = nextVersion(current, target);
const versionCodeMatch = read("app.config.js").match(/versionCode:\s*(\d+)/);
if (!versionCodeMatch) throw new Error("app.config.js: no se encontró versionCode");
const versionCode = Number(versionCodeMatch[1]) + 1;
const runtimeMatch = read("app.config.js").match(/runtimeVersion:\s*"([^"]+)"/);
if (!runtimeMatch) throw new Error("app.config.js: no se encontró runtimeVersion");
const runtime = keepRuntime ? runtimeMatch[1] : version;

replaceOnce("package.json", /"version":\s*"[^"]+"/, `"version": "${version}"`);
replaceOnce("app.config.js", /(\n\s*version:\s*)"[^"]+"/, `$1"${version}"`);
replaceOnce("app.config.js", /(versionCode:\s*)\d+/, `$1${versionCode}`);
replaceOnce("android/app/build.gradle", /(versionCode\s+)\d+/, `$1${versionCode}`);
replaceOnce("android/app/build.gradle", /(versionName\s+)"[^"]+"/, `$1"${version}"`);
replaceOnce(
  "ios/VerdadoReto/Info.plist",
  /(<key>CFBundleShortVersionString<\/key>\s*<string>)[^<]+/,
  `$1${version}`
);
if (!keepRuntime) {
  replaceOnce("app.config.js", /(runtimeVersion:\s*)"[^"]+"/, `$1"${runtime}"`);
  replaceOnce(
    "android/app/src/main/res/values/strings.xml",
    /(<string name="expo_runtime_version">)[^<]+/,
    `$1${runtime}`
  );
  replaceOnce(
    "ios/VerdadoReto/Supporting/Expo.plist",
    /(<key>EXUpdatesRuntimeVersion<\/key>\s*<string>)[^<]+/,
    `$1${runtime}`
  );
}

console.log(`Versión ${current} → ${version} | versionCode ${versionCode} | runtime ${runtime}`);

// En GitHub Actions deja los valores disponibles para los siguientes pasos.
if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(
    process.env.GITHUB_OUTPUT,
    `version=${version}\nversion_code=${versionCode}\nruntime=${runtime}\n`
  );
}
