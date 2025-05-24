import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import api from '../api';

export default function MFAPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('userId');

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleValidate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/auth/validate-mfa?userId=${userId}&code=${code}`);
      const token = res.data.accessToken;
      localStorage.setItem('token', token);
      navigate('/videos/cadastro'); 
    } catch (err) {
      setError('Código inválido ou expirado.');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Verificação MFA
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
          Insira o código de verificação enviado para seu e-mail.
        </Typography>
        <Box component="form" onSubmit={handleValidate} width="100%">
          <TextField
            label="Código MFA"
            variant="outlined"
            fullWidth
            margin="normal"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Verificar
          </Button>
        </Box>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}
