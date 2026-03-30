import fs from 'fs';

const files = [
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/card_apollo_1774838654461.png', 'public/images/cards/apollo.png'],
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/card_cupid_1774838842728.png', 'public/images/cards/cupid.png'],
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/card_daphne_1774838859205.png', 'public/images/cards/daphne.png'],
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/card_midas_1774838875440.png', 'public/images/cards/midas.png'],
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/card_asclepius_1774838484640.png', 'public/images/cards/asclepius.png'],
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/card_chiron_1774839108203.png', 'public/images/cards/chiron.png'],
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/card_hades_1774839124772.png', 'public/images/cards/hades.png'],
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/card_coronis_1774839138888.png', 'public/images/cards/coronis.png'],
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/card_hippocrates_1774839379584.png', 'public/images/cards/hippocrates.png'],
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/card_pan_1774839394346.png', 'public/images/cards/pan.png'],
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/card_ophiuchus_1774839408472.png', 'public/images/cards/ophiuchus.png'],
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/boss_zeus_1774838447964.png', 'public/images/cards/zeus.png'],
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/boss_zeus_1774838447964.png', 'public/images/ui/boss_zeus.png'],
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/title_screen_temple_1774838400299.png', 'public/images/ui/title_screen.png'],
  ['/Users/ny/.gemini/antigravity/brain/b3b3cfd4-2b82-4120-a149-15413a1acaa2/map_background_1774838431210.png', 'public/images/ui/map_background.png']
];

try {
  fs.mkdirSync('public/images/cards', { recursive: true });
  fs.mkdirSync('public/images/ui', { recursive: true });

  files.forEach(([src, dest]) => {
    fs.copyFileSync(src, dest);
    console.log(`Copied: ${dest}`);
  });
  console.log('Successfully copied ALL missing original cards and UI images!');
} catch (err) {
  console.error(err);
}
