// Figma get_design_context output (saved JSON) -> static HTML + scoped CSS.
// Usage: node figma_to_html.mjs <saved.json> <name> <scopeClass>
// Env:   CONV_DIR (workdir with node_modules: esbuild react react-dom tailwindcss@3 postcss heroicons), CONV_OUT, CONV_LOGO (svg for imgGroup)
// Setup: mkdir $CONV_DIR && cd $CONV_DIR && npm i esbuild react react-dom tailwindcss@3.4.17 postcss heroicons@2.2.0, then COPY THIS FILE INTO $CONV_DIR (ESM imports resolve next to the script) and run it from there.
// Font is forced to Manrope here: search "Manrope" below and change it for another project.
import fs from "fs";
import path from "path";
import { createRequire } from "module";
import * as esbuild from "esbuild";
import postcss from "postcss";
import tailwind from "tailwindcss";
const require = createRequire(import.meta.url);

const [,, jsonPath, name, scope] = process.argv;
const raw = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
let code = raw.map((x) => x.text || "").find((t) => /export default function/.test(t));
if (!code) { console.error("no code"); process.exit(1); }

const ROOT = process.env.CONV_DIR || "/tmp/conv";
const OUT = process.env.CONV_OUT || `${ROOT}/out`;
const HI = `${ROOT}/node_modules/heroicons`;
const LOGO = process.env.CONV_LOGO && fs.existsSync(process.env.CONV_LOGO) ? fs.readFileSync(process.env.CONV_LOGO, "utf8") : "";
const kebab = (s) => s.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/(\d)([A-Z])/g, "$1-$2").replace(/([A-Z])(\d)/g, "$1-$2").toLowerCase();
const unknown = [];
const idx = {};
for (const dir of ["24/outline", "24/solid", "20/solid"]) for (const f of fs.readdirSync(`${HI}/${dir}`)) {
  const k = f.replace(/\.svg$/, "").replace(/-/g, "");
  if (!idx[k]) idx[k] = `${HI}/${dir}/${f}`;
}
function iconFor(n) {
  {
    let m = n.replace(/^img/, "").replace(/^Icons?/, "").toLowerCase();
    const alias = { squares2x2: "squares2x2", squares2x3: "squares2x2", officebuilding: "buildingoffice", securitycheckshieldcheck: "shieldcheck", securitycheckxmark: "xmark", securitycheckexclamationcircle: "exclamationcircle", currencyruble: "banknotes", clipboarddocumentchecked: "clipboarddocumentcheck", scalebalanced: "scale", clockcounterclockwise: "clock", arrowsarrowtoprightonsquare: "arrowtoprightonsquare", arrowsarrowtrendingup: "arrowtrendingup", chevronupdown: "chevronupdown", right: "magnifyingglass", papereclip: "paperclip" };
    if (!idx[m] && !(m in alias)) m = m.replace(/\d+$/, "");
    const key = alias[m] || m;
    if (idx[key] && !/^(group)$/.test(m)) return fs.readFileSync(idx[key], "utf8").replace(/currentColor/g, "#2b2b2b");
  }
  if (/^imgGroup$/.test(n)) return LOGO;
  let m = n.replace(/^img/, "").replace(/\d+$/, "");
  m = m.replace(/^Icons?/, "");
  const cands = [];
  const k = kebab(m).replace("squares-2-x-2", "squares-2x2").replace("squares-2-x-3", "squares-2x2").replace("office-building", "building-office").replace("security-check-shield-check", "shield-check").replace("security-check-exclamation-circle", "exclamation-circle").replace("currency-ruble", "banknotes").replace("right", "magnifying-glass");
  cands.push(k);
  if (/Chevron|Direction/i.test(n)) cands.push("chevron-down");
  for (const c of cands) for (const dir of ["24/outline", "24/solid", "20/solid"]) {
    const f = `${HI}/${dir}/${c}.svg`;
    if (fs.existsSync(f)) return fs.readFileSync(f, "utf8").replace(/currentColor/g, "#2b2b2b");
  }
  unknown.push(n);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><desc>${n}</desc></svg>`;
}
code = code.replace(/const (img\w*) = "https:[^"]+";/g, (_, n) => {
  const svg = iconFor(n);
  return `const ${n} = ${JSON.stringify("data:image/svg+xml;base64," + Buffer.from(svg).toString("base64"))};`;
});
code = code.replace(/\\\//g, "/");
function repair(c) {
  // cut at last line ending with ">" then close open tags
  const body = c.slice(c.indexOf("export default function"));
  const head = c.slice(0, c.indexOf("export default function"));
  let b = body;
  const ok = (t) => { const o = (t.match(/<[A-Za-z][^<>]*?[^\/]>/g) || []).length; return true; };
  const lines = b.split("\n");
  while (lines.length && !/>\s*$/.test(lines[lines.length - 1])) lines.pop();
  b = lines.join("\n");
  const stack = [];
  const re = /<(\/?)([A-Za-z][A-Za-z0-9]*)([^<>]*?)(\/?)>/g;
  let m;
  while ((m = re.exec(b))) {
    if (m[4] === "/") continue;
    if (m[1]) { if (stack.length && stack[stack.length - 1] === m[2]) stack.pop(); }
    else if (!/^(img|br|hr|input)$/.test(m[2])) stack.push(m[2]);
  }
  // body is: export default function X() { return ( <div ...>  -- close tags, then ); }
  return head + b + "\n" + stack.reverse().map((t) => `</${t}>`).join("") + "\n);\n}\n";
}
let ok0 = true;
try { await esbuild.transform("import React from 'react';" + code, { loader: "tsx" }); } catch { ok0 = false; }
if (!ok0) { code = repair(code); console.error("repaired truncated code"); }
const dir = `${ROOT}/work-${name}`;
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(`${dir}/comp.tsx`, `import React from "react";\n${code}`);
fs.writeFileSync(`${dir}/entry.tsx`, `import React from "react";import {renderToStaticMarkup} from "react-dom/server";import C from "./comp";import fs from "fs";fs.writeFileSync("${dir}/out.html", renderToStaticMarkup(<C/>));`);
await esbuild.build({ entryPoints: [`${dir}/entry.tsx`], bundle: true, platform: "node", outfile: `${dir}/entry.cjs`, jsx: "transform", external: ["fs"], nodePaths: [`${ROOT}/node_modules`], logLevel: "error" });
require(`${dir}/entry.cjs`);
let html = fs.readFileSync(`${dir}/out.html`, "utf8");
html = html.replace(/ data-node-id="[^"]*"/g, "").replace(/ data-name="[^"]*"/g, "");

const css = await postcss([tailwind({
  content: [{ raw: html, extension: "html" }],
  important: `.${scope}`,
  corePlugins: { preflight: false },
  theme: { extend: {} },
})]).process("@tailwind utilities;", { from: undefined });
let out = css.css;
// resolve var(--x, fallback) to fallback
for (let i = 0; i < 6; i++) out = out.replace(/var\(--[^,()]+,\s*((?:[^()]|\([^()]*\))*)\)/g, "$1");
out = out.replace(/font-family:\s*[^;]*Manrope[^;]*;/g, "font-family: 'Manrope Variable','Manrope',sans-serif;");
const reset = `.${scope} *,.${scope} *::before,.${scope} *::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e5e5}
.${scope} h1,.${scope} h2,.${scope} h3,.${scope} h4,.${scope} p,.${scope} ul,.${scope} ol{margin:0;padding:0}
.${scope}{font-family:'Manrope Variable','Manrope',sans-serif;-webkit-font-smoothing:antialiased;background:#fff;color:#2b2b2b;text-align:left;position:relative}
.${scope} svg,.${scope} img{display:block;flex-shrink:0;max-width:none}
.${scope} button{font:inherit;color:inherit;background:none;border:0;padding:0;text-align:inherit}
`;
fs.writeFileSync(`${OUT}/${name}.html`, `<div class="${scope}">${html}</div>`);
fs.writeFileSync(`${OUT}/${name}.css`, reset + out);
console.log(name, "html", html.length, "css", out.length, "unknown icons:", [...new Set(unknown)].join(","));
