'use client';
import { Container } from '@mui/material';

export default function Main({ children }) {
  return (
    <Container maxWidth="md" component="main">
      {children}
    </Container>
  );
}
