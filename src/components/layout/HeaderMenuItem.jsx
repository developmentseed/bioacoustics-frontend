import Link from 'next/link';
import { Button } from '@mui/material';

export default function HeaderMenuItem({ href, children}) {
  return (
    <Link href={href}>
      <Button component="div" variant="contained" disableElevation>{children}</Button>
    </Link>
  );
}
