import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

function Home({ player }) {
  const [games, setGames] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch("/games");
        if (response.ok) {
          const gamesData = await response.json();
          setGames(gamesData);
        } else {
          const errorData = await response.json();
          setMessage(errorData.error || "Failed to fetch games.");
        }
      } catch (error) {
        console.error("Network error fetching games:", error);
        setMessage("Could not connect to the server to fetch games.");
      }
    };
    fetchGames();
  }, []);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '30px 20px', // Increased vertical padding
    backgroundColor: '#f5f7fa', // Lighter background for a cleaner look
    minHeight: 'calc(100vh - 70px)',
    fontFamily: '"Inter", sans-serif', // Changed font for a modern feel
  };

  const welcomeSectionStyle = {
    textAlign: 'center',
    margin: '40px auto 60px auto', // Increased margins
    padding: '35px', // Increased padding
    backgroundColor: '#ffffff',
    borderRadius: '12px', // Slightly more rounded corners
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)', // More pronounced and diffused shadow
    maxWidth: '950px', // Increased max width
    width: '100%',
    boxSizing: 'border-box', // Ensure padding is included in width
  };

  const titleStyle = {
    fontSize: '3.5em', // Larger title
    fontWeight: '800', // Extra bold
    color: '#2d3748', // Darker, more professional text color
    marginBottom: '20px', // Increased margin
    fontFamily: '"Montserrat", sans-serif',
    textShadow: '2px 2px 4px rgba(0,0,0,0.08)', // Softer, more defined shadow
    lineHeight: '1.2',
  };

  const subtitleStyle = {
    fontSize: '1.3em', // Slightly larger subtitle
    color: '#718096', // Softer grey
    marginBottom: '40px', // Increased margin
    maxWidth: '700px',
    margin: '0 auto 40px auto', // Center and add margin
  };

  const messageStyleBase = {
    fontSize: '1.6em', // Slightly larger message
    fontWeight: '700', // Bolder message
    padding: '10px 0',
  };

  const welcomeMessageStyle = {
    ...messageStyleBase,
    color: '#28a745', // Standard green for success
  };

  const promptMessageStyle = {
    ...messageStyleBase,
    color: '#007bff', // Standard blue for prompts
  };

  const gamesSectionStyle = {
    width: '100%',
    maxWidth: '1280px', // Increased max width
    padding: '40px 0', // Increased padding
    textAlign: 'center',
  };

  const gamesHeadingStyle = {
    fontSize: '2.8em', // Larger heading
    fontWeight: '800', // Extra bold
    color: '#2d3748',
    marginBottom: '40px', // Increased margin
    fontFamily: '"Montserrat", sans-serif',
    textShadow: '1px 1px 3px rgba(0,0,0,0.05)',
  };

  const gamesGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', // Slightly larger min-width for cards
    gap: '30px', // Increased gap
    justifyContent: 'center',
    padding: '0 20px', // Padding for grid
  };

  const gameCardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    padding: '25px', // Increased padding
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    border: '1px solid #e2e8f0', // Subtle border
    transform: 'translateY(0) scale(1)', // Explicitly set initial transform
  };

  const gameCardHoverStyle = {
    transform: 'translateY(-8px) scale(1.02)', // More pronounced lift and slight scale
    boxShadow: '0 12px 35px rgba(0, 0, 0, 0.18)', // Stronger shadow on hover
  };

  const gameImageStyle = {
    width: '180px', // Larger image
    height: '180px',
    objectFit: 'cover',
    borderRadius: '10px', // More rounded image corners
    marginBottom: '20px', // Increased margin
    border: '3px solid #cbd5e0', // More visible border
    transition: 'transform 0.3s ease', // Smooth image scale on hover
    transform: 'scale(1)', // Explicitly set initial transform
  };

  const gameImageHoverStyle = {
    transform: 'scale(1.05)', // Slight scale on image hover
  };

  const gameTitleCardStyle = {
    fontSize: '1.8em', // Larger title
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '10px',
  };

  const gameGenreCardStyle = {
    fontSize: '1.1em', // Slightly larger genre text
    color: '#718096',
    marginBottom: '20px', // Increased margin
  };

  const viewDetailsLinkStyle = {
    display: 'inline-block',
    backgroundColor: '#3498db',
    color: 'white',
    padding: '12px 25px', // More padding for button
    borderRadius: '8px', // More rounded button
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.1em', // Larger font for button
    transition: 'background-color 0.3s ease, transform 0.2s ease', // Added transform transition
    transform: 'translateY(0)', // Explicitly set initial transform
  };

  const viewDetailsLinkHoverStyle = {
    backgroundColor: '#2980b9',
    transform: 'translateY(-2px)', // Slight lift on hover
  };

  const welcomeImageStyle = {
    width: '100%',
    maxWidth: '500px', // Larger max width for the image
    height: 'auto',
    borderRadius: '12px',
    marginBottom: '30px', // Increased margin
    boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
  };

  return (
    <div style={containerStyle}>
      <div style={welcomeSectionStyle}>
        <img
          src="https://placehold.co/500x250/667eea/ffffff?text=Game+Night+Fun" // Updated placeholder image with a nicer color
          alt="Board Game Night"
          style={welcomeImageStyle}
        />
        <h1 style={titleStyle}>
          Welcome to BoardGameNight!
        </h1>
        <p style={subtitleStyle}>
          Your one-stop place to organize game nights with friends.
        </p>
        {player ? (
          <p style={welcomeMessageStyle}>
            You are logged in as {player.username}. Let the games begin!
          </p>
        ) : (
          <p style={promptMessageStyle}>
            Login or sign up to manage your games and create events.
          </p>
        )}
      </div>

      <div style={gamesSectionStyle}>
        <h2 style={gamesHeadingStyle}>Explore Our Games</h2>
        {message && <p style={{color: 'red', textAlign: 'center', marginBottom: '20px'}}>{message}</p>}
        <div style={gamesGridStyle}>
          {games.map(game => (
            <div
              key={game.id}
              style={gameCardStyle}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, gameCardHoverStyle);
                Object.assign(e.currentTarget.querySelector('img').style, gameImageHoverStyle);
              }}
              onMouseLeave={(e) => {
                // Revert to original styles by explicitly setting properties
                e.currentTarget.style.transform = gameCardStyle.transform;
                e.currentTarget.style.boxShadow = gameCardStyle.boxShadow;
                e.currentTarget.querySelector('img').style.transform = gameImageStyle.transform;
              }}
            >
              <img
                src={`https://placehold.co/180x180/e2e8f0/2d3748?text=${game.name.substring(0,10)}`}
                alt={game.name}
                style={gameImageStyle}
              />
              <h3 style={gameTitleCardStyle}>{game.name}</h3>
              <p style={gameGenreCardStyle}>{game.genre}</p>
              <Link
                to={`/games/${game.id}`}
                style={viewDetailsLinkStyle}
                onMouseEnter={(e) => Object.assign(e.target.style, viewDetailsLinkHoverStyle)}
                onMouseLeave={(e) => Object.assign(e.target.style, viewDetailsLinkStyle)}
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
