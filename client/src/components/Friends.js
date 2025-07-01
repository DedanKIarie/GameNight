import React, { useState, useEffect } from 'react';

function Friends({ player }) {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [friendUsername, setFriendUsername] = useState('');
  const [friendsGameNights, setFriendsGameNights] = useState([]);
  const [message, setMessage] = useState('');

  const containerStyle = {
    padding: '20px',
    backgroundColor: '#f8f8f8',
    minHeight: 'calc(100vh - 70px)',
    fontFamily: '"Roboto", sans-serif',
  };

  const sectionStyle = {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
    marginBottom: '30px',
    maxWidth: '900px',
    margin: '30px auto',
  };

  const headingStyle = {
    fontSize: '2em',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '20px',
    fontFamily: '"Montserrat", sans-serif',
    textAlign: 'center',
  };

  const subHeadingStyle = {
    fontSize: '1.5em',
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: '15px',
    marginTop: '25px',
  };

  const listContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '15px',
  };

  const listItemStyle = {
    backgroundColor: '#ecf0f1',
    padding: '15px',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  };

  const formStyle = {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    justifyContent: 'center',
  };

  const inputStyle = {
    flexGrow: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1em',
    maxWidth: '300px',
  };

  const buttonStyle = {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1em',
    transition: 'background-color 0.3s ease',
  };

  const sendRequestButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#3498db',
    color: 'white',
  };

  const acceptButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#27ae60',
    color: 'white',
    marginLeft: '10px',
  };

  const declineButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#e74c3c',
    color: 'white',
    marginLeft: '10px',
  };

  const gameNightCardStyle = {
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    marginBottom: '10px',
  };

  const gameNightTitleStyle = {
    fontSize: '1.2em',
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: '5px',
  };

  const gameNightDetailsStyle = {
    fontSize: '0.9em',
    color: '#7f8c8d',
  };

  const messageStyle = {
    color: 'red',
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '1em',
    fontWeight: 'bold',
  };

  useEffect(() => {
    if (!player) {
      setFriends([]);
      setPendingRequests([]);
      setFriendsGameNights([]);
      return;
    }

    const fetchFriendData = async () => {
      setMessage('');
      try {
        const [friendsRes, pendingRes, gameNightsRes] = await Promise.all([
          fetch("https://gamenight-backend-a56o.onrender.com/players/me/friends", { credentials: 'include' }),
          fetch("https://gamenight-backend-a56o.onrender.com/players/me/friend_requests/pending", { credentials: 'include' }),
          fetch("https://gamenight-backend-a56o.onrender.com/friends_gamenights", { credentials: 'include' }),
        ]);

        if (friendsRes.ok) {
          const data = await friendsRes.json();
          setFriends(data);
        } else {
          console.error("Failed to fetch friends:", friendsRes.status);
          setFriends([]);
        }

        if (pendingRes.ok) {
          const data = await pendingRes.json();
          setPendingRequests(data);
        } else {
          console.error("Failed to fetch pending requests:", pendingRes.status);
          setPendingRequests([]);
        }

        if (gameNightsRes.ok) {
          const data = await gameNightsRes.json();
          setFriendsGameNights(data);
        } else {
          console.error("Failed to fetch friends' game nights:", gameNightsRes.status);
          setFriendsGameNights([]);
        }

      } catch (error) {
        console.error("Network error fetching friend data:", error);
        setMessage("Error loading friend data. Please try again.");
      }
    };

    fetchFriendData();
  }, [player]);

  const handleSendFriendRequest = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!friendUsername) {
      setMessage('Please enter a username to send a request.');
      return;
    }
    try {
      const response = await fetch('https://gamenight-backend-a56o.onrender.com/friend_requests', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: friendUsername }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || 'Friend request sent!');
        setFriendUsername('');
        
        if (player) {
            const pendingRes = await fetch("https://gamenight-backend-a56o.onrender.com/players/me/friend_requests/pending", { credentials: 'include' });
            if (pendingRes.ok) {
                const updatedPending = await pendingRes.json();
                setPendingRequests(updatedPending);
            }
        }
      } else {
        setMessage(data.error || 'Failed to send friend request.');
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      setMessage("Network error sending request.");
    }
  };

  const handleFriendRequestAction = async (friendshipId, action) => {
    setMessage('');
    try {
      const response = await fetch(`https://gamenight-backend-a56o.onrender.com/friend_requests/${friendshipId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: action }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || `Friend request ${action}ed.`);
        if (player) {
          const [friendsRes, pendingRes, gameNightsRes] = await Promise.all([
            fetch("https://gamenight-backend-a56o.onrender.com/players/me/friends", { credentials: 'include' }),
            fetch("https://gamenight-backend-a56o.onrender.com/players/me/friend_requests/pending", { credentials: 'include' }),
            fetch("https://gamenight-backend-a56o.onrender.com/friends_gamenights", { credentials: 'include' }),
          ]);

          if (friendsRes.ok) setFriends(await friendsRes.json());
          if (pendingRes.ok) setPendingRequests(await pendingRes.json());
          if (gameNightsRes.ok) setFriendsGameNights(await gameNightsRes.json());
        }
      } else {
        setMessage(data.error || `Failed to ${action} friend request.`);
      }
    } catch (error) {
      console.error("Error performing friend request action:", error);
      setMessage("Network error during action.");
    }
  };

  if (!player) {
    return (
      <div style={containerStyle}>
        <div style={sectionStyle}>
          <h2 style={headingStyle}>Friends & Social</h2>
          <p style={{textAlign: 'center', color: '#7f8c8d'}}>Please log in to manage your friends and view their game nights.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={sectionStyle}>
        <h2 style={headingStyle}>Friends & Social Hub</h2>

        <div style={{ paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
          <h3 style={subHeadingStyle}>Send Friend Request</h3>
          <form onSubmit={handleSendFriendRequest} style={formStyle}>
            <input
              type="text"
              placeholder="Enter username"
              value={friendUsername}
              onChange={(e) => setFriendUsername(e.target.value)}
              style={inputStyle}
            />
            <button type="submit" style={sendRequestButtonStyle}>Send Request</button>
          </form>
        </div>

        <h3 style={subHeadingStyle}>Your Friends</h3>
        {friends.length === 0 ? (
          <p style={{color: '#7f8c8d'}}>You don't have any friends yet. Send a request!</p>
        ) : (
          <div style={listContainerStyle}>
            {friends.map(friend => (
              <div key={friend.id} style={listItemStyle}>
                <span>{friend.username}</span>
              </div>
            ))}
          </div>
        )}

        <h3 style={subHeadingStyle}>Pending Friend Requests ({pendingRequests.length})</h3>
        {pendingRequests.length === 0 ? (
          <p style={{color: '#7f8c8d'}}>No pending friend requests.</p>
        ) : (
          <div style={listContainerStyle}>
            {pendingRequests.map(request => (
              <div key={request.id} style={listItemStyle}>
                <span>{request.requester.username}</span>
                <div>
                  <button onClick={() => handleFriendRequestAction(request.id, 'accept')} style={acceptButtonStyle}>Accept</button>
                  <button onClick={() => handleFriendRequestAction(request.id, 'decline')} style={declineButtonStyle}>Decline</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={sectionStyle}>
        <h2 style={subHeadingStyle}>Game Nights by Your Friends</h2>
        {friendsGameNights.length === 0 ? (
          <p style={{textAlign: 'center', color: '#7f8c8d'}}>No upcoming game nights from your friends.</p>
        ) : (
          <div>
            {friendsGameNights.map(gn => (
              <div key={gn.id} style={gameNightCardStyle}>
                <h3 style={gameNightTitleStyle}>{gn.title}</h3>
                <p style={gameNightDetailsStyle}><strong>Host:</strong> {gn.host_username}</p>
                <p style={gameNightDetailsStyle}><strong>Location:</strong> {gn.location}</p>
                <p style={gameNightDetailsStyle}><strong>Date:</strong> {new Date(gn.date).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {message && <p style={messageStyle}>{message}</p>}
    </div>
  );
}

export default Friends;
