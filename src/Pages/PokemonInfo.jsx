import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PokemonInfo.css"; 
import { FaHeart, FaRegHeart } from 'react-icons/fa';

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

const PokemonInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isFavorite, setIsFavorite] = useState(pokemon?.isFavorite || false);

  const handleToggleFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Connectez-vous pour gérer les favoris");
      return;
    }

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/pokemons/${id}/favorite`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsFavorite(response.data.isFavorite);
    } catch (err) {
      console.error("Erreur favori:", err);
    }
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/pokemons`)
      .then((response) => {
        const allPokemons = response.data;
        const selected = allPokemons.find((p) => String(p.id) === id);
        if (!selected) {
          navigate("/"); // Redirection si le Pokémon n'existe pas
        }
        setPokemon(selected);

        // Suggestions aléatoires
        const otherPokemons = allPokemons.filter((p) => String(p.id) !== id);
        const randomSuggestions = otherPokemons.sort(() => 0.5 - Math.random()).slice(0, 4);
        setSuggestions(randomSuggestions);
      })
      .catch(() => {
        navigate("/");
      });
  }, [id, navigate]);

  const handleDelete = () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("Vous devez être connecté pour supprimer un Pokémon.");
      navigate("/");
      return;
    }
  
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce Pokémon ?")) {
      axios
        .delete(`${import.meta.env.VITE_API_URL}/api/pokemons/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          alert("Pokémon supprimé avec succès !");
          navigate("/");
        })
        .catch((err) => {
          if (err.response?.status === 401) {
            alert("Session expirée, veuillez vous reconnecter.");
            localStorage.removeItem("token");
            navigate("/");
          } else {
            alert("Erreur : suppression échouée.");
          }
          console.error(err);
        });
    }
  };
  

  if (!pokemon) return <div>Chargement...</div>;

  return (
    <div className="pokemon-info-container">
      <div className="pokemon-info-card">
        <h2>{pokemon.name.english}</h2>
        <img src={pokemon.image} alt={pokemon.name.english} />

        <div className="pokemon-info-types">
          {pokemon.type.map((type) => (
            <span key={type} style={{ backgroundColor: typeColors[type] || "#ccc" }}>
              {type}
            </span>
          ))}
        </div>

        <div className="pokemon-info-stats">
          <p>HP: {pokemon.base.HP}</p>
          <p>Attaque: {pokemon.base.Attack}</p>
          <p>Défense: {pokemon.base.Defense}</p>
          <p>Vitesse: {pokemon.base.Speed}</p>
          <p>Spécial Attack: {pokemon.base?.["Sp. Attack"]} SP.ATK</p>
          <p>Spécial Defense: {pokemon.base?.["Sp. Defense"]} SP.DEF</p>
        </div>

        <div className="pokemon-info-actions">
          <button className="back-button" onClick={() => navigate("/")}>⬅️ Retour</button>
          <button className="back-button" onClick={handleDelete}>🗑️ Supprimer</button>
          <button 
            className="favorite-button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleFavorite();
            }}
          >
            {isFavorite ? (
              <FaHeart color="red" />
            ) : (
              <FaRegHeart />
            )}
            <span>{isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}</span>
          </button>
        </div>
      </div>

      <div className="pokemon-suggestions">
            <h3>Découvre aussi ces Pokémon :</h3>
            <div className="suggestion-carousel">
                <div className="suggestion-track">
                {suggestions.map((suggested, index) => (
                    <div 
                    key={suggested.id}
                    className="suggestion-bubble"
                    style={{ '--i': index }}
                    onClick={() => navigate(`/pokemon/${suggested.id}`)}
                    >
                    <img src={suggested.image} alt={suggested.name.english} />
                    <p>{suggested.name.english}</p>
                    </div>
                ))}
                </div>
            
                <div className="carousel-controls">
                <button className="carousel-btn" onClick={() => {}}>←</button>
                <button className="carousel-btn" onClick={() => {}}>→</button>
                </div>
            </div>
         </div>
    </div>
  );
};

export default PokemonInfo;
