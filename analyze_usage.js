const fs = require('fs');
const path = require('path');

function getFiles(dir, extension) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getFiles(file, extension));
        } else {
            if (file.endsWith(extension)) {
                results.push(file);
            }
        }
    });
    return results;
}

const componentFolders = ['components', 'app/components'];
const appFolder = 'app';

const componentFiles = [];
componentFolders.forEach(folder => {
    if (fs.existsSync(folder)) {
        componentFiles.push(...getFiles(folder, '.tsx'));
    }
});

const appFiles = getFiles(appFolder, '.tsx');

const results = [];

componentFiles.forEach(compPath => {
    const name = path.basename(compPath, '.tsx');
    const usageFiles = appFiles.filter(file => {
        if (file === compPath) return false;
        const content = fs.readFileSync(file, 'utf8');
        // Simple check for <Name
        return content.includes('<' + name);
    });

    if (usageFiles.length === 1) {
        results.push({
            component: path.resolve(compPath),
            usage: path.resolve(usageFiles[0])
        });
    }
});

console.log(JSON.stringify(results, null, 2));
