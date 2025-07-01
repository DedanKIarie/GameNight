import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function GameNightList({ player }) {
  const [gameNights, setGameNights] = useState([]);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [message, setMessage] = useState('');
  const [friends, setFriends] = useState([]);
  const [selectedFriendsToInvite, setSelectedFriendsToInvite] = useState({});
  const [showInviteModal, setShowInviteModal] = useState(null);

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

  const subHeadingStyle = {
    fontSize: '1.5em',
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: '15px',
    marginTop: '25px',
  };

  const gameNightItemStyle = {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    marginBottom: '15px',
    position: 'relative',
  };

  const gameNightTitleStyle = {
    fontSize: '1.5em',
    fontWeight: 'semibold',
    marginBottom: '5px',
    color: '#333',
  };

  const detailTextStyle = {
    color: '#666',
    marginBottom: '5px',
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

  const inviteButtonStyle = {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.9em',
    marginTop: '10px',
    marginRight: '10px',
  };

  const deleteButtonStyle = {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.9em',
    marginTop: '10px',
  };

  const messageStyle = {
    color: 'red',
    marginTop: '15px',
    fontSize: '14px',
  };

  const invitedFriendsListStyle = {
    marginTop: '15px',
    borderTop: '1px solid #eee',
    paddingTop: '10px',
  };

  const invitedFriendItemStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '5px',
    fontSize: '0.9em',
    fontWeight: 'bold',
  };

  const statusColorRed = { color: '#e74c3c' };
  const statusColorGreen = { color: '#27ae60' };

  const iconStyle = {
    marginRight: '5px',
    fontSize: '1.2em',
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const modalContentStyle = {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
    maxWidth: '500px',
    width: '90%',
    fontFamily: '"Roboto", sans-serif',
    position: 'relative',
  };

  const closeModalButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '15px',
    background: 'none',
    border: 'none',
    fontSize: '1.5em',
    cursor: 'pointer',
    color: '#888',
  };

  const modalFriendListStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '10px',
    marginTop: '20px',
    maxHeight: '300px',
    overflowY: 'auto',
    border: '1px solid #eee',
    borderRadius: '5px',
    padding: '10px',
  };

  const modalFriendItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '8px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
  };

  const checkboxStyle = {
    marginRight: '10px',
  };

  const inviteModalButtonStyle = {
    ...buttonStyle,
    marginTop: '20px',
    backgroundColor: '#3498db',
  };

  useEffect(() => {
    const fetchData = async () => {
      setMessage('');
      try {
        const [gameNightsRes, friendsRes] = await Promise.all([
          fetch('https://gamenight-backend-a56o.onrender.com/gamenights'),
          player ? fetch('https://gamenight-backend-a56o.onrender.com/players/me/friends') : Promise.resolve(null),
        ]);

        if (gameNightsRes.ok) {
          const gnData = await gameNightsRes.json();
          setGameNights(gnData);
        } else {
          const errorData = await gameNightsRes.json();
          setMessage(errorData.error || "Failed to fetch game nights.");
        }

        if (player && friendsRes && friendsRes.ok) {
          const friendsData = await friendsRes.json();
          setFriends(friendsData);
        } else if (player && friendsRes) {
          console.error("Failed to fetch friends:", friendsRes.status);
          setFriends([]);
        }

      } catch (error) {
        console.error("Network error fetching data:", error);
        setMessage("Could not connect to the server.");
      }
    };
    fetchData();
  }, [player]);

  const handleCreateGameNight = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!title || !location || !date) {
      setMessage("All fields are required for a game night.");
      return;
    }
    if (new Date(date) < new Date()) {
      setMessage("Date cannot be in the past.");
      return;
    }

    try {
      const response = await fetch('https://gamenight-backend-a56o.onrender.com/gamenights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, location, date, is_public: isPublic }),
      });
      const data = await response.json();
      if (response.ok) {
        setGameNights([...gameNights, data]);
        setTitle('');
        setLocation('');
        setDate('');
        setIsPublic(false);
        setMessage("Game night created successfully!");
      } else {
        setMessage(data.error || "Failed to create game night.");
      }
    } catch (error) {
      console.error("Error creating game night:", error);
      setMessage("Network error creating game night.");
    }
  };

  const handleDeleteGameNight = async (gameNightId) => {
    if (!window.confirm("Are you sure you want to delete this game night?")) {
      return;
    }
    setMessage('');
    try {
      const response = await fetch(`https://gamenight-backend-a56o.onrender.com/gamenights/${gameNightId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setGameNights(gameNights.filter(gn => gn.id !== gameNightId));
        setMessage("Game night deleted successfully!");
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || "Failed to delete game night.");
      }
    } catch (error) {
      console.error("Error deleting game night:", error);
      setMessage("Network error deleting game night.");
    }
  };

  const handleInviteFriendToggle = (gameNightId, friendId) => {
    setSelectedFriendsToInvite(prev => {
      const currentSelections = prev[gameNightId] || [];
      if (currentSelections.includes(friendId)) {
        return {
          ...prev,
          [gameNightId]: currentSelections.filter(id => id !== friendId)
        };
      } else {
        return {
          ...prev,
          [gameNightId]: [...currentSelections, friendId]
        };
      }
    });
  };

  const handleSendInvitations = async (gameNightId) => {
    setMessage('');
    const friendsToInviteIds = selectedFriendsToInvite[gameNightId] || [];

    if (friendsToInviteIds.length === 0) {
      setMessage("Please select at least one friend to invite.");
      return;
    }

    let successCount = 0;
    let failCount = 0;
    for (const friendId of friendsToInviteIds) {
      const friendToInvite = friends.find(f => f.id === friendId);
      if (!friendToInvite) continue;

      try {
        const response = await fetch('https://gamenight-backend-a56o.onrender.com/gamenight_invitations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            game_night_id: gameNightId,
            invitee_username: friendToInvite.username
          }),
        });
        const data = await response.json();
        if (response.ok) {
          successCount++;
        } else {
          failCount++;
          console.error(`Failed to invite ${friendToInvite.username}:`, data.error);
        }
      } catch (error) {
        failCount++;
        console.error(`Network error inviting ${friendToInvite.username}:`, error);
      }
    }

    setMessage(`Sent ${successCount} invitations, ${failCount} failed.`);
    setShowInviteModal(null);
    setSelectedFriendsToInvite({});

    const updatedGameNightsRes = await fetch('https://gamenight-backend-a56o.onrender.com/gamenights');
    if (updatedGameNightsRes.ok) {
      setGameNights(await updatedGameNightsRes.json());
    }
  };

  const getInvitationStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <span style={{ ...iconStyle, color: '#f39c12' }} title="Pending">&#9203;</span>;
      case 'accepted':
        return <span style={{ ...iconStyle, color: '#27ae60' }} title="Accepted">&#10003;</span>;
      case 'declined':
        return <span style={{ ...iconStyle, color: '#e74c3c' }} title="Declined">&#10060;</span>;
      default:
        return null;
    }
  };

  const getProfileIcon = () => {
    return <span style={iconStyle}>&#128100;</span>;
  };

  const getGuestIcon = () => {
    return <span style={iconStyle}>&#128101;</span>;
  };

  return (
    <div style={containerStyle}>
      <div style={listSectionStyle}>
        <h2 style={headingStyle}>Upcoming Game Nights</h2>
        <div>
          {gameNights.map(gn => (
            <div key={gn.id} style={gameNightItemStyle}>
              <h3 style={gameNightTitleStyle}>{gn.title}</h3>
              <p style={detailTextStyle}><strong>Location:</strong> {gn.location}</p>
              <p style={detailTextStyle}><strong>Date:</strong> {new Date(gn.date).toLocaleString()}</p>
              <p style={detailTextStyle}><strong>Host:</strong> {gn.host?.username || 'Unknown'}</p>
              <p style={detailTextStyle}>
                <strong>Type:</strong> {gn.is_public ? 'Public' : 'Private'}
              </p>

              {gn.invitations && gn.invitations.length > 0 && (
                <div style={invitedFriendsListStyle}>
                  <strong>Invited Guests:</strong>
                  {gn.invitations.map(inv => (
                    <div key={inv.id} style={invitedFriendItemStyle}>
                      {getInvitationStatusIcon(inv.status)}
                      {getProfileIcon()}
                      <span style={inv.status === 'accepted' ? statusColorGreen : statusColorRed}>
                        {inv.invitee.username} ({inv.status})
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {player && gn.host_id === player.id && (
                <div>
                  <button
                    onClick={() => setShowInviteModal(gn.id)}
                    style={inviteButtonStyle}
                  >
                    Invite Friends
                  </button>
                  <button
                    onClick={() => handleDeleteGameNight(gn.id)}
                    style={deleteButtonStyle}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {player && (
        <div style={addFormSectionStyle}>
          <h2 style={headingStyle}>Host a New Game Night</h2>
          <form onSubmit={handleCreateGameNight}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Date and Time</label>
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={inputGroupStyle}>
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                style={{ marginRight: '10px' }}
              />
              <label htmlFor="isPublic" style={{ display: 'inline', fontWeight: 'normal' }}>
                Make this game night public
              </label>
            </div>
            <button type="submit" style={buttonStyle}>Create Event</button>
            {message && <p style={messageStyle}>{message}</p>}
          </form>
        </div>
      )}

      {showInviteModal && player && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <button onClick={() => setShowInviteModal(null)} style={closeModalButtonStyle}>&times;</button>
            <h2 style={headingStyle}>Invite Friends to Game Night</h2>
            <h3 style={subHeadingStyle}>Select Friends:</h3>
            {friends.length === 0 ? (
              <p style={{textAlign: 'center', color: '#7f8c8d'}}>You have no friends to invite. Add some friends first!</p>
            ) : (
              <div style={modalFriendListStyle}>
                {friends.map(friend => {
                  const gameNight = gameNights.find(gn => gn.id === showInviteModal);
                  const isInvited = gameNight?.invitations?.some(inv => inv.invitee.username === friend.username);

                  if (isInvited) return null;

                  return (
                    <div key={friend.id} style={modalFriendItemStyle}>
                      <input
                        type="checkbox"
                        checked={(selectedFriendsToInvite[showInviteModal] || []).includes(friend.id)}
                        onChange={() => handleInviteFriendToggle(showInviteModal, friend.id)}
                        style={checkboxStyle}
                      />
                      {getProfileIcon()}
                      <span>{friend.username}</span>
                    </div>
                  );
                })}
              </div>
            )}
            <button
              onClick={() => handleSendInvitations(showInviteModal)}
              style={inviteModalButtonStyle}
              disabled={friends.length === 0 || (selectedFriendsToInvite[showInviteModal] || []).length === 0}
            >
              Send Invitations
            </button>
            {message && <p style={messageStyle}>{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default GameNightList;
