export const HORSE_NAMES: string[] = [
  'Thunder Bolt',
  'Silver Storm',
  'Golden Flash',
  'Midnight Star',
  'Wild Spirit',
  'Royal Crown',
  'Swift Arrow',
  'Fire Dance',
  'Moon Shadow',
  'Desert Wind',
  'Ocean Wave',
  'Mountain Peak',
  'Lucky Charm',
  'Iron Will',
  'Brave Heart',
  'Dream Catcher',
  'Storm Rider',
  'Phoenix Rise',
  'Diamond Dust',
  'Velvet Thunder'
];

export const HORSE_COLORS: string[] = [
  '#E74C3C',
  '#3498DB',
  '#2ECC71',
  '#F39C12',
  '#9B59B6',
  '#1ABC9C',
  '#E91E63',
  '#00BCD4',
  '#FF5722',
  '#795548',
  '#607D8B',
  '#8BC34A',
  '#FFEB3B',
  '#673AB7',
  '#FF9800',
  '#4CAF50',
  '#03A9F4',
  '#F44336',
  '#009688',
  '#CDDC39'
];

export const ANIMATION_CONFIG = {
  BASE_SPEED: 50,
  FRAME_INTERVAL: 50,
  TRACK_WIDTH_PERCENT: 85,
  CONDITION_SPEED_FACTOR: 0.5,
  RANDOM_SPEED_FACTOR: 0.3
};

export const RACE_CONFIG = {
  TOTAL_HORSES: 20,
  HORSES_PER_ROUND: 10,
  TOTAL_ROUNDS: 6,
  MIN_CONDITION: 1,
  MAX_CONDITION: 100
};

export const ROUND_DISTANCES: Record<number, number> = {
  1: 1200,
  2: 1400,
  3: 1600,
  4: 1800,
  5: 2000,
  6: 2200
};
