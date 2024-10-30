import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { TextField, Button, FormControl, FormHelperText, CircularProgress } from '@mui/material';

const PlayerForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null); // Limpar erro anterior
    setSuccess(null); // Limpar mensagem de sucesso anterior

    if (!name.trim()) {
      setError('O nome é obrigatório.');
      return;
    }

    setLoading(true); // Iniciar o carregamento

    const { data, error } = await supabase.from('players').insert([{ name: name.trim() }]);

    setLoading(false); // Parar o carregamento

    if (error) {
      setError('Erro ao cadastrar jogador.');
    } else {
      setSuccess('Jogador cadastrado com sucesso!');
      setName(''); // Limpar o campo de entrada após o sucesso
    }
  };

  return (
    <FormControl fullWidth component="form" onSubmit={handleSubmit}>
      <TextField
        label="Nome"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="dense"
        error={!!error}
        InputLabelProps={{
          style: { lineHeight: '1.5' },
        }}
      />
      {error && <FormHelperText error>{error}</FormHelperText>}
      {success && <FormHelperText sx={{ color: 'green' }}>{success}</FormHelperText>}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
        <Button type="submit" variant="contained" color="secondary" disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Cadastrar'}
        </Button>
      </div>
    </FormControl>
  );
};

export default PlayerForm;
