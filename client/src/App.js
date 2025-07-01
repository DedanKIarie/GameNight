import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Header from "./components/Header";
import Login from "./components/Login";
import GameList from "./components/GameList";
import GameDetail from "./components/GameDetail";
import GameNightList from "./components/GameNightList";
import Friends from "./components/Friends";

function App() {
  const [player, setPlayer] = useState(null);
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch("https://gamenight-backend-a56o.onrender.com/check_session").then((r) => {
      if (r.ok) {
        if (r.status === 200) {
          r.json().then((player) => setPlayer(player));
        }
      }
    });

    fetch("https://gamenight-backend-a56o.onrender.com/games")
      .then((r) => r.json())
      .then(setGames)
      .catch(error => console.error("Error fetching initial games:", error));
  }, []);

  function handleLogin(loggedInPlayer) {
    setPlayer(loggedInPlayer);
  }

  function handleLogout() {
    setPlayer(null);
  }

  function handleAddGame(newGame) {
    setGames([...games, newGame]);
  }

  function handleUpdateGame(updatedGame) {
    const updatedGames = games.map(game =>
      game.id === updatedGame.id ? updatedGame : game
    );
    setGames(updatedGames);
  }

  function handleDeleteGame(deletedGameId) {
    const updatedGames = games.filter(game => game.id !== deletedGameId);
    setGames(updatedGames);
  }

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f0f2f5', fontFamily: '"Roboto", sans-serif' }}>
        <Header player={player} onLogout={handleLogout} />
        <main style={{ flexGrow: 1, padding: '20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <Routes>
            <Route path="/" element={<Home player={player} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/games" element={
                <GameList
                    games={games}
                    onAddGame={handleAddGame}
                />}
            />
            <Route path="/games/:id" element={
                <GameDetail
                    player={player}
                    onUpdateGame={handleUpdateGame}
                    onDeleteGame={handleDeleteGame}
                />}
            />
            <Route path="/gamenights" element={<GameNightList player={player} />} />
            <Route path="/friends" element={<Friends player={player} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
