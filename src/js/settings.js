const dots = [
  {
    position: {
      x: 0.15,
      y: -0.2,
      z: 0.25,
    },
    elements: ['obj001'],
  },
  {
    position: {
      x: -0.8,
      y: -0.05,
      z: -0.65,
    },
    elements: ['obj003'],
  },
  {
    position: {
      x: 0.43,
      y: -0.05,
      z: 0.23,
    },
    elements: ['obj004'],
  },
  {
    position: {
      x: 0.03,
      y: -0.11,
      z: -0.17,
    },
    elements: ['obj006'],
  },
  {
    position: {
      x: 0.85,
      y: -0.24,
      z: 0.16,
    },
    elements: ['obj007'],
  },
];

for (let i = 0; i < dots.length; i++) dots[i].index = i;

const settings = {
  viewAspect: 5 / 4,
  scale: 1,
  container: document.getElementById('model'),
  minEdgeAngle: 12,
  dotSize: 0.03,
  colors: {
    bg: 0x000000,
    line: 0xffffff,
    dot: 0xffdd33,
    dotHover: 0xee3300,
    elementHover: 0x444444,
    elementActive: 0x666666,
  },
};

export {
  dots,
  settings,
};
