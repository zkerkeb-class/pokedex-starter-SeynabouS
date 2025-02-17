import React, { useState } from "react";
import pokemonsList from "./assets/pokemons";
import PokemonCard from "./components/PokemonCard";
import "./App.css";

function App() {
  // États pour la recherche et le type de filtre
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("name");

  // Filtrer les Pokémon en fonction du critère sélectionné
  const filteredPokemons = pokemonsList.filter((pokemon) => {
    const value = searchTerm.toLowerCase();
    
    switch (filterType) {
      case "name":
        return pokemon.name.english.toLowerCase().includes(value);
      case "type":
        return pokemon.type.some((t) => t.toLowerCase().includes(value));
      case "hp":
        return pokemon.base.HP.toString().includes(value);
      case "attack":
        return pokemon.base.Attack.toString().includes(value);
      case "defense":
        return pokemon.base.Defense.toString().includes(value);
      case "speed":
        return pokemon.base.Speed.toString().includes(value);
      default:
        return true;
    }
  });

  return (
    <div className="app">
      <h1>Pokédex</h1>

      {/* Conteneur de la recherche */}
      <div className="search-container">
        <input
          type="text"
          placeholder={`Rechercher par ${filterType}...`}
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Menu déroulant pour choisir le filtre */}
        <select
          className="filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="name">Nom</option>
          <option value="type">Type</option>
          <option value="hp">HP</option>
          <option value="attack">Attaque</option>
          <option value="defense">Défense</option>
          <option value="speed">Vitesse</option>
        </select>
      </div>

      {/* Affichage des Pokémon filtrés */}
      <div className="pokemon-container">
        {filteredPokemons.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
    </div>
  );
}

export default App;
