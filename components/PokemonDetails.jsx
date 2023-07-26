import { useState } from 'react'
import axios from 'axios'
import './PokemonDetails.css'

const PokemonDetails = () => {
  const [pokemonId, setPokemonId] = useState('')
  const [pokemonName, setPokemonName] = useState('')
  const [pokemonType, setPokemonType] = useState('')
  const [pokemonImage, setPokemonImage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const getPokemonDetails = async () => {
    setLoading(true)
    setShowDetails(false)
    setError('')

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
    await delay(2000)

    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`)
      const { name, types, sprites } = response.data
      setPokemonName(name)
      setPokemonImage(sprites.front_default)

      if (types && types.length > 0) {
        setPokemonType(types[0].type.name)
      } else {
        setPokemonType('Tipo desconhecido')
      }

      setLoading(false)
      setShowDetails(true)
    } catch (error) {
      setError('Não foi possível encontrar o Pokémon')
      setPokemonName('')
      setPokemonType('')
      setPokemonImage('')
      setLoading(false)
    }
  }

  const handleInputChange = (event) => {
    setPokemonId(event.target.value)
  }

  const handleRefresh = () => {
    setError('')
    setLoading(false)
    setShowDetails(false)
  }

  return (
    <div>
      {showDetails ?
        <>
          <p>Nome do Pokémon: {pokemonName}</p>
          <p>Tipo do Pokémon: {pokemonType}</p>
          {pokemonImage &&
            <div class="div-img"><img src={pokemonImage} alt={pokemonName} /></div>
          }
          <button onClick={handleRefresh}>Atualizar</button>
        </>
        :
        <>
          <input
            type="number"
            placeholder="Digite o número do Pokémon"
            value={pokemonId}
            onChange={handleInputChange}
          />
          <button onClick={getPokemonDetails}>Atualizar</button>
        </>
      }
      {loading && <p>Carregando...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}

export default PokemonDetails