const dots = [
  {
    position: {
      x: 0.15,
      y: -0.2,
      z: 0.25,
    },
    elements: ['obj001'],
    label: 'elektronika i oprogramowanie',
  },
  {
    position: {
      x: -0.8,
      y: -0.05,
      z: -0.65,
    },
    elements: ['obj003'],
    label: 'interfejs użytkownika',
  },
  {
    position: {
      x: 0.43,
      y: -0.05,
      z: 0.23,
    },
    elements: ['obj004'],
    label: 'automatyka',
  },
  {
    position: {
      x: 0.03,
      y: -0.11,
      z: -0.17,
    },
    elements: ['obj006'],
    label: 'projektowanie maszyn',
  },
  {
    position: {
      x: 0.85,
      y: -0.24,
      z: 0.16,
    },
    elements: ['obj007'],
    label: 'certyfikacja CE',
  },
];

for (let i = 0; i < dots.length; i++) dots[i].index = i;

const settings = {
  viewAspect: 5 / 4,
  scale: 1,
  autoRotateInterval: 3500,
  container: document.getElementById('model'),
  minEdgeAngle: 12,
  dotSize: 0.03,
  colors: {
    bg: 0x000000,
    line: 0xffffff,
    dot: 0xe3e21f,
    dotHover: 0xee3300,
    elementHover: 0x444444,
    elementActive: 0x666666,
  },
};

export {
  dots,
  settings,
};
