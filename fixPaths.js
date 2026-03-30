import fs from 'fs';

const files = [
  "src/data/questions.js",
  "src/App.jsx",
  "src/components/CardGallery.jsx",
  "src/components/CardReveal.jsx",
  "src/components/ChatStory.jsx",
  "src/components/SugorokuMap.jsx",
  "src/components/quiz/BossBattle.jsx",
  "src/components/quiz/MatchingQuiz.jsx"
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  // Prepend /cotomia/ to all /images/ absolute paths
  content = content.replace(/"\/images\//g, '"/cotomia/images/');
  content = content.replace(/url\(\/images\//g, 'url(/cotomia/images/');
  // For template literals
  content = content.replace(/`\/images\//g, '`/cotomia/images/');
  
  fs.writeFileSync(f, content);
  console.log(`Fixed paths in ${f}`);
});
