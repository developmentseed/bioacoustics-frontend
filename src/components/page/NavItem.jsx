import T from 'prop-types';
import { Box } from '@chakra-ui/react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavItem ({ href, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li>
      <NextLink href={href}>
        <Box
          color={isActive ? 'primary.400' : 'neutral.400'}
          textDecoration={isActive ? 'underline' : 'none'}
          textDecorationThickness="2px"
        >
          {children}
        </Box>
      </NextLink>
    </li>
  );
}

NavItem.propTypes = {
  href: T.string.isRequired,
  children: T.node.isRequired
};
