window.addEventListener('load', () => console.log('Hero', hero));

const _ = null;
const actionAtack = document.getElementById('action-atack');
const actionAtackGroup = document.getElementById('countEnemy');
const actEndGame = document.getElementById('action-end-game');

const bonusFact = {
  hasFlogged: 3,
};

let hero;
let enemy;
let countEnemy;

const isCombat = () => !!actionAtack;
const isCombatGroup = () => !!actionAtackGroup;

const init = async () => {
  hero = await loadHero();

  disableActionById('action-continuar');
  actEndGame && createButtonEndGame();

  if (isCombat()) {
    enemy = {
      hability: +document.getElementById('enemyHability').textContent,
      energy: +document.getElementById('enemyEnergy').textContent,
    };

    refreshHero(hero);
  }

  if (isCombatGroup()) {
    refreshHero(hero);
    countEnemy =
      hero.enemyLive > 0
        ? hero.enemyLive
        : +document.getElementById('countEnemy').textContent;
    enableAtackNextEnemy();
  }

  _activateActionsItem();
  _showDivHero();
};

const loadHero = () => JSON.parse(localStorage.getItem('hero'));
const persistHero = () => localStorage.setItem('hero', JSON.stringify(hero));

const enableAtackNextEnemy = () => {
  const _actionsAtack = document.querySelectorAll('.alive');
  let ok = true;
  _actionsAtack.forEach((action) => {
    if (ok) {
      ok = false;
      action.classList.add('pulse');
      action.removeAttribute('disabled');
      return;
    }

    action.setAttribute('disabled', '');
  });
};

const dieEnemy = (e) => {
  energy = document.getElementsByName(e + '-energy')[0];
  action = document.getElementsByName(e + '-action')[0];
  energy.textContent = 0;
  action.textContent = '* morto *';
};

const go = (ref) => {
  hero.currentStep = ref;
  persistHero();
  window.location.href = `${ref}.html`;
};

const goRef = (currentStep) => {
  const inputRef = document.getElementById('input-ref');
  const ref = inputRef.value;
  if (ref === '') {
    alert('Informe a referência');
    return;
  }

  if (!_validateRef(currentStep, ref)) {
    alert('Resposta Errada');
    window.location.href = '72.html';
    return;
  }

  window.location.href = `${ref}.html`;
};

const _validateRef = (step, ref) => {
  const _step = parseInt(step);
  const _ref = parseInt(ref);
  if (_step === 352 && _ref !== 25) return false;
  return true;
};

const tiraEnergiaEAtualiza = (valor) => {
  decreaseEnergyHero(valor);
  heroIsDead() && _gameOver();
  refresh();
};

const tiraEnergia = (valor, ativaAcoes = true) => {
  console.log(`Energia(-${valor}): [${hero.energy}] >> [${hero.energy - valor}]`);
  decreaseEnergyHero(valor);

  if (heroIsDead()) {
    _gameOver();
    return;
  }

  ativaAcoes && ativaActions();
};

const tiraHabilidade = (valor) => {
  console.log(`Habilidade(-${valor}): [${hero.hability}] >> [${hero.hability - valor}]`);
  hero.hability -= valor;
};

const tiraSorte = (valor) => {
  console.log(`Sorte(-${valor}): [${hero.luck}] >> [${hero.luck - valor}]`);
  hero.luck -= valor;
};

const getElementByName = (name) => document.getElementsByName(name)[0];
const enableOptionByName = (name) =>
  getElementByName(name).removeAttribute('disabled');
const disableOptionByName = (name) =>
  getElementByName(name).setAttribute('disabled', '');

const enableActionById = (id) => {
  const action = document.getElementById(id);
  action && action.removeAttribute('disabled');
};

const disableActionById = (id) => {
  const action = document.getElementById(id);
  action && action.setAttribute('disabled', '');
};

const _gameOver = () => {
  const _hideActions = () => {
    const actions = document.querySelectorAll('a');
    actions.forEach((action) => action.classList.add('invisivel'));
  };

  _hideActions();

  const divAction = document.getElementById('div-actions');
  divAction.innerHTML = '';
  divAction.appendChild(createButtonGameOver());

  updateHeroStatus('Morto');
};

const ativaActions = () => {
  enableActionById('action-continuar');
  const actions = document.querySelectorAll('a');
  actions.forEach((action) => {
    if (action.hasAttribute('nomodify')) return;
    action.classList.remove('invisivel');
    action.removeAttribute('disabled');
  });
};

const recuperaEnergia = (valor) => {
  hero.energy += valor;
  if (hero.energy > hero.initialEnergy) hero.energy = hero.initialEnergy;
  refreshHero(hero);
  console.log('Energia +', valor);
};

const recuperaSorte = (valor) => {
  hero.luck += valor;
  if (hero.luck > hero.initialLuck) hero.luck = hero.initialLuck;
  console.log('Sorte +', valor);
};

const addHability = (valor) => {
  hero.hability += valor;
  console.log('Habilidade +', valor);
};

const _activateActionsItem = () => {
  const optDefault = document.getElementsByName('opt-default')[0];
  const actions = document.querySelectorAll('a[name*="opt"]');
  let ok = false;

  actions.forEach((action) => {
    const opt = action.name.substr(4);
    if (!hero.items.includes(opt) && !hero.equipments.includes(opt)) {
      action.setAttribute('disabled', '');
    } else {
      ok = true;
    }
  });

  if (!ok && optDefault) optDefault.removeAttribute('disabled');
};

const updateHeroStatus = (value) => {
  const divStatusHero = document.getElementById('status-hero');
  if (divStatusHero) divStatusHero.textContent = value;
};

const useItem = (item) => {
  const _index = hero.items.indexOf(item);
  if (_index === -1) {
    alert('Não possui este item');
    throw 'Não possui este item';
  }

  alert(`Você utilizou o [${item}]`);

  hero.items.splice(_index, 1);
};

const removeAllItems = () => {
  hero.items = [];
};

const addEquipment = (...equipments) => hero.equipments.push(...equipments);
const hasEquipment = (equipment) => hero.equipments.includes(equipment);

const addItem = (...items) => hero.items.push(...items);
const hasItem = (item) => hero.items.includes(item);
const addFact = (fact) => (hero.facts = { ...hero.facts, [fact]: true });
const addNote = (note) => hero.notes.push(note);

const heroIsDead = () => hero.energy <= 0;
const enemyIsDead = () => enemy.energy <= 0;
const isDead = () => enemyIsDead() || heroIsDead();
const getHabilityHero = () => hero.hability;

const atack = (damageHero, damageEnemy) => {
  if (isDead()) return;

  const enemyAtack = playDices(2) + enemy.hability;
  const heroAtack = playDices(2) + getHabilityHero();

  heroAtack > enemyAtack && decreaseEnergyEnemy(damageHero);
  heroAtack < enemyAtack && decreaseEnergyHero(damageEnemy);

  const result =
    heroAtack > enemyAtack ? 'hero' : heroAtack < enemyAtack ? 'enemy' : 'tie';

  console.log(
    'Hero atack:',
    heroAtack,
    'Enemy atack:',
    enemyAtack,
    'Result:',
    result
  );

  refresh();

  return result;
};

const decreaseEnergyHero = (value) => (hero.energy -= value || 2);
const decreaseEnergyEnemy = (value) => (enemy.energy -= value || 2);

let _heroHabilityElement,
  _heroEnergyElement,
  _heroLuckElement,
  _enemyEnergyElement = null;

const _loadElementsHero = () => {
  _heroHabilityElement =
    _heroHabilityElement || document.getElementById('heroHability');
  _heroEnergyElement =
    _heroEnergyElement || document.getElementById('heroEnergy');
  _heroLuckElement = _heroLuckElement || document.getElementById('heroLuck');
};

const _refreshHeroHabilityView = (value) =>
  (_heroHabilityElement.textContent = value);
const _refreshHeroEnergyView = (value) =>
  (_heroEnergyElement.textContent = value);
const _refreshHeroLuckView = (value) => (_heroLuckElement.textContent = value);

const refreshHero = (ahero) => {
  _loadElementsHero();
  _heroHabilityElement && _refreshHeroHabilityView(ahero.hability);
  _heroEnergyElement && _refreshHeroEnergyView(ahero.energy);
  _heroLuckElement && _refreshHeroLuckView(ahero.luck);
};

const _loadElementsEnemy = () =>
  (_enemyEnergyElement =
    _enemyEnergyElement || document.getElementById('enemyEnergy'));
const _refreshEnemyEnergyView = (value) =>
  (_enemyEnergyElement.textContent = value);

const refreshEnemy = (aEnemy) => {
  _loadElementsEnemy();
  _enemyEnergyElement && _refreshEnemyEnergyView(aEnemy.energy);
};

const refresh = () => {
  refreshHero(hero);
  refreshEnemy(enemy);

  if (!isDead()) return;

  disableAllAtackAction();
  enemyIsDead() && _updateEnemyStatus('Morto');
  heroIsDead() ? _gameOver() : ativaActions();
};

const _updateEnemyStatus = (value) => {
  const divStatusEnemy = document.getElementById('status-enemy');
  if (divStatusEnemy) divStatusEnemy.textContent = value;
};

const disableAtackAction = (action) => {
  action.classList.remove('pulse');
  action.classList.remove('red');
  action.classList.add('grey');
  action.removeAttribute('onclick');
};

const atackGroup = (e) => {
  hability = document.getElementsByName(e + '-hability')[0];
  energy = document.getElementsByName(e + '-energy')[0];
  action = document.getElementsByName(e + '-action')[0];

  enemy = {
    id: e,
    hability: +hability.textContent,
    energy: +energy.textContent,
  };

  const result = atack2(hero, enemy);

  energy.textContent = enemy.energy;

  if (enemy.energy <= 0) {
    action.textContent = '* morto *';
    countEnemy -= 1;
    actionAtackGroup.textContent = countEnemy;
    enableAtackNextEnemy();
  }

  if (countEnemy === 0) enableActionById('action-continuar');

  refreshHero(hero);
  heroIsDead() && _gameOver();
  return result;
};

const atack2 = (hero, enemy) => {
  if (isDead()) return;

  const damageHero = 2;
  const damageEnemy = 2;

  enemyPowerAtack = playDices(2) + enemy.hability;
  heroPowerAtack = playDices(2) + getHabilityHero();

  if (heroPowerAtack > enemyPowerAtack) {
    enemy.energy -= damageHero;
  }

  if (heroPowerAtack < enemyPowerAtack) {
    hero.energy -= damageEnemy;
  }

  console.log('Hero atack:', heroPowerAtack, 'Enemy atack:', enemyPowerAtack);

  return heroPowerAtack > enemyPowerAtack
    ? 'hero'
    : heroPowerAtack < enemyPowerAtack
    ? 'enemy'
    : 'tie';
};

const disableAllAtackAction = () => {
  const actionsAtack = document.querySelectorAll('.alive');
  actionsAtack.forEach((actionAtack) => {
    disableAtackAction(actionAtack);
  });
};

const _playDice = () => Math.floor(Math.random() * 6) + 1;

const playDices = (count = 1) => {
  if (!count || count == 0) return 0;
  const _value = _playDice();
  return _value + playDices(count - 1);
}

const _playAndShowDice = (element) => {
  const dadoD6 = document.getElementById(element);
  const _1d6 = _playDice();
  dadoD6.src = `/img/dado-face-${_1d6}.png`;
  return _1d6;
};

const playDiceRange = (...range) => {
  const _range = range.length === 0 ? [4] : range;
  const _1d6 = lancarDadoD6(1);

  let _opt = 1;
  for (let i = 0; i < _range.length; ++i) {
    if (_1d6 < _range[i]) break;
    _opt++;
  }

  const cardAction = document.querySelector('.card-action');
  cardAction.innerHTML = `Resultado foi [${_1d6}]`;

  enableOptionByName(`opt-${_opt}`);
};

const lancarDadoD6 = (count) => {
  if (count == 0) return 0;
  const _value = _playAndShowDice(`dadoD6-${count}`) + lancarDadoD6(count - 1);
  return _value;
};

const habilityTest = (dices, value, fact) => {
  const _getBonusBy = (fact) => {
    if (hero.facts[fact]) return bonusFact.hasFlogged;
    return 0;
  };

  const _dices = dices || 2;
  const _bonus = fact ? _getBonusBy(fact) : 0;
  const _hability = (value || getHabilityHero()) + _bonus;
  const _valueDices = lancarDadoD6(_dices);

  const isBigger = _valueDices > _hability;

  const _action = document.getElementById('action-testar-habilidade');
  _action.innerHTML = `Resultado [${_valueDices}] foi ${
    isBigger ? 'maior' : 'menor ou igual'
  } que a habilidade [${_hability}]`;

  enableOptionByName(isBigger ? 'opt-2' : 'opt-1');
};

const testarSorte = () => {
  const _valueDices = lancarDadoD6(2);

  const actionTestarSorte = document.getElementById('action-testar-sorte');
  actionTestarSorte.innerHTML = `Resultado [${_valueDices}] foi ${
    _valueDices <= hero.luck ? 'menor ou igual' : 'maior'
  } que a sorte [${hero.luck}]`;

  enableOptionByName(_valueDices <= hero.luck ? 'opt-1' : 'opt-2');
  hero.luck--;
};

const createButtonEndGame = () => {
  _createButton(actEndGame, false, false);
};

const createButtonGameOver = () => {
  const button = document.createElement('button');
  _createButton(button, false, true);
  return button;
};

const _createButton = (action, invisible, pulse) => {
  action.classList.add('btn', 'waves-effect', 'waves-light', 'red');

  if (pulse) action.classList.add('pulse');
  if (invisible) action.classList.add('invisivel');

  action.addEventListener('click', _exitGame);
  action.innerHTML = '<i class="material-icons left">cancel</i>Fim de jogo';
};

const lancar1D6DeduzirEnergia = () => {
  const dado1_D6 = document.getElementById('dadoD6-1');
  const _1d6 = _playDice();
  dado1_D6.src = `/img/dado-face-${_1d6}.png`;
  const cardAction = document.querySelector('.card-action');
  tiraEnergia(_1d6);
  cardAction.innerHTML = `Resultado foi [${_1d6}]`;
  console.log(`hero energy [${hero.energy + _1d6}] >> [${hero.energy}]`);
  !heroIsDead() && ativaActions();
};

const _exitGame = () => go('index');

const _showDivHero = () => {
  if (isCombat() || isCombatGroup()) return;

  ///const footer = document.get
};

init();
