import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import PokemonCard from "./components/PokemonCard";
import PokemonInfo from "./Pages/PokemonInfo";
import AddPokemonForm from "./components/AddPokemonForm";
import LoginForm from "./components/LoginForm";
import RegisterForm from './components/RegisterForm';
import "./App.css";

function HomePage({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pokemons, setPokemons] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState([]);
  const [hpFilter, setHpFilter] = useState("");
  const [attackFilter, setAttackFilter] = useState("");
  const [defenseFilter, setDefenseFilter] = useState("");
  const [speedFilter, setSpeedFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/pokemons`)
      .then((response) => {
        setPokemons(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des Pokémon :", err);
        setError("Impossible de récupérer les Pokémon.");
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    const token = localStorage.getItem("token");

    if (!token) return alert("Connectez-vous pour supprimer un Pokémon.");

    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce Pokémon ?")) {
      axios
        .delete(`${import.meta.env.VITE_API_URL}/api/pokemons/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          setPokemons((prev) => prev.filter((p) => p.id !== id));
        })
        .catch((err) => {
          alert("Erreur : suppression échouée.");
          console.error(err);
        });
    }
  };

  const allTypes = [
    "Grass", "Poison", "Fire", "Water", "Bug", "Flying", "Normal", "Electric", "Ground",
    "Psychic", "Fairy", "Rock", "Ice", "Dragon", "Ghost", "Fighting", "Steel"
  ];

  const typeColors = {
    Grass: "#78C850", Poison: "#A040A0", Fire: "#F08030", Flying: "#A890F0",
    Water: "#6890F0", Bug: "#A8B820", Normal: "#A8A878", Electric: "#F8D030",
    Ground: "#E0C068", Fairy: "#EE99AC", Fighting: "#C03028", Psychic: "#F85888",
    Rock: "#B8A038", Steel: "#B8B8D0", Ice: "#98D8D8", Ghost: "#705898",
    Dragon: "#7038F8", Dark: "#705848",
  };

  const filteredPokemons = pokemons.filter((pokemon) => {
    const nameMatch = pokemon.name.english.toLowerCase().includes(nameFilter.toLowerCase());
    const typeMatch = typeFilter.length === 0 || typeFilter.every((t) => pokemon.type.includes(t));
    const hpMatch = hpFilter === "" || pokemon.base.HP >= parseInt(hpFilter);
    const attackMatch = attackFilter === "" || pokemon.base.Attack >= parseInt(attackFilter);
    const defenseMatch = defenseFilter === "" || pokemon.base.Defense >= parseInt(defenseFilter);
    const speedMatch = speedFilter === "" || pokemon.base.Speed >= parseInt(speedFilter);
    const favoriteMatch = !favoritesOnly || pokemon.isFavorite;
    
    return nameMatch && typeMatch && hpMatch && attackMatch && defenseMatch && speedMatch && favoriteMatch;
  });

  const toggleType = (type) => {
    setTypeFilter((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleFavorite = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Connectez-vous pour gérer les favoris.");

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
      
      setPokemons(prev => 
        prev.map(p => 
          p.id === id 
            ? { ...p, isFavorite: !p.isFavorite } 
            : p
        )
      );
      
    } catch (err) {
      console.error("Erreur lors de la mise à jour des favoris:", err);
      // Revert en cas d'erreur
      setPokemons(prev => 
        prev.map(p => 
          p.id === id 
            ? { ...p, isFavorite: !p.isFavorite } 
            : p
        )
      );
    }
  };

  return (
    <div className="app">
      <h1>Pokédex</h1>
      <button 
        onClick={() => {
          onLogout();
          navigate('/');
        }} 
        className="logout-btn"
      >
        Se déconnecter
      </button>

      {loading && <p className="loading">Chargement</p>}
      {error && <p className="error">{error}</p>}

      <div className="filters">
        <input type="text" placeholder="Nom (en anglais)" value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} />
        <input type="number" placeholder="HP min" value={hpFilter} onChange={(e) => setHpFilter(e.target.value)} />
        <input type="number" placeholder="Attaque min" value={attackFilter} onChange={(e) => setAttackFilter(e.target.value)} />
        <input type="number" placeholder="Défense min" value={defenseFilter} onChange={(e) => setDefenseFilter(e.target.value)} />
        <input type="number" placeholder="Vitesse min" value={speedFilter} onChange={(e) => setSpeedFilter(e.target.value)} />
      </div>

      <div className="type-filters">
        {allTypes.map((type) => (
          <button
            key={type}
            className={typeFilter.includes(type) ? "active" : ""}
            onClick={() => toggleType(type)}
            style={{
              backgroundColor: typeColors[type],
              border: `2px solid ${shadeColor(typeColors[type], -30)}`
            }}
          >
            {type}
          </button>
        ))}
      </div>

      <button className="add-pokemon-btn" onClick={() => setShowAddForm(true)}>
        AJOUTER UN POKÉMON
      </button>


      {showAddForm && (
        <AddPokemonForm
          onAdd={(newPokemon) => {
            setPokemons((prev) => [...prev, newPokemon]);
            setShowAddForm(false);
          }}
          onClose={() => setShowAddForm(false)}
        />
        
      )}

      <div className="pokemon-container">
        {filteredPokemons.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            onClick={() => navigate(`/pokemon/${pokemon.id}`)}
            onDelete={() => handleDelete(pokemon.id)}
            onToggleFavorite={toggleFavorite}
          />

          
        ))}
      </div>
      <button 
  className="favorites-toggle"
  onClick={() => setSidebarOpen(!sidebarOpen)}
>
  {sidebarOpen ? '×' : '★'}
</button>

<div className={`favorites-sidebar ${sidebarOpen ? 'open' : ''}`}>
  <h2>Mes Favoris</h2>
  {pokemons
    .filter(p => p.isFavorite)
    .map(pokemon => (
      <div 
        key={pokemon.id} 
        className="favorite-item"
        onClick={() => {
          navigate(`/pokemon/${pokemon.id}`);
          setSidebarOpen(false);
        }}
      >
        <img 
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`} 
          alt={pokemon.name.english} 
        />
        <span>{pokemon.name.english}</span>
      </div>
    ))}
    
  {pokemons.filter(p => p.isFavorite).length === 0 && (
    <p style={{ textAlign: 'center', fontFamily: 'Press Start 2P', fontSize: '0.7rem' }}>
      Aucun favori
    </p>
  )}
</div>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <Routes>
      {isLoggedIn ? (
        <>
          <Route path="/" element={<HomePage onLogout={handleLogout} />} />
          <Route path="/pokemon/:id" element={<PokemonInfo />} />
        </>
      ) : (
        <Route
          path="*"
          element={
            <div className="auth-container">
              {isRegisterMode ? (
                <>
                  <RegisterForm onRegisterSuccess={() => {
                    setIsRegisterMode(false);
                    navigate('/');
                  }} />
                  <p className="toggle-auth">
                    Déjà inscrit ?{" "}
                    <button onClick={() => setIsRegisterMode(false)}>Se connecter</button>
                  </p>
                </>
              ) : (
                <>
                  <LoginForm onLoginSuccess={handleLoginSuccess} />
                  <p className="toggle-auth">
                    Pas encore de compte ?{" "}
                    <button onClick={() => setIsRegisterMode(true)}>Créer un compte</button>
                  </p>
                </>
              )}
            </div>
          }
        />
      )}
    </Routes>
  );
}

function shadeColor(color, percent) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);

  R = (R < 255) ? R : 255;
  G = (G < 255) ? G : 255;
  B = (B < 255) ? B : 255;

  R = Math.max(0, R).toString(16);
  G = Math.max(0, G).toString(16);
  B = Math.max(0, B).toString(16);

  const RR = (R.length === 1) ? `0${R}` : R;
  const GG = (G.length === 1) ? `0${G}` : G;
  const BB = (B.length === 1) ? `0${B}` : B;

  return `#${RR}${GG}${BB}`;
}

export default App;