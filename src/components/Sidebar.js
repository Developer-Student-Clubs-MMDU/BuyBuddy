import React from 'react';
import { Box, VStack, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <Box width="250px" bg="gray.100" height="100vh" p={4} borderRight="1px" borderColor="gray.200">
      <VStack spacing={4} align="stretch" height="100%">
        <Link to="/">
          <Button colorScheme="teal" width="100%">+ New chat</Button>
        </Link>
        <Box flex="1" />
        <Button variant="ghost">Help</Button>
        <Button variant="ghost">My Account</Button>
        <Button variant="ghost">Log Out</Button>
      </VStack>
    </Box>
  );
}

export default Sidebar;