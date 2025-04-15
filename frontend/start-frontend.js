const { exec } = require("child_process");

const child = exec("npx next dev --hostname 0.0.0.0 --port 4444");

child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);
