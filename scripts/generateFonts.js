import fs from "fs";
import path from "path";
import ttf2woff from "ttf2woff";
import ttf2woff2 from "ttf2woff2";

const fontsDir = path.resolve("src/fonts");

if (!fs.existsSync(fontsDir)) fs.mkdirSync(fontsDir, { recursive: true });

fs.readdirSync(fontsDir).forEach((file) => {
  if (path.extname(file) === ".ttf") {
    const inputPath = path.join(fontsDir, file);
    const baseName = path.basename(file, ".ttf");

    const fontBuffer = fs.readFileSync(inputPath);

    const woffPath = path.join(fontsDir, `${baseName}.woff`);
    const woff2Path = path.join(fontsDir, `${baseName}.woff2`);

    if (!fs.existsSync(woffPath)) {
      const woffBuffer = ttf2woff(fontBuffer);
      fs.writeFileSync(woffPath, woffBuffer);
      console.log(`Generated ${woffPath}`);
    }

    if (!fs.existsSync(woff2Path)) {
      const woff2Buffer = ttf2woff2(fontBuffer);
      fs.writeFileSync(woff2Path, woff2Buffer);
      console.log(`Generated ${woff2Path}`);
    }
  }
});
