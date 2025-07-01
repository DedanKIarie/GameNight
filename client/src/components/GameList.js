import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function GameList({ games, onAddGame, player }) {
  const [name, setName] = useState('');
  const [genre, setGenre] = useState('');
  const [message, setMessage] = useState('');

  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    padding: '20px',
    fontFamily: '"Roboto", sans-serif',
  };

  const listSectionStyle = {
    backgroundColor: '#ffffff',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  };

  const addFormSectionStyle = {
    backgroundColor: '#ffffff',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  };

  const headingStyle = {
    fontSize: '2em',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
    fontFamily: '"Montserrat", sans-serif',
  };

  const gameItemStyle = {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    marginBottom: '15px',
  };

  const gameTitleStyle = {
    fontSize: '1.5em',
    fontWeight: 'semibold',
    marginBottom: '5px',
    color: '#333',
  };

  const gameGenreStyle = {
    color: '#666',
    marginBottom: '10px',
  };

  const linkStyle = {
    color: '#008CBA',
    fontWeight: 'semibold',
    textDecoration: 'none',
  };

  const inputGroupStyle = {
    marginBottom: '15px',
    textAlign: 'left',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#333',
  };

  const inputStyle = {
    width: 'calc(100% - 20px)',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '20px',
    backgroundColor: '#4CAF50',
    color: 'white',
  };

  const messageStyle = {
    color: 'red',
    marginTop: '15px',
    fontSize: '14px',
  };

  const handleAddGameSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!name || !genre) {
      setMessage("Please enter both name and genre.");
      return;
    }

    try {
      const response = await fetch('https://gamenight-backend-a56o.onrender.com/games', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, genre }),
      });
      const data = await response.json();
      if (response.ok) {
        onAddGame(data);
        setName('');
        setGenre('');
        setMessage("Game added successfully!");
      } else {
        setMessage(data.error || "Failed to add game.");
      }
    } catch (error) {
      console.error("Error adding game:", error);
      setMessage("Network error adding game.");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={listSectionStyle}>
        <h2 style={headingStyle}>All Games</h2>
        <div>
          {games.map(game => (
            <div key={game.id} style={gameItemStyle}>
              <div>
                <h3 style={gameTitleStyle}>{game.name}</h3>
                <p style={gameGenreStyle}>{game.genre}</p>
                <Link to={`/games/${game.id}`} style={linkStyle}>View Details</Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {player && (
        <div style={addFormSectionStyle}>
          <h2 style={headingStyle}>Add a New Game</h2>
          <form onSubmit={handleAddGameSubmit}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Genre</label>
              <input
                id="genre"
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                style={inputStyle}
              />
            </div>
            <button type="submit" style={buttonStyle}>Add Game</button>
            {message && <p style={messageStyle}>{message}</p>}
          </form>
        </div>
      )}
    </div>
  );
}

export default GameList;
