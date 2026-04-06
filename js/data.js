/* ============================================================
   PORTFOLIO CONFIG
   ============================================================ */
const BASE = 'https://raw.githubusercontent.com/zerolxi/Tanawat.S/main/images';

const CONFIG = {
  owner: {
    name:      'Tanawat Sonpum',
    role:      'Graphic Designer',
    subrole:   '10 Years Experience · Bangkok, TH',
    tagline:   'Always learning. Always making.',
    email:     'tanawat00@outlook.com',
    instagram: 'https://instagram.com/zerol_xi',
    line:      'https://line.me/ti/p/~darkzero000',
    phone:     '095-934-4239',
  },
  about: {
    quote: 'I listen,\nlearn, and\n<em>continuously improve.</em>',
    bio: 'A Graphic Designer with over 10 years of experience in the agency industry, specializing in advertising and social media content. I bring strong expertise in crafting engaging and effective visual communication across campaigns.',
    skills: [
      'Photoshop', 'Illustrator',
      'After Effects', 'Premiere Pro',
      'CapCut', 'AI Tools',
    ],
  },
};

/* ============================================================
   HELPERS
   ============================================================ */
function img(prefix, n, ext = 'jpg') {
  return { name: `${prefix}-${String(n).padStart(2,'0')}.${ext}`, type: 'image' };
}
function vid(prefix, n) {
  return { name: `${prefix}-${String(n).padStart(2,'0')}.mp4`, type: 'video' };
}

/* ============================================================
   BRANDS DATA — 14 brands
   ============================================================ */
const BRANDS = [

  /* 01 ─ Samsung */
  {
    id: 'samsung', name: 'Samsung', folder: '01-samsung',
    cover: 'samsung-01.jpg',
    tags: ['Social Media', 'Key Visual', 'Print Ads'],
    year: '2024',
    description: 'A 4-year collaboration with Samsung Thailand, covering social media content, key visuals, banners, and print ads across the Galaxy A Series, Tab, Watch, Buds, and home appliance lines. Responsible for translating product launches into clear, on-brand visuals that perform across digital and print channels — building an extensive content library over the years.',
    youtubeIds: [],
    files: [
      ...Array.from({length:44}, (_,i) => img('samsung', i+1))
    ]
  },

  /* 02 ─ SCB */
  {
    id: 'scb', name: 'SCB', folder: '02-scb',
    cover: 'scb-01.jpg',
    tags: ['Infographic', 'Social Media', 'Digital'],
    year: '2024',
    description: 'Social media infographic design for SCB Next Tech, a knowledge-sharing page covering AI trends, marketing insights, productivity tips, and personal finance. Focused on transforming complex topics into clear, visually engaging content for a broad digital audience.',
    youtubeIds: [],
    files: [
      ...Array.from({length:11}, (_,i) => img('scb', i+1))
    ]
  },

  /* 03 ─ Art DNA */
  {
    id: 'art-dna', name: 'ART DNA', folder: '03-art-dna',
    cover: 'art-dna-01.jpg',
    tags: ['Social Media', 'Art Direction', 'Video'],
    year: '2024',
    description: 'Social media content for ART DNA, a premium smart switch brand. Created product-focused posts showcasing switch models, features, and interior styling — helping audiences visualize how each design fits different room aesthetics. Extended into video content showcasing the switches in real interior settings.',
    youtubeIds: ['9kOEvi64FRw', '5JGEXnMi5YA'],
    files: [
      img('art-dna',1), img('art-dna',2), img('art-dna',3), img('art-dna',4),
      img('art-dna',5), img('art-dna',6), img('art-dna',7), img('art-dna',8)
    ]
  },

  /* 04 ─ Energea */
  {
    id: 'energea', name: 'Energea', folder: '04-energea',
    cover: 'energea-09.jpg',
    tags: ['Social Media', 'Lifestyle', 'Minimal'],
    year: '2024',
    description: 'Product promotion for Energea, a charging accessories brand. Created lifestyle-driven visuals that integrate the products into everyday moments — keeping the aesthetic clean, minimal, and aspirational.',
    youtubeIds: ['TyR8JMLm2h4'],
    files: [
      ...Array.from({length:19}, (_,i) => img('energea', i+1))
    ]
  },

  /* 05 ─ JLab */
  {
    id: 'jlab', name: 'JLAB', folder: '05-jlab',
    cover: 'jlab-01.jpg',
    tags: ['Social Media', 'Product Content', 'Digital'],
    year: '2024',
    description: 'Social media content for JLAB, a headphone and audio accessories brand. Designed product-focused posts highlighting features and pricing across the product lineup — making technical specs feel accessible and engaging for everyday consumers.',
    youtubeIds: [],
    files: [
      ...Array.from({length:12}, (_,i) => img('jlab', i+1))
    ]
  },

  /* 06 ─ Wuling */
  {
    id: 'wuling', name: 'Wuling', folder: '06-wuling',
    cover: 'wuling-01.jpg',
    tags: ['Social Media', 'Automotive', 'Digital'],
    year: '2024',
    description: "Social media content for Wuling Motors Thailand, created during the brand's market entry in Thailand. Produced promotional visuals for the Binguo and Air EV models — introducing the brand to Thai consumers and communicating the appeal of accessible electric vehicles.",
    youtubeIds: [],
    files: [
      ...Array.from({length:10}, (_,i) => img('wuling', i+1))
    ]
  },

  /* 07 ─ Muse */
  {
    id: 'muse', name: 'Muse', folder: '07-muse',
    cover: 'muse-01.jpg',
    tags: ['Social Media', 'Motion Graphics', 'Art Direction'],
    year: '2024',
    description: "Social media content for Muse, a real-fruit ice cream brand. Created flavor-driven visuals and seasonal lifestyle posts — pairing each flavor with the right season to inspire cravings at the perfect moment. Extended into motion graphics to bring the brand's playful, fresh character to life on social media.",
    youtubeIds: ['Z6VjFy-y1s4','2ZlFGuLPwwg','VVuMOr10f_8','T4mloB-NW48','L48KlahQTzo','odk6Krc1RGc','KAVcaxwbgyU','zX1d8LaQM8c','CrXUrt-aJ1Q','kt3UEOmhxfM','dY9ZKdGAsnU','khHKX_xuooc','nn3V8ZZtnfU','k0M6k6YaKN4'],
    files: [
      ...Array.from({length:16}, (_,i) => img('muse', i+1))
    ]
  },

  /* 08 ─ Super Coffee */
  {
    id: 'super-coffee', name: 'Super Coffee', folder: '08-super-coffee',
    cover: 'super-coffee-01.jpg',
    tags: ['Social Media', 'Motion Graphics', 'Product Content'],
    year: '2024',
    description: "Social media content for Super Coffee in its early days, targeting blue-collar workers who need a reliable energy boost. Created flavor-focused visuals across the ready-to-drink can and 3-in-1 sachet lines — building brand awareness from the ground up for a new market entry.",
    youtubeIds: ['S-QYfLaJCO0', 'TF2o5aTxMOM'],
    files: [
      img('super-coffee',1), img('super-coffee',2), img('super-coffee',3), img('super-coffee',4),
      img('super-coffee',5,'gif'), img('super-coffee',6,'gif'),
      img('super-coffee',7), img('super-coffee',8), img('super-coffee',9), img('super-coffee',10),
      img('super-coffee',11), img('super-coffee',12), img('super-coffee',13), img('super-coffee',14),
      img('super-coffee',15), img('super-coffee',16), img('super-coffee',17), img('super-coffee',18),
      img('super-coffee',19), img('super-coffee',20), img('super-coffee',21), img('super-coffee',22),
      img('super-coffee',23,'gif'), img('super-coffee',24),
      img('super-coffee',25,'gif'),
      img('super-coffee',26), img('super-coffee',27),
      img('super-coffee',28,'gif'),
      img('super-coffee',29), img('super-coffee',30,'png'), img('super-coffee',31)
    ]
  },

  /* 09 ─ KAMYN */
  {
    id: 'kamyn', name: 'KAMYN', folder: '09-kamyn',
    cover: 'kamyn-02.jpg',
    tags: ['Social Media', 'Health & Wellness', 'Digital'],
    year: '2024',
    description: 'Social media content for KAMYN, a health supplement brand. Designed product posts communicating the benefits of the Turmeric Shot line — from health benefits to daily usage — alongside monthly promotional campaigns to drive sales and engagement.',
    youtubeIds: [],
    files: [
      img('kamyn',1), img('kamyn',2)
    ]
  },

  /* 10 ─ BSC Jeans */
  {
    id: 'bsc-jeans', name: 'BSC Jeans', folder: '10-bsc-jeans',
    cover: 'bsc-jeans-33.jpg',
    tags: ['Social Media', 'Cosmetics', 'Digital'],
    year: '2024',
    description: 'Social media content for BSC Jeans, a cosmetics brand. Designed promotional posts across the product lineup — incorporating denim fabric as a recurring visual gimmick that ties every piece of content together and makes the brand instantly recognizable.',
    youtubeIds: [],
    files: [
      img('bsc-jeans',1,'png'),
      ...Array.from({length:17}, (_,i) => img('bsc-jeans', i+2)),
      img('bsc-jeans',19,'gif'),
      ...Array.from({length:25}, (_,i) => img('bsc-jeans', i+20)),
      img('bsc-jeans',45,'gif'), img('bsc-jeans',46,'png')
    ]
  },

  /* 11 ─ BSC Pananda */
  {
    id: 'bsc-pananda', name: 'BSC Pananda', folder: '11-bsc-pananda',
    cover: 'bsc-pananda-01.jpg',
    tags: ['Social Media', 'Editorial', 'Premium'],
    year: '2024',
    description: 'Social media content for BSC Pananda, a premium cosmetics line targeting a more mature audience. Created editorial-style visuals that reflect a fashion magazine aesthetic — sophisticated, refined, and aspirational.',
    youtubeIds: [],
    files: [
      img('bsc-pananda',1),
      img('bsc-pananda',2,'gif'), img('bsc-pananda',3,'png'),
      img('bsc-pananda',4,'gif'), img('bsc-pananda',5,'png'), img('bsc-pananda',6,'png'),
      img('bsc-pananda',7), img('bsc-pananda',8), img('bsc-pananda',9), img('bsc-pananda',10),
      img('bsc-pananda',11), img('bsc-pananda',12), img('bsc-pananda',13), img('bsc-pananda',14),
      img('bsc-pananda',15,'png'),
      img('bsc-pananda',16), img('bsc-pananda',17), img('bsc-pananda',18), img('bsc-pananda',19),
      img('bsc-pananda',20), img('bsc-pananda',21), img('bsc-pananda',22), img('bsc-pananda',23),
      img('bsc-pananda',24), img('bsc-pananda',25,'png')
    ]
  },

  /* 12 ─ Anessa */
  {
    id: 'anessa', name: 'Anessa', folder: '12-anessa',
    cover: 'anessa-01.jpg',
    tags: ['Social Media', 'Skincare', 'Digital'],
    year: '2024',
    description: "Social media content for Anessa, promoting the brand's sunscreen product line. Created visuals that communicate sun protection benefits while maintaining the brand's clean and premium aesthetic across digital channels.",
    youtubeIds: [],
    files: [
      img('anessa',1), img('anessa',2), img('anessa',3), img('anessa',4)
    ]
  },

];
