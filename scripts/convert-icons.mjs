import sharp from 'sharp';
import { readFileSync } from 'fs';

const logo = readFileSync('./public/zik4u-logo-512.svg');

await sharp(logo).resize(512, 512).png().toFile('./public/icon-512.png');
await sharp(logo).resize(192, 192).png().toFile('./public/icon-192.png');
await sharp(logo).resize(180, 180).png().toFile('./public/apple-touch-icon.png');
await sharp(logo).resize(32, 32).png().toFile('./public/favicon-32.png');

console.log('✅ Toutes les icônes générées');
