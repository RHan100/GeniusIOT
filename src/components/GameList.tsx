import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, Select, InputLabel, FormControl, Pagination } from '@mui/material';

interface Game {
  id: number;
  created_at: string; // Usar string para manter o formato ISO vindo do banco
  score: number;
  player_id: number;
  mode: string;
}

interface Player {
  id: number;
  name: string;
}

const GameList: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [sortOption, setSortOption] = useState<'date' | 'name'>('date'); // Estado para a opção de ordenação
  const [currentPage, setCurrentPage] = useState<number>(1); // Estado para a página atual
  const itemsPerPage = 10; // Número de itens por página

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

  // Ordena os jogos com base na opção de ordenação selecionada: data ou ordem alfabética, Desconhecido primeiro
  const sortedGames = [...games].sort((a, b) => {
    if (sortOption === 'date') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else {
      const playerNameA = players.find(player => player.id === a.player_id)?.name || 'Desconhecido';
      const playerNameB = players.find(player => player.id === b.player_id)?.name || 'Desconhecido';
      return playerNameA.localeCompare(playerNameB);
    }
  });

  // Paginação
  const paginatedGames = sortedGames.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(sortedGames.length / itemsPerPage);

  const handleSortChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSortOption(event.target.value as 'date' | 'name');
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  return (
    <div>
      <FormControl variant="outlined" fullWidth margin="normal">
        <InputLabel id="sort-select-label">Ordenar por</InputLabel>
        <Select
          labelId="sort-select-label"
          value={sortOption}
          onChange={handleSortChange}
          label="Ordenar por"
        >
          <MenuItem value="date">Data e Hora (Mais recente primeiro)</MenuItem>
          <MenuItem value="name">Nome do Jogador (Alfabética)</MenuItem>
        </Select>
      </FormControl>
      
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
            {paginatedGames.map((game) => {
              const playerName = players.find(player => player.id === game.player_id)?.name || 'Desconhecido';
              return (
                <TableRow key={game.id}>
                  <TableCell>{game.id}</TableCell>
                  <TableCell>{`${new Date(game.created_at).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })} ${new Date(game.created_at).toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`}</TableCell>
                  <TableCell>{game.score}</TableCell>
                  <TableCell>{playerName}</TableCell>
                  <TableCell>{game.mode}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Controles de paginação */}
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="secondary"
        style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
      />
    </div>
  );
};

export default GameList;
