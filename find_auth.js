const fs = require('fs');
const path = 'src/api/latest-postman-collection.json';

const content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

const keywords = ['"name": "Register"', '"name": "Login"', '"name": "Verify Email"', '"name": "Onboard A User"', '"name": "Reset Password"', '"name": "Request For OTP"'];

keywords.forEach(keyword => {
    console.log(`Searching for ${keyword}...`);
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(keyword)) {
            console.log(`Found ${keyword} at line ${i + 1}`);
        }
    }
});
