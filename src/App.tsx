import React, { useState } from 'react';
import { Container, Typography, Grid, Button, Dialog, DialogTitle, DialogContent, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import GameList from './components/GameList';
import PlayerSelect from './components/PlayerSelect';
import PlayerForm from './components/PlayerForm';
import PlayerHistoryChart from './components/PlayerHistoryChart';

// Definindo o tema
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Cor principal
    },
    secondary: {
      main: '#dc004e', // Cor secundária
    },
    background: {
      default: '#F5F5F5', // Cor de fundo da página
    },
  },
  typography: {
    h4: {
      fontWeight: 'bold',
    },
    h5: {
      fontWeight: 'bold',
    },
    h6: {
      fontWeight: 'bold',
    },
  },
});

const App: React.FC = () => {
  const [openPlayerForm, setOpenPlayerForm] = useState(false);
  const [openPlayerHistoryChart, setOpenPlayerHistoryChart] = useState(false);

  const handleOpenPlayerForm = () => setOpenPlayerForm(true);
  const handleClosePlayerForm = () => setOpenPlayerForm(false);

  const handleOpenPlayerHistoryChart = () => setOpenPlayerHistoryChart(true);
  const handleClosePlayerHistoryChart = () => setOpenPlayerHistoryChart(false);

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{
        backgroundColor: theme => theme.palette.background.default, // Usa a cor secundária do tema
        padding: 8, // Ajusta o padding conforme necessário
      }}>
        <Typography variant="h4" gutterBottom>
          Jogo da Memória das Cores
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <GameList />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              Registrar jogadores nos jogos
            </Typography>
            <Typography variant="h6" gutterBottom>
              Caso o jogador não esteja na lista, utilize o "Cadastro de Jogadores"
            </Typography>
            <PlayerSelect />
            <Typography variant="h5" gutterBottom sx={{ marginTop: 8 }}>
              Cadastrar Novo Jogador
            </Typography>
            <Button variant="contained" color="secondary" onClick={handleOpenPlayerForm}>
              Cadastrar
            </Button>
            <Dialog open={openPlayerForm} onClose={handleClosePlayerForm}>
              <DialogTitle>Cadastro de Jogadores</DialogTitle>
              <DialogContent>
                <PlayerForm />
              </DialogContent>
            </Dialog>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              Gráfico de Pontuação x Data
            </Typography>
            <Button variant="contained" color="secondary" onClick={handleOpenPlayerHistoryChart}>
              Ver Gráfico
            </Button>
            <Dialog open={openPlayerHistoryChart} onClose={handleClosePlayerHistoryChart}>
              <DialogTitle>Gráfico de Pontuação x Data</DialogTitle>
              <DialogContent>
                <PlayerHistoryChart />
              </DialogContent>
            </Dialog>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default App;
