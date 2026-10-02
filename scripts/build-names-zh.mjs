// Builds public/models/names-zh.json (lowercase English name → Simplified Chinese).
// Edit scripts/i18n/*.tsv, then run: node scripts/build-names-zh.mjs
import {readFileSync,writeFileSync} from 'node:fs';
const root=new URL('../',import.meta.url);
const read=path=>readFileSync(new URL(path,root),'utf8');
const tsv=path=>new Map(read(path).split('\n').filter(Boolean).map(line=>line.split('\t')));
const base=tsv('scripts/i18n/anatomy-base-zh.tsv'),multi=tsv('scripts/i18n/anatomy-multi-zh.tsv');
const atlas=JSON.parse(read('public/models/atlas.json'));

// In a translation, "*" marks where 左/右 goes; without it the side is prefixed.
const placeSide=(english,chinese)=>{
 if(/\bhepatic artery\b/.test(english)&&!/common hepatic|hepatic artery proper/.test(english))return chinese.replace('肝动脉','肝*动脉');
 if(/\bhepatic vein\b/.test(english)&&!/middle hepatic/.test(english))return chinese.replace('肝静脉','肝*静脉');
 if(english==='hepatic duct')return '肝*管';
 if(/^gastric (artery|vein)$/.test(english))return chinese.replace('胃','胃*');
 if(/gastro-?epiploic/.test(english))return chinese.replace('胃网膜','胃网膜*');
 if(english==='caudate lobe branch of portal vein')return '门静脉*支尾状叶支';
 if(english==='subdivision of hepatic portal vein')return '肝门静脉*支分部';
 return chinese;
};
// Everyday names for whole organs read better than the terse textbook forms.
const everyday={'heart':'心脏','liver':'肝脏','spleen':'脾脏','pancreas':'胰腺','left kidney':'左肾','right kidney':'右肾','left lung':'左肺','right lung':'右肺'};

const names={};
for(const concept of atlas.concepts){
 const english=concept.name.toLowerCase();
 if(everyday[english]){names[english]=everyday[english];continue;}
 if(multi.has(english)){names[english]=multi.get(english);continue;}
 const side=english.match(/\b(left|right)\b/)?.[1];
 const key=english.replace(/\b(left|right)\b ?/,'').replace(/ +/g,' ').trim();
 if(!base.has(key))throw new Error(`No translation for "${key}"`);
 const chinese=placeSide(key,base.get(key)),mark=side==='left'?'左':side==='right'?'右':'';
 names[english]=chinese.includes('*')?chinese.replace('*',mark):mark+chinese;
}
for(const part of atlas.parts)if(!names[part.name.toLowerCase()])throw new Error(`No translation for part "${part.name}"`);
writeFileSync(new URL('public/models/names-zh.json',root),JSON.stringify(names));
console.log(`Wrote ${Object.keys(names).length} Chinese anatomy names.`);
