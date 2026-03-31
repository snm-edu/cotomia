const fs = require('fs');
const pdf = require('pdf-parse');
let dataBuffer = fs.readFileSync('pre_dokkai2.pdf');
pdf(dataBuffer).then(function(data) {
  fs.writeFileSync('pdf_text.txt', data.text);
  console.log('Done parsing pre_dokkai2.pdf');
});
let dataBuffer2 = fs.readFileSync('pre_dokkai_kaitou.pdf');
pdf(dataBuffer2).then(function(data) {
  fs.writeFileSync('pdf_kaitou.txt', data.text);
  console.log('Done parsing pre_dokkai_kaitou.pdf');
});
