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
    } else if (stat.isFile() && (f.endsWith('.js') || f.endsWith('.cjs') || f.endsWith('.mjs') || f.endsWith('.ts'))) {
      let content = '';
      try {
        content = fs.readFileSync(fullPath, 'utf8');
      } catch (e) { continue; }
      
      const m = content.match(/.{0,50}\.fetch\s*=[^=].{0,50}/g);
      if (m) {
        let isMatch = false;
        for (const match of m) {
          if (match.includes('window.fetch') || match.includes('self.fetch') || match.includes('globalThis.fetch') || match.includes('global.fetch')) {
            isMatch = true;
          }
        }
        if (isMatch || /window\.fetch\s*=/.test(content) || /self\.fetch\s*=/.test(content)) {
          console.log("Found in:", fullPath);
          console.log(m);
        }
      }
    }
  }
}

search('.');
