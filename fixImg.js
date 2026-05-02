import fs from 'fs';

let content = fs.readFileSync('./src/data/charactersData.js', 'utf8');

content = content.replace(/"image":\s*"\/images\/portraits\/portrait_bajirao_i.png"/g, '"image": null');
content = content.replace(/"image":\s*"\/images\/portraits\/portrait_nana_saheb.png"/g, '"image": null');
content = content.replace(/"image":\s*"\/images\/portraits\/portrait_maulana_azad.png"/g, '"image": null');

fs.writeFileSync('./src/data/charactersData.js', content);
console.log('Fixed missing images.');
