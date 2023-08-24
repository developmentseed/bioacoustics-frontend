import { defineStyleConfig } from '@chakra-ui/react';

const Button = defineStyleConfig({
  baseStyle: {
    borderRadius: '2px'
  },
  variants: {
    primary: {
      bgColor: 'primary.400',
      color: 'white',
      _disabled: {
        backgroundColor: 'primary.400',
        color: 'white',
        opacity: 0.4
      },
      _hover: {
        backgroundColor: 'primary.300',
        color: 'white',
        opacity: 0.875
      },
    },
    outline: {
      color: 'primary.400',
      borderColor: 'primary.400',
      _hover: {
        backgroundColor: 'green.50',
        color: 'primary.300',
      },
    },
    ghost: {
      color: 'primary.400',
    }
  }
});

export default Button;
