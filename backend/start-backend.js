// start-backend.js
const { exec } = require('child_process');

exec('npm run dev', { cwd: __dirname }, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
