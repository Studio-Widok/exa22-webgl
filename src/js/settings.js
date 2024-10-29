const dots = [
  {
    position: {
      x: -0.75,
      y: 0.63,
      z: -0.2,
    },
    elements: ['dot_1'],
  },
  {
    position: {
      x: 0.65,
      y: 0.32,
      z: -0.25,
    },
    elements: ['dot_2'],
  },
  {
    position: {
      x: 0.15,
      y: 0.17,
      z: -0.2,
    },
    elements: ['dot_3'],
  },
  {
    position: {
      x: -0.2,
      y: 0.12,
      z: -0.05,
    },
    elements: ['dot_4'],
  },
];

for (let i = 0; i < dots.length; i++) dots[i].index = i;

const settings = {
  viewAspect: 4 / 3,
  scale: 1.1,
  container: document.getElementById('model'),
  minEdgeAngle: 12,
  dotSize: 0.03,
  colors: {
    bg: 0x000000,
    line: 0xffffff,
    dot: 0xffdd00,
    dotHover: 0xee3300,
    elementHover: 0x444444,
    elementActive: 0x333333,
  },
};

export {
  dots,
  settings,
};
