// src/constants/companions.js
// Canonical companions for MindBloom onboarding & companion features

export const COMPANIONS = [
  {
    id: 'noodle',
    name: 'Noodle',
    species: 'Sloth',
    trait: 'Calm & steady',
    swTrait: 'Tulivu na imara',
    image: require('../../assets/images/sloth.jpg'),
    accent: '#E8DEFF',
  },
  {
    id: 'kiko',
    name: 'Kiko',
    species: 'Red Panda',
    trait: 'Curious & bright',
    swTrait: 'Mdadisi na angavu',
    image: require('../../assets/images/fox.jpg'),
    accent: '#FFE8D6',
  },
  {
    id: 'kovu',
    name: 'Kovu',
    species: 'Lion',
    trait: 'Brave & warm',
    swTrait: 'Jasiri na mwenye upendo',
    image: require('../../assets/images/lion.jpg'),
    accent: '#FFF3D6',
  },
  {
    id: 'taz',
    name: 'Taz',
    species: 'Turtle',
    trait: 'Wise & grounded',
    swTrait: 'Mwenye hekima na utulivu',
    image: require('../../assets/images/turtle.jpg'),
    accent: '#D6EFDE',
  },
];

export const COMPANION_MAP = COMPANIONS.reduce((acc, companion) => {
  acc[companion.id] = companion;
  return acc;
}, {});
