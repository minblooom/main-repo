// src/features/community/data/communityData.js
// Joinable spaces (groups, circles, identity) and informational resources.

export const groups = [
  {
    id: 'stress-and-balance',
    type: 'group',
    title: 'Finding Balance',
    description: 'Share everyday ways to manage stress and make room to recharge.',
    memberCount: 128,
    joined: false,
  },
  {
    id: 'small-wins',
    type: 'group',
    title: 'Small Wins',
    description: 'Celebrate progress, including the little things.',
    memberCount: 94,
    joined: false,
  },
];

export const circles = [
  {
    id: 'reflection-session',
    type: 'circle',
    title: 'Reflection Session',
    description: 'Think back on your week with a gentle prompt.',
    expect: 'Take turns reflecting on one prompt. Share as much or as little as you like.',
    dateLabel: 'Wednesdays',
    timeLabel: '6:00 PM',
    duration: 'About 45 minutes',
    availability: '3 spots left',
    joined: false,
  },
  {
    id: 'listening-session',
    type: 'circle',
    title: 'Listening Session',
    description: 'Come to listen and hear others share.',
    expect: 'Settle in and listen. You don’t need to speak, and anything you share is optional.',
    dateLabel: 'Fridays',
    timeLabel: '7:00 PM',
    duration: 'About 45 minutes',
    availability: '5 spots left',
    joined: false,
  },
  {
    id: 'sharing-at-your-pace',
    type: 'circle',
    title: 'Sharing at Your Own Pace',
    description: 'Share when you feel ready, and pass whenever you need to.',
    expect: 'No one is asked to speak. Each person decides what, if anything, to share.',
    dateLabel: 'Sundays',
    timeLabel: '10:00 AM',
    duration: 'About 60 minutes',
    availability: 'Open spots',
    joined: false,
  },
];

export const identitySpaces = [
  {
    id: 'new-to-the-city',
    type: 'identity',
    title: 'New to the City',
    description: 'Connect with others navigating a new place and new routines.',
    memberCount: 52,
    hasMeetupSpots: true,
    joined: false,
  },
  {
    id: 'language-and-culture',
    type: 'identity',
    title: 'Language & culture',
    description: 'Connect through shared language or cultural experiences.',
    joined: false,
  },
  {
    id: 'lgbtq-community',
    type: 'identity',
    title: 'LGBTQ+ community',
    description: 'A peer space for connection, support and sharing, at your own pace.',
    privateMembership: true,
    joined: false,
  },
  {
    id: 'life-stages',
    type: 'identity',
    title: 'Life stages',
    description: 'Find peers navigating similar seasons of life.',
    joined: false,
  },
];

export const communitySpaces = [...groups, ...circles, ...identitySpaces];