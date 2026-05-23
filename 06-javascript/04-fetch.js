const pokemonColors = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#ea7ce8',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

const loader = document.querySelector('.loader');
const container = document.querySelector('.pokemon-container');
const searchBox = document.querySelector('.search-box');

let allPokemons = [];

const createCard = (pokemon) => {
  const card = document.createElement('div');
  card.classList.add('pokemon-card');

  const name = document.createElement('h2');
  name.textContent = pokemon.name;

  const img = document.createElement('img');
  img.src = pokemon.sprites.other['official-artwork'].front_default;
  img.alt = pokemon.name;

  const typeBadges = document.createElement('div');
  typeBadges.classList.add('type-badges');

  pokemon.types.forEach(({ type }) => {
    const badge = document.createElement('span');
    badge.classList.add('type-badge');
    badge.textContent = type.name;
    badge.style.backgroundColor = pokemonColors[type.name] || '#777';
    typeBadges.appendChild(badge);
  });

  card.appendChild(name);
  card.appendChild(img);
  card.appendChild(typeBadges);
  return card;
};

const renderPokemons = (pokemons) => {
  container.innerHTML = '';
  if (pokemons.length === 0) {
    const msg = document.createElement('p');
    msg.classList.add('no-results');
    msg.textContent = 'No Pokémon matched your search.';
    container.appendChild(msg);
    return;
  }
  pokemons.forEach(p => container.appendChild(createCard(p)));
};

const fetchPokemons = async () => {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=25');
  const data = await res.json();
  const details = await Promise.all(
    data.results.map(p => fetch(p.url).then(r => r.json()))
  );
  allPokemons = details;
  loader.style.display = 'none';
  renderPokemons(allPokemons);
};

searchBox.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = allPokemons.filter(p =>
    p.name.includes(query) ||
    p.types.some(({ type }) => type.name.includes(query))
  );
  renderPokemons(filtered);
});

fetchPokemons();