import T from 'prop-types';
import { Box } from '@chakra-ui/react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavItem ({ href, children }) {
  const pathname = usePathname();
  const isActive = pathname.slice(0, -1) === href;

  return (
    <li>
      <NextLink href={href}>
        <Box
          color={isActive ? 'primary.400' : 'neutral.400'}
          textDecoration={isActive ? 'underline' : 'none'}
          textDecorationThickness="2px"
          _hover={{
            opacity: 0.8,
            color: 'primary.400',
            transition: 'all 0.24s ease',
          }}
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
