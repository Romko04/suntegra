import fs from "fs";
import path from "path";

export default function fontFacePlugin() {
  return {
    name: "vite-plugin-fonts",
    transform() {
      const fontsDir = path.resolve("src/fonts");
      const cssFilePath = path.resolve("src/css/fonts.css");
      const fonts = fs.readdirSync(fontsDir);

      let cssContent = "";

      const weightMap = {
        thin: 100,
        extralight: 200,
        ultralight: 200,
        light: 300,
        regular: 400,
        normal: 400,
        medium: 500,
        semibold: 600,
        demibold: 600,
        bold: 700,
        extrabold: 800,
        ultrabold: 800,
        black: 900,
      };

      fonts.forEach((file) => {
        const extname = path.extname(file);
        if (extname === ".woff" || extname === ".woff2") {
          const fontName = path.basename(file, extname);
          const [baseFontName, weightPartRaw] = fontName.split("-");
          const weightPart = weightPartRaw?.toLowerCase() || "regular";
          const fontWeight = weightMap[weightPart] || 400;

          const fontPath = path.join("../fonts", file).replace(/\\/g, "/");
          const fontFormat = extname === ".woff" ? "woff" : "woff2";

          cssContent += `
@font-face {
  font-family: '${baseFontName}';
  src: url('${fontPath}') format('${fontFormat}');
  font-weight: ${fontWeight};
  font-style: normal;
}
`;
        }
      });

      if (cssContent) {
        fs.writeFileSync(cssFilePath, cssContent);
        console.log("Generated fonts CSS:", cssFilePath);
      }
    },
  };
}
