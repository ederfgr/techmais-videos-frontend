// src/pages/ListaVideosPage.js

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
import { translations } from '../i18n';

const ListaVideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState('');
  const [topicos, setTopicos] = useState([]);
  const [selectedTopico, setSelectedTopico] = useState('');
  const [selectedLang, setSelectedLang] = useState('pt');
  const [videoSelecionado, setVideoSelecionado] = useState(null);

  const t = translations[selectedLang];

  useEffect(() => {
    fetchTopicos();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchVideos();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search, selectedTopico, selectedLang]);

  const fetchVideos = async () => {
    try {
      const res = await axios.get('/videos', {
        params: {
          lang: selectedLang,
          search,
          topico: selectedTopico,
        },
      });
      setVideos(res.data);
    } catch (error) {
      console.error('Erro ao buscar vídeos:', error);
    }
  };

  const fetchTopicos = async () => {
    try {
      const res = await axios.get('/topicos');
      setTopicos(res.data);
    } catch (error) {
      console.error('Erro ao buscar tópicos:', error);
    }
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
          label={t.search}
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ minWidth: 200 }}
        />
        <FormControl variant="outlined" style={{ minWidth: 200 }}>
          <InputLabel>{t.language}</InputLabel>
          <Select
            label={t.language}
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
          >
            <MenuItem value="pt"><span className="fi fi-br" style={{ marginRight: 8 }}></span> Português Brasil</MenuItem>
            <MenuItem value="en"><span className="fi fi-us" style={{ marginRight: 8 }}></span> English</MenuItem>
            <MenuItem value="tr"><span className="fi fi-tr" style={{ marginRight: 8 }}></span> Türkçe</MenuItem>
            <MenuItem value="ar"><span className="fi fi-sa" style={{ marginRight: 8 }}></span> العربية</MenuItem>
            <MenuItem value="fa"><span className="fi fi-ir" style={{ marginRight: 8 }}></span> فارسی</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" style={{ minWidth: 200 }}>
          <InputLabel>{t.filterTopic}</InputLabel>
          <Select
            label={t.filterTopic}
            value={selectedTopico}
            onChange={(e) => setSelectedTopico(e.target.value)}
          >
            <MenuItem value="">{t.all}</MenuItem>
            {topicos.map((tpc) => (
              <MenuItem key={tpc.id} value={tpc.id}>
                {tpc.traducoes?.[selectedLang] || tpc.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {Object.entries(groupedVideos).map(([categoria, vids]) => (
        <Box key={categoria} mb={6}>
          <Typography variant="h5" gutterBottom>
            {t.categories[categoria] || categoria}
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
                      sx={{ minHeight: '3rem' }}
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
        scroll="body"
        PaperProps={{
          style: {
            overflow: 'hidden',
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
