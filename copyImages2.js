import fs from 'fs';

const files = [
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/avatar_student_1774840369385.png', 'public/images/avatars/student.png'],
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/avatar_narrator_1774840352526.png', 'public/images/avatars/narrator.png'],
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/quiz_cupid_1774840470975.png', 'public/images/quiz/quiz_cupid.png'],
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/quiz_midas_1774840485656.png', 'public/images/quiz/quiz_midas.png'],
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/quiz_landscape_1774840499120.png', 'public/images/quiz/quiz_landscape.png'],
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/quiz_staff_1774840512196.png', 'public/images/quiz/quiz_staff.png'],
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/quiz_lightning_1774840567430.png', 'public/images/quiz/quiz_lightning.png'],
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/quiz_teaching_1774840584018.png', 'public/images/quiz/quiz_teaching.png'],
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/quiz_constellation_1774840597778.png', 'public/images/quiz/quiz_constellation.png'],
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/quiz_oath_1774840612063.png', 'public/images/quiz/quiz_oath.png'],
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/pwa_icon_1774840382871.png', 'public/pwa-192x192.png'],
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/pwa_icon_1774840382871.png', 'public/pwa-512x512.png'],
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/pwa_icon_1774840382871.png', 'public/apple-touch-icon-180x180.png']
];

try {
  fs.mkdirSync('public/images/avatars', { recursive: true });
  fs.mkdirSync('public/images/quiz', { recursive: true });

  files.forEach(([src, dest]) => {
    fs.copyFileSync(src, dest);
    console.log(`Copied: ${dest}`);
  });
  console.log('Successfully copied all missing middle images!');
} catch (err) {
  console.error(err);
}
