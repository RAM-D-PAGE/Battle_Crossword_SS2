const https = require('https');
const fs = require('fs');
const url = 'https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt';

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        const words = data.split(/\r?\n/)
            .map(w => w.trim().toLowerCase())
            .filter(w => w.length >= 2 && w.length <= 7 && /^[a-z]+$/.test(w));
        
        console.log('Total words found:', words.length);
        
        // Create a TypeScript Set export 
        const output = `// Auto-generated English word dictionary (2-7 letters)\n// Source: github.com/dwyl/english-words\nexport const WORD_SET: Set<string> = new Set(${JSON.stringify(words)});\n`;
        
        const outPath = './src/core/data/Dictionary.ts';
        fs.writeFileSync(outPath, output);
        console.log('Written to Dictionary.ts, size:', (output.length / 1024).toFixed(0), 'KB');
    });
}).on('error', (err) => {
    console.error('Download failed:', err.message);
    process.exit(1);
});
