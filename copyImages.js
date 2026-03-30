import fs from 'fs';
import path from 'path';

const files = [
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/effect_correct_1774841166136.png', 'public/images/ui/effect_correct.png'],
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/effect_incorrect_1774841179252.png', 'public/images/ui/effect_incorrect.png'],
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/step1_apollo_1774841194830.png', 'public/images/steps/step1.png'],
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/step2_asclepius_1774841208235.png', 'public/images/steps/step2.png'],
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/step3_hippocrates_1774841223001.png', 'public/images/steps/step3.png'],
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/step4_destiny_1774841237550.png', 'public/images/steps/step4.png'],
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/step5_zeus_1774841251145.png', 'public/images/steps/step5.png']
];

try {
  fs.mkdirSync('public/images/steps', { recursive: true });
  fs.mkdirSync('public/images/ui', { recursive: true });

  files.forEach(([src, dest]) => {
    fs.copyFileSync(src, dest);
    console.log(`Copied: ${dest}`);
  });
  console.log('All images copied successfully!');
} catch (err) {
  console.error('Error copying files:', err);
}
