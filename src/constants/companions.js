// src/constants/companions.js
// Canonical companions for MindBloom onboarding & companion features

export const COMPANIONS = [
  {
    id: 'noodle',
    name: 'Noodle',
    species: 'Sloth',
    trait: 'Calm & steady',
    swTrait: 'Tulivu na imara',
    quote: '"There’s no timeline for figuring life out."',
    author: 'Noodle · here for the small steps',
    image: require('../../assets/images/sloth.jpg'),
    cutoutImage: require('../../assets/images/sloth_cutout.png'),
    accent: '#E8DEFF',
  },
  {
    id: 'kiko',
    name: 'Kiko',
    species: 'Red Panda',
    trait: 'Curious & bright',
    swTrait: 'Mdadisi na angavu',
    quote: '"Small, curious steps count just as much."',
    author: 'Kiko · your pocket of courage',
    image: require('../../assets/images/fox.jpg'),
    cutoutImage: require('../../assets/images/fox_cutout.png'),
    accent: '#FFE8D6',
  },
  {
    id: 'kovu',
    name: 'Kovu',
    species: 'Lion',
    trait: 'Brave & warm',
    swTrait: 'Jasiri na mwenye upendo',
    quote: '"You don’t have to roar to be brave."',
    author: 'Kovu · gentle courage with you',
    image: require('../../assets/images/lion.jpg'),
    cutoutImage: require('../../assets/images/lion_cutout.png'),
    accent: '#FFF3D6',
  },
  {
    id: 'taz',
    name: 'Taz',
    species: 'Turtle',
    trait: 'Wise & grounded',
    swTrait: 'Mwenye hekima na utulivu',
    quote: '"Go slowly. Peace is never a race."',
    author: 'Taz · wise and unhurried',
    image: require('../../assets/images/turtle.jpg'),
    cutoutImage: require('../../assets/images/turtle_cutout.png'),
    accent: '#D6EFDE',
  },
];

export const COMPANION_MAP = COMPANIONS.reduce((acc, companion) => {
  acc[companion.id] = companion;
  return acc;
}, {});
