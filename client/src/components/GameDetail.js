import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';

// Mock data for GameDetail to find the game
const mockGames = [
  { id: 1, name: "Catan", genre: "Strategy" },
  { id: 2, name: "Ticket to Ride", genre: "Family" },
  { id: 3, name: "Dominion", genre: "Deck-building" },
];

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
    fontFamily: '"Roboto", sans-serif', // Added font
  };

  const titleStyle = {
    fontSize: '2.5em',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333',
    fontFamily: '"Montserrat", sans-serif', // Added font
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
    backgroundColor: '#FFC107', // Yellow for Edit
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    fontSize: '1em',
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  const deleteButtonStyle = {
    backgroundColor: '#DC3545', // Red for Delete
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
    backgroundColor: '#007BFF', // Blue for Save
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
    backgroundColor: '#28A745', // Green for Add to Collection
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
    const foundGame = mockGames.find(g => String(g.id) === id);
    if (foundGame) {
      setGame(foundGame);
      setEditName(foundGame.name);
      setEditGenre(foundGame.genre);
    } else {
      setMessage("Game not found.");
    }
  }, [id]);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setMessage('');

    if (!editName || !editGenre) {
      setMessage("Name and genre cannot be empty.");
      return;
    }

    const updatedGame = { ...game, name: editName, genre: editGenre };
    onUpdateGame(updatedGame);
    setGame(updatedGame);
    setIsEditing(false);
    setMessage("Game updated successfully!");
  };

  const handleDelete = () => {
    setMessage('');
    if (window.confirm('Are you sure you want to delete this game?')) {
      onDeleteGame(id);
      navigate("/games");
      setMessage("Game deleted.");
    } else {
      setMessage("Deletion cancelled.");
    }
  };

  const handleAddToCollection = (e) => {
    e.preventDefault();
    setMessage('');

    setMessage(`Game "${game.name}" added to your collection with condition: ${collectionCondition}!`);
    setCollectionCondition('Good');
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
