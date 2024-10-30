import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { FormControl, InputLabel, Select, MenuItem, Button, FormHelperText } from '@mui/material';

interface Player {
  id: number;
  name: string;
}

interface Game {
  id: number;
}

const PlayerSelect: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<number | ''>('');
  const [selectedGame, setSelectedGame] = useState<number | ''>('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data } = await supabase.from('players').select('*');
      setPlayers(data || []);
    };

    const fetchGames = async () => {
      const { data } = await supabase.from('games').select('*');
      setGames(data || []);
    };

    fetchPlayers();
    fetchGames();
  }, []);

  const handleRegister = async () => {
    if (selectedPlayer && selectedGame) {
      const { data, error } = await supabase.from('games').update({ player_id: selectedPlayer }).eq('id', selectedGame);
      if (error) {
        setError('Erro ao registrar jogador.');
      } else {
        setSuccess('Jogador registrado com sucesso!');
        setSelectedPlayer('');
        setSelectedGame('');
      }
    }
  };

  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <FormControl fullWidth variant="outlined" style={{ marginTop: '16px' }}>
        <InputLabel id="player-select-label">Selecione um Jogador</InputLabel>
        <Select
          label="Selecione um Jogador"
          value={selectedPlayer}
          onChange={(e) => setSelectedPlayer(e.target.value as number)}
        >
          {players.map((player) => (
            <MenuItem key={player.id} value={player.id}>{player.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="game-select-label">Selecione um Jogo</InputLabel>
        <Select
          label="blablabla bl blablab"
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value as number)}
        >
          {games.map((game) => (
            <MenuItem key={game.id} value={game.id}>{`Jogo ${game.id}`}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {error && <FormHelperText error>{error}</FormHelperText>}
      {success && <FormHelperText>{success}</FormHelperText>}
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Button onClick={handleRegister} variant="contained" color="secondary">Registrar Jogador</Button>
      </div>
    </div>
  );
};

export default PlayerSelect;
