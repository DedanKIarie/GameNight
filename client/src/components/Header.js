import React from "react";
import { useNavigate, Link } from 'react-router-dom';

function Header({ player, onLogout }) {
  const navigate = useNavigate();

  const headerStyle = {
    backgroundColor: '#2c3e50',
    color: 'white',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    padding: '15px 25px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: '"Roboto", sans-serif',
    borderBottom: '3px solid #3498db',
  };

  const titleStyle = {
    fontSize: '2em',
    fontWeight: 'bold',
    margin: 0,
    fontFamily: '"Montserrat", sans-serif',
    letterSpacing: '1px',
  };

  const linkStyle = {
    color: '#ecf0f1',
    textDecoration: 'none',
    fontSize: '1.1em',
    padding: '10px 15px',
    borderRadius: '6px',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    backgroundColor: 'transparent',
  };

  const linkHoverStyle = {
    backgroundColor: '#3498db',
    color: 'white',
  };

  const navStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '25px',
  };

  const welcomeMessageStyle = {
    fontSize: '1.1em',
    marginRight: '15px',
    color: '#c0c0c0',
  };

  const logoutButtonStyle = {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1.05em',
    transition: 'background-color 0.3s ease',
  };

  const logoutButtonHoverStyle = {
    backgroundColor: '#c0392b',
  };

  const loginSignupButtonStyle = {
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1.05em',
    transition: 'background-color 0.3s ease',
  };

  const loginSignupButtonHoverStyle = {
    backgroundColor: '#27ae60',
  };

  const handleLogoutClick = () => {
    fetch("https://gamenight-backend-a56o.onrender.com/logout", {
      method: "DELETE",
    }).then(() => {
      onLogout();
      navigate("/");
    });
  };

  return (
    <header style={headerStyle}>
      <div style={titleStyle}>
        <Link
          to="/"
          style={linkStyle}
          onMouseEnter={(e) => Object.assign(e.target.style, linkHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.target.style, linkStyle)}
        >
          BoardGameNight
        </Link>
      </div>
      <nav style={navStyle}>
        <Link
          to="/games"
          style={linkStyle}
          onMouseEnter={(e) => Object.assign(e.target.style, linkHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.target.style, linkStyle)}
        >
          Games
        </Link>
        <Link
          to="/gamenights"
          style={linkStyle}
          onMouseEnter={(e) => Object.assign(e.target.style, linkHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.target.style, linkStyle)}
        >
          Game Nights
        </Link>
        <Link
          to="/friends"
          style={linkStyle}
          onMouseEnter={(e) => Object.assign(e.target.style, linkHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.target.style, linkStyle)}
        >
          Friends
        </Link>
        {player ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={welcomeMessageStyle}>Welcome, {player.username}!</span>
            <button
              onClick={handleLogoutClick}
              style={logoutButtonStyle}
              onMouseEnter={(e) => Object.assign(e.target.style, logoutButtonHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.target.style, logoutButtonStyle)}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login">
            <button
              style={loginSignupButtonStyle}
              onMouseEnter={(e) => Object.assign(e.target.style, loginSignupButtonHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.target.style, loginSignupButtonStyle)}
            >
              Login/Sign Up
            </button>
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
