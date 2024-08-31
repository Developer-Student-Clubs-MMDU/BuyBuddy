import React from 'react';
import { Box, VStack, Heading, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';

function FrontPage() {
  const navigate = useNavigate();

  const handleSearch = (query) => {
    navigate(`/description?query=${query}`);
  };

  return (
    <Box height="calc(100vh - 32px)" display="flex" alignItems="center" justifyContent="center">
      <VStack spacing={8} align="center" justify="center">
        <Heading as="h1" size="2xl" textAlign="center">Ask Me Anything You want to Buy</Heading>
        <Text fontSize="xl" textAlign="center">Search For Anything and Get Everything</Text>
        <SearchBar onSearch={handleSearch} />
      </VStack>
    </Box>
  );
}

export default FrontPage;