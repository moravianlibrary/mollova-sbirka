#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function usage() {
  console.error(
    'Usage: node scripts/generate-nginx-redirects.js <input-file> <output-file>'
  );
  process.exit(1);
}

const inputFile = process.argv[2];
const outputFile = process.argv[3];

if (!inputFile || !outputFile) {
  usage();
}

function extractPath(urlString, lineNumber, fieldName) {
  const trimmed = (urlString || '').trim();

  if (!trimmed) {
    return '';
  }

  try {
    return new URL(trimmed).pathname;
  } catch (err) {
    console.error(
      `[WARN] Line ${lineNumber}: invalid ${fieldName} URL: ${trimmed}`
    );
    return null;
  }
}

function normalizePath(p) {
  if (!p) return p;

  let result = p.trim();

  if (!result.startsWith('/')) {
    result = `/${result}`;
  }

  return result;
}

const raw = fs.readFileSync(inputFile, 'utf8');
const lines = raw.split(/\r?\n/);

const outputLines = [];
let skippedEmptyTarget = 0;
let skippedInvalid = 0;
let duplicateCount = 0;

const seenSources = new Map();

for (let i = 0; i < lines.length; i++) {
  const lineNumber = i + 1;
  const line = lines[i].trim();

  if (!line) {
    continue;
  }

  if (i === 0) {
    // header: df_856.u;pid
    continue;
  }

  const separatorIndex = line.indexOf(';');

  if (separatorIndex === -1) {
    console.error(`[WARN] Line ${lineNumber}: missing ";" separator: ${line}`);
    skippedInvalid++;
    continue;
  }

  const leftRaw = line.slice(0, separatorIndex);
  const rightRaw = line.slice(separatorIndex + 1);

  const sourcePath = normalizePath(extractPath(leftRaw, lineNumber, 'source'));

  if (sourcePath == null || !sourcePath) {
    console.error(
      `[WARN] Line ${lineNumber}: source path is empty or invalid, skipping`
    );
    skippedInvalid++;
    continue;
  }

  if (!rightRaw.trim()) {
    console.error(
      `[WARN] Line ${lineNumber}: target URL is empty for source ${sourcePath}`
    );
    skippedEmptyTarget++;
    continue;
  }

  const targetPath = normalizePath(extractPath(rightRaw, lineNumber, 'target'));

  if (targetPath == null || !targetPath) {
    console.error(
      `[WARN] Line ${lineNumber}: target path is empty or invalid for source ${sourcePath}`
    );
    skippedInvalid++;
    continue;
  }

  if (seenSources.has(sourcePath)) {
    const previousTarget = seenSources.get(sourcePath);

    if (previousTarget !== targetPath) {
      console.error(
        `[WARN] Line ${lineNumber}: duplicate source ${sourcePath}, overwriting target ${previousTarget} -> ${targetPath}`
      );
    } else {
      console.error(
        `[INFO] Line ${lineNumber}: duplicate source ${sourcePath} with same target, keeping one entry`
      );
    }

    duplicateCount++;
  }

  seenSources.set(sourcePath, targetPath);
}

for (const [sourcePath, targetPath] of seenSources.entries()) {
  outputLines.push(`${sourcePath} ${targetPath};`);
}

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, outputLines.join('\n') + '\n', 'utf8');

console.error(
  `[DONE] Generated ${outputLines.length} redirects into ${outputFile}`
);
console.error(`[DONE] Skipped empty targets: ${skippedEmptyTarget}`);
console.error(`[DONE] Skipped invalid rows: ${skippedInvalid}`);
console.error(`[DONE] Duplicate sources: ${duplicateCount}`);