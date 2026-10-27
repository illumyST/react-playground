import { createToaster } from '@chakra-ui/react';

export const toaster = createToaster({
  placement: 'bottom-end',
  duration: 6000,
  max: 3,
});
