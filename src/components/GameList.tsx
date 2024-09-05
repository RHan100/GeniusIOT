import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface Game {
  id: number;
  created_at: Date;
  score: number;
  player_id: number;
}

interface Player {
  id: number;
  name: string;
}

const GameList: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      const { data: gamesData } = await supabase.from('games').select('*');
      setGames(gamesData || []);
    };

    const fetchPlayers = async () => {
      const { data: playersData } = await supabase.from('players').select('*');
      setPlayers(playersData || []);
    };

    fetchGames();
    fetchPlayers();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Jogo</TableCell>
            <TableCell>Data e hora do jogo</TableCell>
            <TableCell>Pontuação</TableCell>
            <TableCell>Jogador</TableCell>
            <TableCell>Modo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {games.map((games) => {
            const playerName = players.find(player => player.id === games.player_id)?.name || 'Desconhecido';
            return (
              <TableRow key={games.id}>
                <TableCell>{games.id}</TableCell>
                {`${new Date(games.created_at).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })} ${new Date(games.created_at).toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`}
                <TableCell>{games.score}</TableCell>
                <TableCell>{playerName}</TableCell>
                <TableCell>{games.mode}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GameList;
