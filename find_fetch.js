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
    } else if (stat.isFile() && f.endsWith('.js')) {
      let content = '';
      try {
        content = fs.readFileSync(fullPath, 'utf8');
      } catch (e) { continue; }
      
      if (content.includes('window.fetch =') || content.includes('self.fetch =') || content.includes('global.fetch =')) {
        console.log("Found in:", fullPath);
      }
    }
  }
}

search('./node_modules');
