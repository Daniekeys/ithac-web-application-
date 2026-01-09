const fs = require('fs');
const path = 'src/api/latest-postman-collection.json';

const content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('"name": "Register"')) {
        console.log(`Found "name": "Register" at line ${i + 1}`);
        // look ahead for URL
        for(let j=i; j<i+50; j++) {
            if(lines[j] && lines[j].includes('"url": {')) {
                 console.log(`URL start at ${j+1}`);
                 // print next few lines
                 console.log(lines.slice(j, j+10).join('\n'));
                 break;
            }
        }
    }
}
