import React, { useState } from 'react';
import { Container, Typography, Grid, Button, Dialog, DialogTitle, DialogContent, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import GameList from './components/GameList';
// import PlayerSelect from './components/PlayerSelect';
import PlayerForm from './components/PlayerForm';
import PlayerHistoryChart from './components/PlayerHistoryChart';

// Definindo o tema
const theme = createTheme({
  palette: {
    primary: {
      main: '#000', // Cor principal
    },
    secondary: {
      main: '#dc004e', // Cor secundária
    },
    background: {
      default: '#fff', // Cor de fundo da página
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
  // const [openSelectPlayerForm, setOpenSelectPlayerForm] = useState(false);
  const [openPlayerHistoryChart, setOpenPlayerHistoryChart] = useState(false);

  const handleOpenPlayerForm = () => setOpenPlayerForm(true);
  const handleClosePlayerForm = () => setOpenPlayerForm(false);

  // const handleOpenSelectPlayerForm = () => setOpenSelectPlayerForm(true);
  // const handleCloseSelectPlayerForm = () => setOpenSelectPlayerForm(false);

  const handleOpenPlayerHistoryChart = () => setOpenPlayerHistoryChart(true);
  const handleClosePlayerHistoryChart = () => setOpenPlayerHistoryChart(false);

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{
        backgroundColor: theme => theme.palette.background.default, // Usa a cor secundária do tema
        padding: 6, // Ajusta o padding conforme necessário
      }}>
        <Typography color="secondary" variant="h4" align='center' gutterBottom>
          Jogo da Memória das Cores
        </Typography>

        <Typography color="primary" variant="h6" textAlign={'center'} gutterBottom>
          A plataforma tem como objetivo listar as informações gerais relacionadas com os resultados obtidos pelos jogadores ao participar de algum modo de jogo.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <GameList />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography color="secondary" variant="h4" textAlign={'center'} gutterBottom sx={{ marginTop: 5 }}>
              Cadastrar Novo Jogador
            </Typography>

            <Typography color="primary" variant="h6" textAlign={'center'} gutterBottom>
              Caso o jogador desejado não esteja cadastrado. Clique no botão "Cadastrar".
            </Typography>

            <div style={{ textAlign: 'center' }}>
              <Button variant="contained" color="secondary" onClick={handleOpenPlayerForm}>
                Cadastrar
              </Button>
            </div>

            <Dialog open={openPlayerForm} onClose={handleClosePlayerForm}>
              <DialogTitle sx={{ textAlign: 'center' }}>Cadastrar Jogador</DialogTitle>

              <DialogContent>
                <PlayerForm />
              </DialogContent>
            </Dialog>
          </Grid>

          {/*
          <Grid item xs={12} md={6}>
            <Typography color="secondary" variant="h4" textAlign={'center'} gutterBottom sx={{ marginTop: 5 }}>
              Registrar Jogadores nos Jogos
            </Typography>

            <Typography color="primary" variant="h6" textAlign={'center'} gutterBottom>
              Caso o jogador desejado ainda não esteja na lista, utilize o módulo "Cadastrar Novo Jogador".
            </Typography>

            <div style={{ textAlign: 'center' }}>
              <Button variant="contained" color="secondary" onClick={handleOpenSelectPlayerForm}>
                REGISTRAR
              </Button>
            </div>

            <Dialog open={openSelectPlayerForm} onClose={handleCloseSelectPlayerForm}>
              <DialogTitle sx={{ textAlign: 'center' }}>Registrar Jogadores</DialogTitle>
              <DialogContent>
                <PlayerSelect />
              </DialogContent>
            </Dialog>
          </Grid>
*/}

          <Grid item xs={12} md={6}>
            <Typography variant="h4" color="secondary" textAlign={'center'} gutterBottom sx={{ marginTop: 5 }}>
              Gráfico de Pontuação x Data
            </Typography>

            <Typography color="primary" variant="h6" textAlign={'center'} gutterBottom>
              Clique no botão "Criar" para selecionar as informações e gerar um resultado.
            </Typography>
            <div style={{ textAlign: 'center' }}>
              <Button variant="contained" color="secondary" onClick={handleOpenPlayerHistoryChart}>
                Criar
              </Button>
            </div>
            <Dialog open={openPlayerHistoryChart} onClose={handleClosePlayerHistoryChart}>
              <DialogTitle sx={{ textAlign: 'center' }}>Gráfico de Pontuação x Data</DialogTitle>
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
