import React from 'react';
import { Box, Image, Text, Button, Flex, Stack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';

function ProductCard({ product, id }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/details/${product.id}`, { state: { product } });
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="md" onClick={handleClick} cursor="pointer">
      <Image src={product.image_url} alt={product.title} objectFit="cover" height="200px" width="100%" />
      <Stack p={4}>
        <Text fontWeight="bold" fontSize="xl">{product.title}</Text>
        <Text>{product.rating} ★</Text>
        <Text fontSize="2xl" fontWeight="bold">{product.price} Rupees</Text>
        {/* <Text fontSize="sm">Top Results From: {product.source}</Text> */}
        {/* <Text color={product.inStock ? 'green.500' : 'red.500'}>
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </Text> */}
        <Flex justify="space-between" align="center" mt={2}>
          <Link to={`/details/${id}`}>
            <Button colorScheme="teal">More Information</Button>
          </Link>
          <Button variant="outline">See Youtube Review</Button>
        </Flex>
      </Stack>
    </Box>
  );
}

export default ProductCard;