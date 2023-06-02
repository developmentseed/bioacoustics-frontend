import { defineStyleConfig } from '@chakra-ui/react';

const Button = defineStyleConfig({
  baseStyle: {
    borderRadius: '2px'
  },
  variants: {
    primary: {
      bgColor: 'primary.400',
      color: 'white'
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
