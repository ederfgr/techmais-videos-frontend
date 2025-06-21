import React, { useEffect, useState } from 'react';
import {
  Container, Typography, TextField, Button, ToggleButton, ToggleButtonGroup, Box, Chip, Grid, Snackbar, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const CadastroVideosPage = ({ language = 'pt' }) => {
  const [link, setLink] = useState('');
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [topicos, setTopicos] = useState([]);
  const [topicosSelecionados, setTopicosSelecionados] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopicos = async () => {
      try {
        const res = await api.get('/topicos');
        setTopicos(res.data);
      } catch (error) {
        console.error('Erro ao buscar tópicos', error);
      }
    };
    fetchTopicos();
  }, []);

  const renderTopicLabel = (topic) =>
    topic.traducoes?.[language] || topic.nome || 'Sem tradução';

  const handleTopicoToggle = (id) => {
    setTopicosSelecionados((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!link.trim() || !titulo.trim() || !categoria || topicosSelecionados.length === 0) {
      setErrorMessage('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      await api.post('/videos', {
        link,
        titulo,
        categoria, // Já está em caixa alta sem acento (ex: 'SERMAO')
        topicoIds: topicosSelecionados,
      });
      setSuccessMessage('Vídeo cadastrado com sucesso!');
      setLink('');
      setTitulo('');
      setCategoria('');
      setTopicosSelecionados([]);
    } catch (error) {
      setErrorMessage('Erro ao cadastrar vídeo.');
    }
  };

  const handleCancel = () => {
    navigate('/'); // ou limpar apenas: setLink(''), etc.
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Cadastro de Vídeos
      </Typography>

      <TextField
        fullWidth
        label="Título do vídeo"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Link do vídeo"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        margin="normal"
      />

      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        Categoria
      </Typography>
      <ToggleButtonGroup
        exclusive
        value={categoria}
        onChange={(e, newValue) => setCategoria(newValue)}
        fullWidth
        sx={{ mb: 2 }}
      >
        <ToggleButton value="SERMAO">Sermão</ToggleButton>
        <ToggleButton value="SEMINARIO">Seminário</ToggleButton>
      </ToggleButtonGroup>

      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        Tópicos
      </Typography>
      <Grid container spacing={1} sx={{ mb: 2 }}>
        {topicos.map((topico) => (
          <Grid item key={topico.id}>
            <Chip
              label={renderTopicLabel(topico)}
              onClick={() => handleTopicoToggle(topico.id)}
              color={topicosSelecionados.includes(topico.id) ? 'primary' : 'default'}
              variant={topicosSelecionados.includes(topico.id) ? 'filled' : 'outlined'}
              clickable
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Enviar
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleCancel}>
          Cancelar
        </Button>
      </Box>

      {/* Snackbar de sucesso */}
      <Snackbar open={!!successMessage} autoHideDuration={4000} onClose={() => setSuccessMessage('')}>
        <Alert severity="success" onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Snackbar de erro */}
      <Snackbar open={!!errorMessage} autoHideDuration={4000} onClose={() => setErrorMessage('')}>
        <Alert severity="error" onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CadastroVideosPage;
