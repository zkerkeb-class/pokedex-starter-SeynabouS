import React, { useState } from 'react';
import axios from 'axios';

function RegisterForm({ onRegisterSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/register`, {
        username,
        password,
      });

      setSuccess('Inscription réussie ✅');
      onRegisterSuccess?.(); // pour afficher le formulaire de login
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l’inscription ❌');
    }
  };

  return (
    <div className="register-form">
      <h2>Créer un compte</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">S'inscrire</button>
      </form>

      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default RegisterForm;
