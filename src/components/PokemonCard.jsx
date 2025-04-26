import useSound from 'use-sound';
import attackSound from '../sounds/attack.wav';
import defenseSound from '../sounds/defense.wav';
import faintSound from '../sounds/faint.mp3';
import React, { useState } from "react";
import "./PokemonCard.css";
import { FaRegHeart, FaHeart } from "react-icons/fa";

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

const PokemonCard = ({ pokemon, onClick, onDelete, onToggleFavorite }) => {
  const [playAttack] = useSound(attackSound);
  const [playDefense] = useSound(defenseSound);
  const [playFaint] = useSound(faintSound);
  const [playCry] = useSound(`/sounds/pokemon-cries/${pokemon.id}.wav`, { volume: 0.5 });
  
  const [hp, setHp] = useState(pokemon.base?.HP || 0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastAction, setLastAction] = useState(null);
  const [message, setMessage] = useState('');

  const handleFavorite = (e) => {
    e.stopPropagation(); 
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(pokemon.id);
  };
  // Assure que toutes les stats ont une valeur par défaut
  const stats = {
    HP: pokemon.base?.HP || 0,
    Attack: pokemon.base?.Attack || 0,
    Defense: pokemon.base?.Defense || 0,
    Speed: pokemon.base?.Speed || 0,
    "Sp. Attack": pokemon.base?.["Sp. Attack"] || 0,
    "Sp. Defense": pokemon.base?.["Sp. Defense"] || 0
  };

  const handleAttack = (e) => {
    e.stopPropagation();
    playAttack();
    playCry();
    setIsAnimating(true);
    setLastAction('attack');
    
    const newHp = Math.max(0, hp - 10);
    setHp(newHp);
    
    if(newHp <= 0) {
      playFaint();
      setMessage(`${pokemon.name.english} est K.O.!`);
    }
    
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleDefense = (e) => {
    e.stopPropagation();
    playDefense();
    setIsAnimating(true);
    setLastAction('defense');
    
    setHp(prev => Math.min(stats.HP, prev + 10));
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div 
      className={`pokemon-card ${isAnimating ? lastAction : ''}`}
      onClick={onClick}
      style={{ 
        background: `linear-gradient(135deg, ${typeColors[pokemon.type[0]] || '#FFFFFF'}, #FFFFFF)`,
        '--type-color': typeColors[pokemon.type[0]] || '#FFFFFF'
      }}
    >
     
      <div className="card-header">
        <h2 className="pokemon-name">{pokemon.name.english || 'Pokémon'}</h2>
        <span className="pokemon-hp">HP {hp}/{stats.HP}</span>
      </div>

      <img 
        src={pokemon.image || 'https://via.placeholder.com/180'} 
        alt={pokemon.name.english} 
        className="pokemon-image" 
        style={{ borderColor: typeColors[pokemon.type[0]] || '#000000' }}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/180';
        }}
      />

      <div className="type-container">
        {pokemon.type?.map((t) => (
          <span 
            key={t} 
            className="pokemon-type" 
            style={{ 
              backgroundColor: typeColors[t] || '#777777',
              border: `1px solid ${shadeColor(typeColors[t] || '#777777', -30)}`
            }}
          >
            {t}
          </span>
        )) || <span className="pokemon-type">Unknown</span>}
      </div>

      <div className="pokemon-stats">
        <p>⚔️ {stats.Attack} ATK</p>
        <p>🛡️ {stats.Defense} DEF</p>
        <p>⚡ {stats.Speed} SPD</p>
        <p>🌟 {stats["Sp. Attack"]} SP.ATK</p>
        <p>💫 {stats["Sp. Defense"]} SP.DEF</p>
      </div>

      <div className="pokemon-actions">
        <button 
          className="attack-button"
          onClick={handleAttack}
        >
          🗡️ Attaquer
        </button>
        <button 
          className="defense-button"
          onClick={handleDefense}
        >
          🛡️ Défense
        </button>
        {onDelete && (
          <button 
            className="delete-button"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
          >
            🗑️ Supprimer
          </button>
        )}
      </div>

      {message && <p className="pokemon-message">{message}</p>}

      <div className="hp-container">
        <div 
          className="hp-bar" 
          style={{ width: `${stats.HP > 0 ? (hp / stats.HP) * 100 : 0}%` }}
        />
        <span>❤️ {hp}/{stats.HP}</span>
      </div>
      <button 
        className="favorite-button"
        onClick={handleFavorite}
        style={{
          backgroundColor: pokemon.isFavorite ? '#ffcccc' : '#f0f0f0',
          borderColor: pokemon.isFavorite ? '#ff0000' : '#cccccc'
        }}
      >
        {pokemon.isFavorite ? (
          <FaHeart color="red" /> 
        ) : (
          <FaRegHeart />
        )}
        <span>{pokemon.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}</span>
      </button>
    </div>
  );
};

function shadeColor(color, percent) {
  if (!color) return '#FFFFFF';
  
  let hex = color.startsWith('#') ? color.substring(1) : color;
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  if (hex.length !== 6) return color;

  const R = parseInt(hex.substring(0, 2), 16);
  const G = parseInt(hex.substring(2, 4), 16);
  const B = parseInt(hex.substring(4, 6), 16);

  const newR = Math.min(255, Math.max(0, R + (R * percent) / 100)).toString(16).padStart(2, '0');
  const newG = Math.min(255, Math.max(0, G + (G * percent) / 100)).toString(16).padStart(2, '0');
  const newB = Math.min(255, Math.max(0, B + (B * percent) / 100)).toString(16).padStart(2, '0');

  return `#${newR}${newG}${newB}`;
}

export default PokemonCard;