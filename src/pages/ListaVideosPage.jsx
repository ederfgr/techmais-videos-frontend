import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Grid,
  Dialog,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from '../api';
import ReactPlayer from 'react-player';

const ListaVideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState('');
  const [topicos, setTopicos] = useState([]);
  const [selectedTopico, setSelectedTopico] = useState('');
  const [selectedLang, setSelectedLang] = useState('pt');
  const [videoSelecionado, setVideoSelecionado] = useState(null);

  useEffect(() => {
    fetchVideos();
    fetchTopicos();
  }, [selectedLang]);

  const fetchVideos = async () => {
    const res = await axios.get('/videos', {
      params: {
        lang: selectedLang,
        search,
        topico: selectedTopico,
      },
    });
    setVideos(res.data);
  };

  const fetchTopicos = async () => {
    const res = await axios.get('/topicos');
    setTopicos(res.data);
  };

  const categorias = {
    SEMINARIO: 'Classes',
    SERMAO: 'Sermons',
  };

  const groupedVideos = videos.reduce((acc, video) => {
    acc[video.categoria] = acc[video.categoria] || [];
    acc[video.categoria].push(video);
    return acc;
  }, {});

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" mb={4} flexWrap="wrap" gap={2}>
        <TextField
          label="Buscar vídeos"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onBlur={fetchVideos}
          style={{ minWidth: 200 }}
        />
        <FormControl variant="outlined" style={{ minWidth: 200 }}>
          <InputLabel>Idioma</InputLabel>
          <Select
            label="Idioma"
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
          >
            <MenuItem value="pt"><span className="fi fi-br" style={{ marginRight: 8 }}></span>
              Português Brasil
            </MenuItem>
            <MenuItem value="en"><span className="fi fi-us" style={{ marginRight: 8 }}></span> Inglês</MenuItem>
            <MenuItem value="tr"><span className="fi fi-tr" style={{ marginRight: 8 }}></span> Turco</MenuItem>
            <MenuItem value="ar"><span className="fi fi-sa" style={{ marginRight: 8 }}></span> Árabe</MenuItem>
            <MenuItem value="fa"><span className="fi fi-ir" style={{ marginRight: 8 }}></span> Persa</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" style={{ minWidth: 200 }}>
          <InputLabel>Filtrar por tópico</InputLabel>
          <Select
            label="Filtrar por tópico"
            value={selectedTopico}
            onChange={(e) => setSelectedTopico(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            {topicos.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {t.traducoes?.[selectedLang] || t.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {Object.entries(groupedVideos).map(([categoria, vids]) => (
        <Box key={categoria} mb={6}>
          <Typography variant="h5" gutterBottom>
            {categorias[categoria] || categoria}
          </Typography>
          <Grid container spacing={2} wrap="nowrap" style={{ overflowX: 'auto', flexWrap: 'nowrap', paddingBottom: 8 }}>
            {vids.map((video) => (
              <Grid item key={video.id} style={{ minWidth: 300 }}>
                <Card>
                  <CardMedia
                    component="img"
                    height="180"
                    image={`https://img.youtube.com/vi/${video.link.split('v=')[1]}/hqdefault.jpg`}
                    alt={video.titulo}
                    onClick={() => setVideoSelecionado(video)}
                    style={{ cursor: 'pointer' }}
                  />
                  <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="primary"
                    gutterBottom
                    sx={{ minHeight: '3rem' }} // mantém altura uniforme
                    >
                    {video.titulo}
                    </Typography>

                    <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                    {video.topicos.map((t) => (
                        <Chip
                        key={t.id}
                        label={t.traducoes?.[selectedLang] || t.nome}
                        variant="filled"
                        color="secondary"
                        size="small"
                        sx={{ fontSize: '0.75rem' }}
                        />
                    ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      <Dialog
        open={!!videoSelecionado}
        onClose={() => setVideoSelecionado(null)}
        maxWidth="md"
        fullWidth
        scroll="body" // evita scroll interno
        PaperProps={{
            style: {
            overflow: 'hidden', // remove scroll extra
            backgroundColor: 'black',
            },
        }}
        >
        <Box position="relative" paddingTop="56.25%">
            <IconButton
            onClick={() => setVideoSelecionado(null)}
            style={{ position: 'absolute', top: 8, right: 8, color: 'white', zIndex: 10 }}
            aria-label="fechar"
            >
            <CloseIcon />
            </IconButton>

            {videoSelecionado && (
            <ReactPlayer
                url={videoSelecionado.link}
                controls
                playing
                width="100%"
                height="100%"
                style={{ position: 'absolute', top: 0, left: 0 }}
            />
            )}
        </Box>
      </Dialog>
    </Box>
  );
};

export default ListaVideosPage;
