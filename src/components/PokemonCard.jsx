import React, { useState } from "react";
import "./PokemonCard.css";

// Définition des couleurs par type
const typeColors = {
  Grass: "#78C850",
  Poison: "#A040A0",
  Fire: "#F08030",
  Flying: "#A890F0",
  Water: "#6890F0",
  Bug: "#A8B820",
  Normal: "#A8A878",
  Electric: "#F8D030",
  Ground: "#E0C068",
  Fairy: "#EE99AC",
  Fighting: "#C03028",
  Psychic: "#F85888",
  Rock: "#B8A038",
  Steel: "#B8B8D0",
  Ice: "#98D8D8",
  Ghost: "#705898",
  Dragon: "#7038F8",
  Dark: "#705848",
};

const PokemonCard = ({ pokemon }) => {
  const [hp, setHp] = useState(pokemon.base.HP);
  const [message, setMessage] = useState("");

  const primaryType = pokemon.type[0]; // Premier type du Pokémon
  const cardColor = typeColors[primaryType] || "#ccc"; // Couleur par défaut si non définie

  // Gestion des attaques
  const handleAttack = () => {
    if (hp > 10) {
      setHp(hp - 10);
    } else {
      setHp(0);
      setMessage(`${pokemon.name.english} est K.O !`);
    }
  };

  const handleHeal = () => {
    setHp(hp + 10);
    setMessage("");
  };

  return (
    <div className="pokemon-card" style={{ background: `linear-gradient(135deg, ${cardColor}, #fff)` }}>
      <div className="card-header">
        <h2 className="pokemon-name">{pokemon.name.english}</h2>
        <span className="pokemon-hp">❤️ {hp} HP</span>
      </div>

      <img src={pokemon.image} alt={pokemon.name.english} className="pokemon-image" />

      <div className="type-container">
        {pokemon.type.map((t) => (
          <span key={t} className="pokemon-type" style={{ backgroundColor: typeColors[t] }}>
            {t}
          </span>
        ))}
      </div>

      <div className="pokemon-stats">
        <p>⚔️ Attaque: {pokemon.base.Attack}</p>
        <p>🛡️ Défense: {pokemon.base.Defense}</p>
        <p>⚡ Vitesse: {pokemon.base.Speed}</p>
      </div>

      <div className="pokemon-actions">
        <button className="attack-button" onClick={handleAttack}>🗡️ Attaquer</button>
        <button className="heal-button" onClick={handleHeal}>❤️ Soigner</button>
      </div>

      {message && <p className="pokemon-message">{message}</p>}
    </div>
  );
};

export default PokemonCard;
