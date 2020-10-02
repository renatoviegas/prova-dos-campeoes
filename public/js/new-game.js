const name = document.getElementById('name');
const hability = document.getElementById('hability');
const energy = document.getElementById('energy');
const luck = document.getElementById('luck');
const points = document.getElementById('points');

const maxPoints = 30;
let totalPoints = 0;

const pointsLeft = () => maxPoints - totalPoints;

const hero = {
  name: 'Hero',
  hability: 9,
  energy: 18,
  luck: 9,
};

const init = () => {
  disableInputNumbers();
  calculatePoints();
  setValuesHtml();
  refresh();
};

const disableInputNumbers = () => {
  const disableKeyPress = (event) => event.preventDefault();
  const blurNumber = (event) => {
    if (event.target.value === '') {
      event.target.value = event.target.min;
      event.target.focus();
      changeAttribute();
    }
  };

  const inputNumbers = document.querySelectorAll("input[type='number']");

  inputNumbers.forEach((input) => {
    input.addEventListener('keypress', disableKeyPress);
    input.addEventListener('blur', blurNumber);
  });
};

const changeAttribute = () => {
  setValuesHero();
  calculatePoints();
  refresh();
};

const setValuesHtml = () => {
  name.value = hero.name;
  hability.value = hero.hability;
  energy.value = hero.energy;
  luck.value = hero.luck;

  setMinMaxValue(hability, 8, 12);
  setMinMaxValue(energy, 16, 24);
  setMinMaxValue(luck, 8, 12);
};

const setMinMaxValue = (el, min, max) => {
  el.setAttribute('min', min);
  el.setAttribute('max', max);
};

const setValuesHero = () => {
  hero.name = name.value;
  hero.hability = +hability.value;
  hero.energy = +energy.value;
  hero.luck = +luck.value;
};

const calculatePoints = () => {
  totalPoints = hero.hability + hero.luck + hero.energy / 2;
};

const refresh = () => {
  points.textContent = pointsLeft();
};

initGame = () => {
  if (!validateValues()) return;
  saveHero();
  window.location.href = '0.html';
};

const validateValues = () => {
  if (pointsLeft() < 0) {
    showErrors('Ultrapassou o total de pontos permitidos');
    return false;
  }

  if (pointsLeft() > 0) {
    showErrors('Existem pontos a distribuir');
    return false;
  }

  return true;
};

const showErrors = (message) => {
  alert(message);
};

const saveHero = () => {
  hero.name = hero.name || 'Hero';
  hero.initialHability = hero.hability;
  hero.initialEnergy = hero.energy;
  hero.initialLuck = hero.luck;
  hero.equipments = [];
  hero.items = [];
  hero.facts = {};
  hero.notes = [];
  hero.currentStep = 0;
  hero.enemyLive = 0;
  
  localStorage.setItem('hero', JSON.stringify(hero));
  /*
      const data = await fetch('./data/game.json');
    hero = await data.json();
    hero.currentStep = 1;
    saveHero();
  */
}

init();
