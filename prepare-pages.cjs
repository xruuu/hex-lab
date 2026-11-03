const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'output/Hex-Lab-12ui.html'));
fs.mkdirSync(path.join(root,'dist'),{recursive:true});
for(const dest of ['index.html','dist/index.html'])fs.writeFileSync(path.join(root,dest),html);
fs.writeFileSync(path.join(root,'dist/.nojekyll'),'');
fs.copyFileSync(path.join(root,'build/Hex-Lab-logo.svg'),path.join(root,'dist/favicon.svg'));
console.log('GitHub Pages: dist/index.html preparado.');
