const fs = require("fs");
const path = require("path");

// Function to fix unescaped entities in a file
function fixEntities(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");

    // Replace unescaped apostrophes with &apos; but not in JSX attributes or code
    content = content.replace(/(\>[^<]*)'([^<]*\<)/g, "$1&apos;$2");

    // Replace unescaped quotes with &quot; but not in JSX attributes or code
    content = content.replace(/(\>[^<]*)"([^<]*\<)/g, "$1&quot;$2");

    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Fixed entities in: ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Files to fix based on the build errors
const filesToFix = [
  "src/components/About.tsx",
  "src/components/CoreChallenge.tsx",
  "src/components/CoreFeatures.tsx",
  "src/components/Impact.tsx",
  "src/components/SmartNotificationFlow.tsx",
];

filesToFix.forEach((file) => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    fixEntities(fullPath);
  } else {
    console.log(`File not found: ${fullPath}`);
  }
});

console.log("Entity fixing complete!");
