import React from 'react';
import { Box, Flex, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <Box className="bg-gray-100 py-4">
      <Flex justify="space-between" align="center" className="max-w-7xl mx-auto px-4">
        <Link to="/">
          <Button colorScheme="teal" className="hover:bg-teal-600 transition-colors duration-200">New Chat</Button>
        </Link>
      </Flex>
    </Box>
  );
}

export default Header;