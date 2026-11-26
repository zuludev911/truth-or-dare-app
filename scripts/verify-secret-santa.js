#!/usr/bin/env node
/**
 * Verifica el sorteo del amigo secreto (src/games/secretSanta.ts). El repo no
 * tiene corredor de pruebas, así que se transpila el módulo en memoria.
 *
 *   node scripts/verify-secret-santa.js
 */
const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const source = fs.readFileSync(path.join(__dirname, "../src/games/secretSanta.ts"), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
});
const moduleShim = { exports: {} };
new Function("module", "exports", outputText)(moduleShim, moduleShim.exports);
const { drawSecretSanta } = moduleShim.exports;

let failures = 0;
const check = (condition, message) => {
  if (!condition) {
    failures += 1;
    console.error(`FALLO: ${message}`);
  }
};

const names = (n) => Array.from({ length: n }, (_, i) => `P${i + 1}`);

function validate(draw, people, exclusions, label) {
  check(Array.isArray(draw), `${label}: debía haber sorteo`);
  if (!Array.isArray(draw)) return;
  const givers = new Set(draw.map((a) => a.giver));
  const receivers = new Set(draw.map((a) => a.receiver));
  check(draw.length === people.length, `${label}: cantidad de asignaciones`);
  check(givers.size === people.length && receivers.size === people.length, `${label}: cada uno da y recibe una vez`);
  check(draw.every((a) => a.giver !== a.receiver), `${label}: nadie se saca a sí mismo`);
  check(
    draw.every((a) => !exclusions.some(([g, r]) => g === a.giver && r === a.receiver)),
    `${label}: se respetan las exclusiones`
  );
}

// Sorteos aleatorios sin exclusiones, de 3 a 20 personas.
for (let n = 3; n <= 20; n++) {
  for (let i = 0; i < 300; i++) validate(drawSecretSanta(names(n)), names(n), [], `n=${n}`);
}

// Sin exclusiones el resultado es un solo ciclo (nadie se regala de ida y vuelta).
for (let i = 0; i < 300; i++) {
  const draw = drawSecretSanta(names(6));
  const receiverOf = Object.fromEntries(draw.map((a) => [a.giver, a.receiver]));
  check(draw.every((a) => receiverOf[a.receiver] !== a.giver), "sin exclusiones no hay parejas A<->B");
}

// Parejas que no se pueden tocar (simétricas).
const couples = [["P1", "P2"], ["P3", "P4"], ["P5", "P6"]];
const symmetric = couples.flatMap(([a, b]) => [[a, b], [b, a]]);
for (let i = 0; i < 500; i++) validate(drawSecretSanta(names(8), symmetric), names(8), symmetric, "parejas");

// Caso donde un solo ciclo no es posible pero sí hay solución: 4 personas, P1 solo puede darle a P2 y viceversa.
const forcedPair = [["P1", "P3"], ["P1", "P4"], ["P2", "P3"], ["P2", "P4"]];
const forced = drawSecretSanta(names(4), forcedPair);
validate(forced, names(4), forcedPair, "ciclos forzados");

// Imposibles: debe devolver null.
check(drawSecretSanta(names(2)) === null, "2 personas no alcanzan");
check(drawSecretSanta(["A", "A", "B"]) === null, "nombres repetidos");
const everyoneBlockedFromP1 = names(4)
  .filter((n) => n !== "P1")
  .map((n) => [n, "P1"]);
check(drawSecretSanta(names(4), everyoneBlockedFromP1.concat([["P1", "P1"]])) === null, "nadie puede darle a P1");
const allBlocked = names(3).flatMap((a) => names(3).map((b) => [a, b]));
check(drawSecretSanta(names(3), allBlocked) === null, "todo excluido");

if (failures) {
  console.error(`\n${failures} verificaciones fallaron.`);
  process.exit(1);
}
console.log("Sorteo del amigo secreto: todas las verificaciones pasaron.");
