// Next
import Link from 'next/link';
import { useRouter } from 'next/router';

// Next-Auth
import { signOut } from 'next-auth/react';

// MUI
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';

const Navbar = () => {
  const router = useRouter();

  return (
    <AppBar component="nav" sx={{ position: 'relative' }}>
      <Toolbar>
        <List sx={{ display: 'flex', marginLeft: 'auto' }} disablePadding>
          <ListItem sx={{ paddingTop: 0, paddingBottom: 0 }}>
            <Link href="/students" passHref>
              <ListItemButton selected={router.pathname === '/students'}>Students</ListItemButton>
            </Link>
          </ListItem>
          <ListItem sx={{ paddingTop: 0, paddingBottom: 0 }}>
            <Link href="/invoice" passHref>
              <ListItemButton selected={router.pathname === '/invoice'}>Invoice</ListItemButton>
            </Link>
          </ListItem>
          <ListItem sx={{ paddingTop: 0, paddingBottom: 0 }}>
            <Button sx={{ minWidth: 90 }} onClick={() => signOut({ callbackUrl: '/' })}>
              Sign Out
            </Button>
          </ListItem>
        </List>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
