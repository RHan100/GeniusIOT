import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { TextField, Button, FormControl, InputLabel, FormHelperText } from '@mui/material';

const PlayerForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name) {
      setError('O nome é obrigatório.');
      return;
    }

    const { data, error } = await supabase.from('players').insert([{ name }]);

    if (error) {
      setError('Erro.');
    } else {
      setSuccess('Jogador cadastrado no jogo com sucesso!');
      setName('');
    }
  };

  return (
    <FormControl fullWidth>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nome do Jogador"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
        {error && <FormHelperText error>{error}</FormHelperText>}
        {success && <FormHelperText>{success}</FormHelperText>}
        <Button type="submit" variant="contained" color="secondary" sx={{ marginTop: 2 }}>
          Cadastrar Jogador
        </Button>
      </form>
    </FormControl>
  );
};

export default PlayerForm;
