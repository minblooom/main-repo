// src/features/community/data/meetingSpots.js
// Source: venues found via bestkenya.ke (Westlands cafés), each confirmed directly.
export const MEETING_SPOTS = [
  {
    id: 'spot-cafe-kaya',
    name: 'Cafe Kaya',
    category: 'Café', // Café | Restaurant | Bakery | Library | Community space
    area: 'Westlands',
    address: '2nd Floor, Viking House, Westlands, Nairobi, Kenya',
    latitude: -1.2676,
    longitude: 36.8108,
    contact: '+254 704 440440',
    groupFriendly: true, // confirmed they host small groups
    wholeDayRequests: true, // confirmed they accept whole-day group bookings
    notes: 'A casual café and restaurant in Viking House, with indoor and outdoor seating.',
    verified: true,
    lastChecked: '2026-11-20',
  },
  {
    id: 'spot-mode-cafe',
    name: 'Mode Cafe',
    category: 'Café', // Café | Restaurant | Bakery | Library | Community space
    area: 'Kilimani',
    address: 'Kirichwa Road, Kilimani, Nairobi, 00100, Kenya',
    latitude: -1.297155,
    longitude: 36.781981,
    contact: '+254 769 563589',
    groupFriendly: true, // confirmed they host small groups
    wholeDayRequests: true, // confirmed they accept whole-day group bookings
    notes: 'Café in Kilimani serving breakfast, brunch, coffee, and other meals; indoor and outdoor seating is listed.',
    verified: true,
    lastChecked: '2026-11-20',
  },
];

export const verifiedSpots = MEETING_SPOTS.filter((s) => s.verified === true);
export const NAIROBI_CENTRE = { latitude: -1.2921, longitude: 36.8219 };