import fs from 'fs';
import path from 'path';

function search(dir) {
  let files;
  try {
    files = fs.readdirSync(dir);
  } catch (e) { return; }
  
  for (const f of files) {
    const fullPath = path.join(dir, f);
    let stat;
    try { stat = fs.statSync(fullPath); } catch (e) { continue; }
    
    if (stat.isDirectory()) {
      if (f === '.bin') continue;
      search(fullPath);
    } else if (stat.isFile() && (f.endsWith('.js') || f.endsWith('.cjs') || f.endsWith('.mjs'))) {
      let content = '';
      try {
        content = fs.readFileSync(fullPath, 'utf8');
      } catch (e) { continue; }
      
      const m = content.match(/.{0,20}\.fetch\s*=[^=].{0,20}/g);
      if (m) {
        console.log("Found in:", fullPath);
        console.log(m);
      }
    }
  }
}

console.log("Searching dist:");
search('./dist');
