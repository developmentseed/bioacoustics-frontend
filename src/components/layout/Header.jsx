'use client';
import { AppBar, Container, Toolbar, Typography } from '@mui/material';
import { metadata } from '@/app/settings';
import HeaderMenuItem from './HeaderMenuItem';


export default function Header() {
  return (
    <AppBar position="static">
      <Container maxWidth="md">
        <Toolbar style={{ padding: 0 }}>
          <Typography
            variant="h6"
            color="inherit"
            component="div"
          >
            { metadata.title }
          </Typography>

          <HeaderMenuItem href="/upload">
            Upload
          </HeaderMenuItem>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
