import { defineStyleConfig } from '@chakra-ui/react';

const Button = defineStyleConfig({
  baseStyle: {
    borderRadius: '2px'
  },
  variants: {
    primary: {
      bgColor: 'primary.400',
      color: 'white',
      _hover: {
        _disabled: {
          backgroundColor: 'primary.400',
          color: 'white',
          opacity: 0.4
        }
      },
    },
    outline: {
      color: 'primary.400',
      borderColor: 'primary.400'
    },
    ghost: {
      color: 'primary.400',
    }
  }
});

export default Button;
