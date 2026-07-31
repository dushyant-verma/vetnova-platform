const fs = require('fs');
const filePath = 'client/src/pages/ApplyNow.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// The backticks were escaped as \` in the file.
// We need to replace \` with `
content = content.replace(/\\`/g, '`');

fs.writeFileSync(filePath, content);

const programDetailsPath = 'client/src/pages/ProgramDetails.tsx';
let pdContent = fs.readFileSync(programDetailsPath, 'utf8');
pdContent = pdContent.replace(/\\`/g, '`');
fs.writeFileSync(programDetailsPath, pdContent);
