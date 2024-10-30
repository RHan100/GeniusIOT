import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import '../PlayerHistoryChart.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface Game {
  created_at: string;
  score: number;
  player_id: number;
  mode: string;
}

interface Player {
  id: number;
  name: string;
}

const PlayerHistoryChart: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<number | ''>('');
  const [selectedMode, setSelectedMode] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [isAllTime, setIsAllTime] = useState<boolean>(false); // Estado para controlar a opção "todo período"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gamesData, playersData] = await Promise.all([
          supabase.from('games').select('*').order('created_at', { ascending: true }),
          supabase.from('players').select('*'),
        ]);

        if (gamesData.error) throw gamesData.error;
        if (playersData.error) throw playersData.error;

        setGames(gamesData.data || []);
        setPlayers((playersData.data || []).sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        setError('Erro ao buscar dados. Tente novamente mais tarde.');
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const validateInputs = (): boolean => {
      if (selectedPlayer === '') {
        setValidationError('Por favor, selecione um jogador.');
        return false;
      }
      if (!isAllTime && (!startDate || !endDate)) {
        setValidationError('Por favor, forneça as datas de início e fim.');
        return false;
      }
      if (!isAllTime && new Date(startDate) > new Date(endDate)) {
        setValidationError('A data inicial deve ser anterior à data final.');
        return false;
      }
      setValidationError(''); // Limpa a mensagem de erro se a validação passar
      return true;
    };

    if (validateInputs()) {
      const filtered = games.filter(game => {
        const gameDate = new Date(game.created_at);
        const isWithinDateRange = isAllTime || (gameDate >= new Date(startDate) && gameDate <= new Date(endDate));

        return (
          isWithinDateRange &&
          game.player_id === selectedPlayer &&
          (selectedMode === '' || game.mode === selectedMode)
        );
      });
      setFilteredGames(filtered);
    } else {
      setFilteredGames([]); // Limpa os jogos filtrados se a validação falhar
    }
  }, [games, selectedPlayer, selectedMode, startDate, endDate, isAllTime]);

  const groupGamesByDate = (games: Game[]) =>
    games.reduce((acc, { created_at, score }) => {
      const date = new Date(created_at).toLocaleDateString('pt-BR');
      if (!acc[date]) acc[date] = { totalScore: 0, gamesCount: 0 };
      acc[date].totalScore += score;
      acc[date].gamesCount += 1;
      return acc;
    }, {} as Record<string, { totalScore: number; gamesCount: number }>);

  const groupedData = groupGamesByDate(filteredGames);

  const calculateAccumulatedScores = (groupedData: Record<string, { totalScore: number; gamesCount: number }>) =>
    Object.values(groupedData).reduce((acc, { totalScore }, i) => {
      acc.push((acc[i - 1] || 0) + totalScore);
      return acc;
    }, [] as number[]);

  const accumulatedScores = calculateAccumulatedScores(groupedData);

  const chartData = {
    labels: Object.keys(groupedData),
    datasets: [
      {
        label: 'Pontuação Média Diária',
        data: Object.values(groupedData).map(({ totalScore, gamesCount }) => totalScore / gamesCount),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
      },
      {
        label: 'Pontuação Acumulada',
        data: accumulatedScores,
        borderColor: 'rgba(255,99,132,1)',
        backgroundColor: 'rgba(255,99,132,0.2)',
        fill: false,
        borderDash: [5, 5],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: {
        callbacks: {
          label: tooltipItem => {
            const { totalScore, gamesCount } = Object.values(groupedData)[tooltipItem.dataIndex];
            return [
              `Pontuação Média: ${(totalScore / gamesCount).toFixed(2)}`,
              `Total de Jogos: ${gamesCount}`,
              `Pontuação Total: ${totalScore}`,
            ];
          },
        },
      },
    },
    scales: {
      x: { title: { display: true, text: 'Data' }, ticks: { maxTicksLimit: 5, font: { size: 10 } } },
      y: {
        title: { display: true, text: 'Pontuação Média' },
        min: 0,
        suggestedMax: Math.max(...Object.values(groupedData).map(({ totalScore, gamesCount }) => totalScore / gamesCount)) + 1,
        ticks: { stepSize: 1 },
      },
    },
  };

  const totalScore = Object.values(groupedData).reduce((acc, { totalScore }) => acc + totalScore, 0);
  const totalGames = filteredGames.length;
  const averageScore = totalGames > 0 ? (totalScore / totalGames).toFixed(2) : '0';

  const handleReset = () => {
    setSelectedPlayer('');
    setSelectedMode('');
    setStartDate('');
    setEndDate('');
    setIsAllTime(false); // Reseta a opção de "todo período"
    setValidationError('');
    setFilteredGames([]); // Limpa os jogos filtrados
  };

  const PlayerSelection: React.FC = () => (
    <div className="select-container">
      <div className="select-field">
        <label htmlFor="playerSelect">Jogador:</label>
        <select
          id="playerSelect"
          onChange={e => {
            setSelectedPlayer(Number(e.target.value));
            setFilteredGames([]); // Limpa os jogos filtrados ao mudar o jogador
          }}
          value={selectedPlayer}
        >
          <option value="">Selecione um Jogador</option>
          {players.map(player => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
      </div>
      <div className="select-field">
        <label htmlFor="modeSelect">Modo:</label>
        <select
          id="modeSelect"
          onChange={e => setSelectedMode(e.target.value)}
          value={selectedMode}
        >
          <option value="Aleatório">Aleatório</option>
          <option value="Normal">Normal</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
    </div>
  );

  const DateFilter: React.FC = () => (
    <div className="date-filter">
      {!isAllTime && (
        <>
          <div className="date-field">
            <label htmlFor="startDate">Data Inicial:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={e => {
                setStartDate(e.target.value);
              }}
            />
          </div>
          <div className="date-field">
            <label htmlFor="endDate">Data Final:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={e => {
                setEndDate(e.target.value);
              }}
            />
          </div>
        </>
      )}
      <div className="date-field">
        <label>
          <input
            type="checkbox"
            checked={isAllTime}
            onChange={e => {
              setIsAllTime(e.target.checked);
              if (e.target.checked) {
                setStartDate(''); // Limpa as datas ao selecionar "todo período"
                setEndDate('');
              }
            }}
          />
          Todo Período
        </label>
      </div>
    </div>
  );

  return (
    <div className="player-history-chart">
      {error && <p className="error-message">{error}</p>}

      <PlayerSelection />
      <DateFilter />

      {validationError && (
        <div className="error-container">
          <p className="error-message">{validationError}</p>
        </div>
      )}

      {selectedPlayer && (isAllTime || (startDate && endDate)) ? (
        <>
          {filteredGames.length > 0 && (
            <div className="statistics">
              <p>Total de Jogos: {totalGames}</p>
              <p>Pontuação Média Geral: {averageScore}</p>
            </div>
          )}
          {filteredGames.length > 0 ? (
            <div style={{ height: '400px', width: '100%' }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          ) : (
            <div className="no-data">
              <p>Jogador não possui dados recentes para exibir.</p>
              <button onClick={handleReset}>Redefinir Seleção</button>
            </div>
          )}
        </>
      ) : (
        <p>Selecione um jogador e defina as datas para visualizar os dados.</p>
      )}
    </div>
  );
};

export default PlayerHistoryChart;
