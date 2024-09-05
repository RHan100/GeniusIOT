import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

// Registro de todos os componentes
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Game {
  created_at: string;
  score: number;
  player_id: number;
  mode: string; // Adicione a propriedade 'mode'
}

interface Player {
  id: number;
  name: string;
}

const PlayerHistoryChart: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<number | ''>('');
  const [selectedMode, setSelectedMode] = useState<string>(''); // Novo estado para o modo de jogo

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { data, error } = await supabase.from('games').select('*').order('created_at', { ascending: true });
        if (error) throw error;
        setGames(data || []);
      } catch (error) {
        console.error('Erro ao buscar jogos:', error);
      }
    };

    const fetchPlayers = async () => {
      try {
        const { data, error } = await supabase.from('players').select('*');
        if (error) throw error;
        setPlayers(data || []);
      } catch (error) {
        console.error('Erro ao buscar jogadores:', error);
      }
    };

    fetchGames();
    fetchPlayers();
  }, []);

  // Filtra os jogos dos últimos 30 dias
  const getRecentGames = (games: Game[]) => {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 30);

    return games.filter(game => {
      const gameDate = new Date(game.created_at);
      return gameDate >= pastDate && gameDate <= today;
    });
  };

  // Filtra os jogos do jogador selecionado e do modo de jogo selecionado
  const playerGames = getRecentGames(games)
    .filter(game => game.player_id === selectedPlayer && (selectedMode === '' || game.mode === selectedMode));

  // Ordena os jogos pela data
  playerGames.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  // Verifica se há dados para o gráfico
  const chartData = {
    labels: playerGames.length > 0 ? playerGames.map(game => new Date(game.created_at).toLocaleDateString()) : [],
    datasets: [{
      label: 'Pontuação',
      data: playerGames.length > 0 ? playerGames.map(game => game.score) : [],
      borderColor: 'rgba(75,192,192,1)',
      backgroundColor: 'rgba(75,192,192,0.2)',
      fill: true, // Preencher a área abaixo da linha
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Pontuação: ${tooltipItem.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Data',
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Pontuação',
        },
        min: 0,
        max: 30,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const handlePlayerChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedPlayer(Number(event.target.value)); // Garanta que o valor é convertido para número
  };

  const handleModeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedMode(event.target.value as string); // Atualiza o estado do modo de jogo
  };

  return (
    <div>
      <select onChange={handlePlayerChange} value={selectedPlayer}>
        <option value="">Selecione um Jogador</option>
        {players.map(player => (
          <option key={player.id} value={player.id}>{player.name}</option>
        ))}
      </select>
      
      <select onChange={handleModeChange} value={selectedMode}>
        <option value="">Todos os Modos</option>
        <option value="Normal">Normal</option>
        <option value="Aleatório">Aleatório</option>
        <option value="Hard">Hard</option>
      </select>
      
      {selectedPlayer && (
        <div style={{ height: '400px', width: '100%' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default PlayerHistoryChart;
