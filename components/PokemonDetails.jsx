import React, { useState } from 'react';
import axios from 'axios';
import './PokemonDetails.css';

const PokemonDetails = () => {
  const [pokemonNumber, setPokemonNumber] = useState('');
  const [pokemonName, setPokemonName] = useState('');
  const [pokemonType, setPokemonType] = useState('');
  const [pokemonSprite, setPokemonSprite] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const fetchPokemonDetails = async () => {
    setLoading(true);
    setShowDetails(false);
    setError('');

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(2000);

    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}/`);
      const { name, types, sprites } = response.data;
      setPokemonName(name);

      if (types && types.length > 0) {
        setPokemonType(types[0].type.name);
      } else {
        setPokemonType('Unknown Type');
      }

      setLoading(false);
      setShowDetails(true);
      setPokemonSprite(sprites.front_default); // Assuming you want the front default sprite.
    } catch (error) {
      console.error('Error fetching Pokémon details:', error);
      setError('Pokémon não encontrado');
      setPokemonName('');
      setPokemonType('');
      setPokemonSprite('');
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    setPokemonNumber(event.target.value);
  };

  const handleRefresh = () => {
    setError('');
    setLoading(false);
    setShowDetails(false);
  };

  return (
    <div>
      {showDetails ? (
        <>
          <p>Nome do Pokémon: {pokemonName}</p>
          <p>Tipo do Pokémon: {pokemonType}</p>
          {pokemonSprite &&
            <div class="div-img"><img src={pokemonSprite} alt={pokemonName} /></div>
          }
          <button onClick={handleRefresh}>Atualizar</button>
        </>
      ) : (
        <>
          <input
            type="number"
            placeholder="Digite o número do Pokémon"
            value={pokemonNumber}
            onChange={handleInputChange}
          />
          <button onClick={fetchPokemonDetails}>Atualizar</button>
        </>
      )}
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default PokemonDetails;