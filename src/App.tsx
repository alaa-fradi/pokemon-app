import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PokemonList from './components/PokemonList';

function App() {
  return (
    <Router basename="/pokemon-app">
      <Routes>
        <Route path="/" element={<PokemonList />} />
      </Routes>
    </Router>
  );
}

export default App;
