import sharp from "sharp";
import { mkdir } from "fs/promises";
import { resolve } from "path";

const SOURCE = resolve("public/brand/FCTC_CyberConnect_logo.png");
const OUT = resolve("public/icons");

async function main() {
  await mkdir(OUT, { recursive: true });

  const sizes = [
    { name: "icon-192.png", size: 192, maskable: false },
    { name: "icon-512.png", size: 512, maskable: false },
    { name: "icon-maskable-192.png", size: 192, maskable: true },
    { name: "icon-maskable-512.png", size: 512, maskable: true },
    { name: "apple-touch-icon.png", size: 180, maskable: false },
    { name: "favicon-32.png", size: 32, maskable: false },
    { name: "favicon-16.png", size: 16, maskable: false },
  ];

  for (const { name, size, maskable } of sizes) {
    const padding = maskable ? Math.floor(size * 0.1) : 0;
    const innerSize = size - padding * 2;

    await sharp(SOURCE)
      .resize(innerSize, innerSize, {
        fit: "contain",
        background: { r: 11, g: 29, b: 52, alpha: 1 },
      })
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 11, g: 29, b: 52, alpha: 1 },
      })
      .png()
      .toFile(`${OUT}/${name}`);

    console.log(
      `Generated ${name} (${size}×${size}${maskable ? ", maskable" : ""})`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
