import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
import Sidebar from './components/Sidebar';
import FrontPage from './pages/FrontPage';
import DescriptionPage from './pages/DescriptionPage';
import DetailsPage from './pages/DetailsPage';

function App() {
  return (
    <Router>
      <Flex>
        <Sidebar />
        <Box flex="1" p={4}>
          <Routes>
            <Route path="/" element={<FrontPage />} />
            <Route path="/description" element={<DescriptionPage />} />
            <Route path="/details/:id" element={<DetailsPage />} />
          </Routes>
        </Box>
      </Flex>
    </Router>
  );
}

export default App;