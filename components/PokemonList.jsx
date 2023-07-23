import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PokemonList.css';

const PokemonList = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const limitPerPage = 20;

  const fetchPokemonData = async (page) => {
    try {
      const offset = (page - 1) * limitPerPage;
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/?limit=${limitPerPage}&offset=${offset}`
      );
      const { results } = response.data;
      const names = results.map((pokemon) => pokemon.name);

      return names;
    } catch (error) {
      console.error('Error fetching Pokémon list:', error);
      throw new Error('Falha ao buscar a lista de Pokémon');
    }
  };

  // Function to fetch more data when the user scrolls to the bottom of the list
  const handleScroll = () => {
    const isAtBottom =
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight;

    if (isAtBottom && !loading) {
      // Increase the current page to load more data
      setCurrentPage((prevPage) => prevPage + 1);
      setLoading(true);
    }
  };

  useEffect(() => {
    // Fetch initial data only when the component mounts
    const loadInitialData = async () => {
      try {
        const names = await fetchPokemonData(1);
        setPokemonList(names);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    loadInitialData();
  }, []); // Empty dependency array to ensure this runs only once when the component mounts

  useEffect(() => {
    // Fetch more data when the current page changes
    const loadMoreData = async () => {
      try {
        const names = await fetchPokemonData(currentPage);
        setPokemonList((prevList) => [...prevList, ...names]);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    if (currentPage > 1) {
      loadMoreData();
    }
  }, [currentPage]);

  // Add scroll event listener when the component mounts
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading]); // Add 'loading' as a dependency to avoid redundant listeners

  return (
    <div>
      <h4>Lista dos 20 primeiros Pokemons:</h4>
      <ul>
        {pokemonList.map((name, index) => (
          <li key={name}>
            {name}
            {index === pokemonList.length - 1 && loading && <span> (Loading more...)</span>}
          </li>
        ))}
      </ul>
      {error && <p>{error}</p>}
    </div>
  );
};

export default PokemonList;