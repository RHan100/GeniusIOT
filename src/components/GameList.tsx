import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, Select, InputLabel, FormControl, Pagination, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

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
  const [sortOption, setSortOption] = useState<'date' | 'name'>('date');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchGames = async () => {
      const { data: gamesData } = await supabase.from('games').select('*');
      setGames(gamesData || []);
    };

    const fetchPlayers = async () => {
      const { data: playersData } = await supabase.from('players').select('*');
      // Ordenar os jogadores por nome antes de definir o estado
      const sortedPlayers = (playersData || []).sort((a, b) => a.name.localeCompare(b.name));
      setPlayers(sortedPlayers);
    };

    fetchGames();
    fetchPlayers();
  }, []);

  // Função para abrir o diálogo de confirmação
  const openConfirmDialog = (gameId: number, newPlayerId: number) => {
    setSelectedGameId(gameId);
    setSelectedPlayerId(newPlayerId);
    setDialogOpen(true);
  };

  // Função para confirmar a alteração do jogador
  const confirmPlayerChange = async () => {
    if (selectedGameId !== null && selectedPlayerId !== null) {
      const { error } = await supabase.from('games').update({ player_id: selectedPlayerId }).eq('id', selectedGameId);

      if (!error) {
        setGames((prevGames) =>
          prevGames.map((game) =>
            game.id === selectedGameId ? { ...game, player_id: selectedPlayerId } : game
          )
        );
      } else {
        console.error("Erro ao atualizar jogador:", error.message);
      }
    }
    setDialogOpen(false);
  };

  // Ordena os jogos com base na opção de ordenação selecionada
  const sortedGames = [...games].sort((a, b) => {
    if (sortOption === 'date') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else {
      const playerNameA = players.find(player => player.id === a.player_id)?.name || 'Desconhecido';
      const playerNameB = players.find(player => player.id === b.player_id)?.name || 'Desconhecido';
      return playerNameA.localeCompare(playerNameB);
    }
  });

  const paginatedGames = sortedGames.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(sortedGames.length / itemsPerPage);

  return (
    <div>
      <FormControl variant="outlined" fullWidth margin="normal">
        <InputLabel style={{ fontWeight: 'bold' }} id="sort-select-label">Ordenar por</InputLabel>
        <Select
          labelId="sort-select-label"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as 'date' | 'name')}
          label="Ordenar por"
        >
          <MenuItem value="date">Data e Hora Decrescente</MenuItem>
          <MenuItem value="name">Nome do Jogador</MenuItem>
        </Select>
      </FormControl>

      <TableContainer component={Paper} style={{ backgroundColor: '#f0f0f0' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Jogo</TableCell>
              <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Data e Hora do jogo</TableCell>
              <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Pontuação</TableCell>
              <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Jogador</TableCell>
              <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Modo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedGames.map((game) => (
              <TableRow key={game.id}>
                <TableCell>{game.id}</TableCell>
                <TableCell>{`${new Date(game.created_at).toLocaleDateString('pt-BR')} ${new Date(game.created_at).toLocaleTimeString('pt-BR')}`}</TableCell>
                <TableCell>{game.score}</TableCell>
                <TableCell>
                  <Select
                    value={game.player_id || ''}
                    onChange={(e) => openConfirmDialog(game.id, e.target.value as number)}
                    displayEmpty
                  >
                    <MenuItem value="">Desconhecido</MenuItem>
                    {players.map((player) => (
                      <MenuItem key={player.id} value={player.id}>
                        {player.name}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>{game.mode}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo de confirmação */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle sx={{ textAlign: 'center' }}>Confirmar Alteração de Jogador</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza de que deseja alterar o jogador para <strong>{players.find(player => player.id === selectedPlayerId)?.name || 'Desconhecido'}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={confirmPlayerChange} color="secondary" variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Controles de paginação */}
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(e, value) => setCurrentPage(value)}
        color="secondary"
        style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
      />
    </div>
  );
};

export default GameList;
