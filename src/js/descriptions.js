import { dots, settings } from "./settings";

const dotDescriptions = Array.from(document.getElementsByClassName('dot'));

Array.from(document.getElementsByClassName('dot__title')).forEach(element => {
  element.addEventListener('click', () => {
    showDescription(parseInt(element.dataset['index']));
  });

  element.addEventListener('mouseenter', () => {
    const index = parseInt(element.dataset['index']);
    dots[index].sphereMaterial.color.set(settings.colors.dotHover);
    dots[index].meshMaterial.color.set(settings.colors.elementHover);
  });

  element.addEventListener('mouseleave', () => {
    const index = parseInt(element.dataset['index']);
    dots[index].sphereMaterial.color.set(settings.colors.dot);
    if (!dots[index].isActive) dots[index].meshMaterial.color.set(settings.colors.bg);
  });
});

let dotTimeout;
function showDescription(index) {
  dots[index].isActive = true;
  dots[index].meshMaterial.color.set(settings.colors.elementActive);

  const descElement = dotDescriptions[index].getElementsByClassName('dot__description')[0];
  descElement.style.height = descElement.scrollHeight + 'px';
  dotTimeout = setTimeout(() => descElement.style.height = 'auto', 300);

  for (let i = 0; i < dotDescriptions.length; i++) {
    if (i === index) continue;
    hideDescription(i);
  }
}

function hideDescription(index) {
  dots[index].isActive = false;
  dots[index].meshMaterial.color.set(settings.colors.bg);

  const descElement = dotDescriptions[index].getElementsByClassName('dot__description')[0];
  descElement.style.height = descElement.scrollHeight + 'px';
  clearTimeout(dotTimeout);
  setTimeout(() => descElement.style.height = 0, 0);
}

function dotMouseOver(dot) {
  dot.sphereMaterial.color.set(settings.colors.dotHover);
  dot.meshMaterial.color.set(settings.colors.elementHover);
  settings.container.classList.add('hovered');

  const titleElement = dotDescriptions[dot.index].getElementsByClassName('dot__title')[0];
  titleElement.classList.add('hovered');
}

function dotMouseOut(dot) {
  dot.sphereMaterial.color.set(settings.colors.dot);
  if (!dot.isActive) dot.meshMaterial.color.set(settings.colors.bg);
  settings.container.classList.remove('hovered');

  const titleElement = dotDescriptions[dot.index].getElementsByClassName('dot__title')[0];
  titleElement.classList.remove('hovered');
}

function dotClick(dot) {
  if (dot.isActive) hideDescription(dot.index);
  else showDescription(dot.index);
}

export {
  showDescription,
  hideDescription,
  dotMouseOver,
  dotMouseOut,
  dotClick,
};
