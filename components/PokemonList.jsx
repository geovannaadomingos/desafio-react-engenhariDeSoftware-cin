import { useState, useEffect } from 'react'
import axios from 'axios'
import './PokemonList.css'

const PokemonList = () => {
  const [pokemonList, setPokemonList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const limitPerPage = 20

  const getPokemonData = async (page) => {
    try {
      const offset = (page - 1) * limitPerPage
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/?limit=${limitPerPage}&offset=${offset}`
      )
      const { results } = response.data
      const names = results.map((pokemon) => pokemon.name)

      return names
    } catch (error) {
      throw new Error('Falha ao buscar a lista de Pokémon')
    }
  }

  const handleScroll = () => {
    const isAtBottom =
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight

    if (isAtBottom && !loading) {
      setCurrentPage((prevPage) => prevPage + 1)
      setLoading(true)
    }
  }

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const names = await getPokemonData(1)
        setPokemonList(names)
        setLoading(false)
      } catch (error) {
        setError(error.message)
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  useEffect(() => {
    const loadMoreData = async () => {
      try {
        const names = await getPokemonData(currentPage)
        setPokemonList((prevList) => [...prevList, ...names])
        setLoading(false)
      } catch (error) {
        setError(error.message)
        setLoading(false)
      }
    }

    if (currentPage > 1) {
      loadMoreData()
    }
  }, [currentPage])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [loading])

  return (
    <div>
      <h4>Lista dos 20 primeiros Pokemons:</h4>
      <ul>
        {pokemonList.map((name, index) => (
          <li key={name}>
            {name}
            {index === pokemonList.length - 1 && loading && <span> (Carregando...)</span>}
          </li>
        ))}
      </ul>
      {error && <p>{error}</p>}
    </div>
  )
}

export default PokemonList