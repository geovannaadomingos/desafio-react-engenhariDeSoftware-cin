import PokemonDetails from '../components/PokemonDetails'
import PokemonList from '../components/PokemonList.jsx'
import './App.css'

function App() {

  return (
    <>
      <h3>Consultando a API do Pokemon</h3>
      <PokemonDetails />
      <PokemonList />
    </>
  )
}

export default App
