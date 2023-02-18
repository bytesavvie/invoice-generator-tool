// React
import { useState } from 'react';

// Next
import Link from 'next/link';
import { useRouter } from 'next/router';

// Next-Auth
import { signOut } from 'next-auth/react';

// MUI
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const drawerWidth = 240;

const DrawerAppBar = () => {
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Invoice Generator
      </Typography>
      <Divider />
      <List>
        <ListItem disablePadding>
          <Link href="/students" passHref>
            <ListItemButton selected={router.pathname === '/students'} sx={{ textAlign: 'center' }}>
              <ListItemText primary="Students" />
            </ListItemButton>
          </Link>
        </ListItem>
        <ListItem disablePadding sx={{ textAlign: 'center' }}>
          <Link href="/invoice" passHref>
            <ListItemButton selected={router.pathname === '/invoice'} sx={{ textAlign: 'center' }}>
              <ListItemText primary="Invoice" />
            </ListItemButton>
          </Link>
        </ListItem>
        <ListItem disablePadding sx={{ textAlign: 'center' }}>
          <Link href="/email" passHref>
            <ListItemButton selected={router.pathname === '/invoice'} sx={{ textAlign: 'center' }}>
              <ListItemText primary="Email" />
            </ListItemButton>
          </Link>
        </ListItem>
        <ListItem disablePadding>
          <Button fullWidth sx={{ minWidth: 90 }} onClick={() => signOut({ callbackUrl: '/' })}>
            Sign Out
          </Button>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
            Invoice Generator
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <List sx={{ display: 'flex', marginLeft: 'auto' }} disablePadding>
              <ListItem sx={{ paddingTop: 0, paddingBottom: 0 }} disablePadding>
                <Link href="/students" passHref>
                  <ListItemButton selected={router.pathname === '/students'}>Students</ListItemButton>
                </Link>
              </ListItem>
              <ListItem sx={{ paddingTop: 0, paddingBottom: 0 }} disablePadding>
                <Link href="/invoice" passHref>
                  <ListItemButton selected={router.pathname === '/invoice'}>Invoice</ListItemButton>
                </Link>
              </ListItem>
              <ListItem sx={{ paddingTop: 0, paddingBottom: 0 }} disablePadding>
                <Link href="/email" passHref>
                  <ListItemButton selected={router.pathname === '/email'}>Email</ListItemButton>
                </Link>
              </ListItem>
              <ListItem sx={{ paddingTop: 0, paddingBottom: 0 }} disablePadding>
                <Button sx={{ minWidth: 90 }} onClick={() => signOut({ callbackUrl: '/' })}>
                  Sign Out
                </Button>
              </ListItem>
            </List>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};

export default DrawerAppBar;
