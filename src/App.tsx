import React from 'react';
import SearchUser from './components/SearchUser';
import { Box } from '@chakra-ui/react';

const App: React.FC = () => {
  return (
    <Box className="App">
      <SearchUser />
    </Box>
  );
};

export default App;