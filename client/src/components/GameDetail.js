import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';

function GameDetail({ player, onUpdateGame, onDeleteGame }) {
  const [game, setGame] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editGenre, setEditGenre] = useState('');
  const [collectionCondition, setCollectionCondition] = useState('Good');
  const [message, setMessage] = useState('');

  const { id } = useParams();
  const navigate = useNavigate();

  const containerStyle = {
    maxWidth: '800px',
    margin: '50px auto',
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    fontFamily: '"Roboto", sans-serif',
  };

  const titleStyle = {
    fontSize: '2.5em',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333',
    fontFamily: '"Montserrat", sans-serif',
  };

  const genreStyle = {
    fontSize: '1.2em',
    color: '#666',
    marginBottom: '20px',
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '15px',
    marginBottom: '25px',
  };

  const editButtonStyle = {
    backgroundColor: '#FFC107',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    fontSize: '1em',
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  const deleteButtonStyle = {
    backgroundColor: '#DC3545',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    fontSize: '1em',
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  const formStyle = {
    padding: '20px',
    border: '1px solid #eee',
    borderRadius: '8px',
    marginBottom: '25px',
    backgroundColor: '#f9f9f9',
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

  const saveButtonStyle = {
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    fontSize: '1em',
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  const collectionSectionStyle = {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
  };

  const collectionHeadingStyle = {
    fontSize: '1.8em',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  };

  const selectStyle = {
    width: 'calc(100% - 20px)',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    backgroundColor: '#ffffff',
  };

  const addToCollectionButtonStyle = {
    backgroundColor: '#28A745',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    fontSize: '1em',
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  const messageStyle = {
    color: 'red',
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '14px',
  };

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch(`https://gamenight-backend-a56o.onrender.com/games/${id}`);
        if (response.ok) {
          const gameData = await response.json();
          setGame(gameData);
          setEditName(gameData.name);
          setEditGenre(gameData.genre);
        } else {
          const errorData = await response.json();
          setMessage(errorData.error || "Game not found.");
        }
      } catch (error) {
        console.error("Network error fetching game:", error);
        setMessage("Could not connect to the server to fetch game details.");
      }
    };
    fetchGame();
  }, [id]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!editName || !editGenre) {
      setMessage("Name and genre cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`https://gamenight-backend-a56o.onrender.com/games/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, genre: editGenre }),
      });
      const data = await response.json();
      if (response.ok) {
        onUpdateGame(data); // Assuming the backend returns the updated game object
        setGame(data);
        setIsEditing(false);
        setMessage("Game updated successfully!");
      } else {
        setMessage(data.error || "Failed to update game.");
      }
    } catch (error) {
      console.error("Error updating game:", error);
      setMessage("Network error updating game.");
    }
  };

  const handleDelete = async () => {
    setMessage('');
    if (window.confirm('Are you sure you want to delete this game?')) {
      try {
        const response = await fetch(`https://gamenight-backend-a56o.onrender.com/games/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          onDeleteGame(id);
          navigate("/games");
          setMessage("Game deleted.");
        } else {
          const errorData = await response.json();
          setMessage(errorData.error || "Failed to delete game.");
        }
      } catch (error) {
        console.error("Error deleting game:", error);
        setMessage("Network error deleting game.");
      }
    } else {
      setMessage("Deletion cancelled.");
    }
  };

  const handleAddToCollection = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!player) {
      setMessage("Please log in to add games to your collection.");
      return;
    }

    try {
      const response = await fetch(`https://gamenight-backend-a56o.onrender.com/players/me/collection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game_id: game.id, condition: collectionCondition }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || `Game "${game.name}" added to your collection with condition: ${collectionCondition}!`);
        setCollectionCondition('Good');
      } else {
        setMessage(data.error || "Failed to add game to collection.");
      }
    } catch (error) {
      console.error("Error adding to collection:", error);
      setMessage("Network error adding to collection.");
    }
  };

  if (!game) return <div style={{textAlign: 'center', marginTop: '40px', fontSize: '1.2em'}}>Loading...</div>;

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>{game.name}</h2>
      <p style={genreStyle}>{game.genre}</p>

      {player && (
        <div style={buttonContainerStyle}>
          <button onClick={() => setIsEditing(!isEditing)} style={editButtonStyle}>
            {isEditing ? 'Cancel' : 'Edit Game'}
          </button>
          <button onClick={handleDelete} style={deleteButtonStyle}>
            Delete Game
          </button>
        </div>
      )}

      {isEditing && (
        <form onSubmit={handleEditSubmit} style={formStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Name</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Genre</label>
            <input
              type="text"
              value={editGenre}
              onChange={(e) => setEditGenre(e.target.value)}
              style={inputStyle}
            />
          </div>
          <button type="submit" style={saveButtonStyle}>Save Changes</button>
        </form>
      )}

      {player && (
        <div style={collectionSectionStyle}>
          <h3 style={collectionHeadingStyle}>Add to My Collection</h3>
          <form onSubmit={handleAddToCollection}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Condition</label>
              <select
                value={collectionCondition}
                onChange={(e) => setCollectionCondition(e.target.value)}
                style={selectStyle}
              >
                <option value="New in Shrink">New in Shrink</option>
                <option value="Good">Good</option>
                <option value="Worn">Worn</option>
              </select>
            </div>
            <button type="submit" style={addToCollectionButtonStyle}>Add to Collection</button>
          </form>
        </div>
      )}
      {message && <p style={messageStyle}>{message}</p>}
    </div>
  );
}

export default GameDetail;
