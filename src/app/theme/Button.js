import { defineStyleConfig } from '@chakra-ui/react';

const Button = defineStyleConfig({
  baseStyle: {
    borderRadius: '2px'
  },
  variants: {
    primary: {
      bgColor: 'primary.400',
      color: 'white'
    }
  }
});

export default Button;
