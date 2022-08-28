// React
import { FC } from 'react';

// MUI
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

interface IProps {
  text: string;
}

const LoadingModal: FC<IProps> = ({ text }) => {
  return (
    <Box
      sx={{
        top: 0,
        left: 0,
        zIndex: 1301,
        background: 'rgba(10, 10, 10, 0.8)',
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography sx={{ mb: '1rem', fontSize: '16px' }}>{text}</Typography>
        <CircularProgress />
      </Box>
    </Box>
  );
};

export default LoadingModal;
