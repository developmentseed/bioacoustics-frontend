import { defineStyleConfig } from '@chakra-ui/react';

const Popover = defineStyleConfig({
  variants: {
    datepicker: {
      content: {
        width: [
          '305px',
          '305px',
          '600px',
          '600px'
        ],
      }
    }
  }
});

export default Popover;
