// Next
import { NextPage } from 'next';

// Next Auth
import { useSession } from 'next-auth/react';

// MUI
import Container from '@mui/material/Container';

// Components
import Navbar from '../components/Navbar';

const Email: NextPage = () => {
  const { data: session, status } = useSession({ required: true });

  return (
    <div>
      <Navbar />
      <Container sx={{ paddingTop: '100px', paddingBottom: '100px' }}>
        <h1>Email Page</h1>
      </Container>
    </div>
  );
};

export default Email;
