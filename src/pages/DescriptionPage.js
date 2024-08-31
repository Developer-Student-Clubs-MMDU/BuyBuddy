import { Box, VStack, SimpleGrid, Button, Flex, Spinner, Text } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import React, { useCallback, useEffect, useState } from 'react';

function DescriptionPage({state}) {
  const [query, setQuery] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const fetchData = useCallback(()=> {
    if(query) {
      setLoading(true);
      fetch('http://127.0.0.1:5000/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
        setError(null);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
    }
  }, [query]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    if(newQuery.trim()) {
      fetchData();
    }
  };

  return (
    <VStack spacing={8} align="stretch">
      <SearchBar onSearch={handleSearch} />

      {loading && (
        <Flex justifyContent="center" alignItems="center" mt={4}>
          <Spinner size="xl" />
        </Flex>
      )}

      {error && (
        <Flex justifyContent="center" alignItems="center" mt={4}>
          <Text color="red.500">Error: {error.message}</Text>
        </Flex>
      )}

      {!loading && !error && (
        <SimpleGrid columns={[1, null, 3]} spacing={10}>
          {data && Object.keys(data).length > 0 ? (
            Object.keys(data).map((key) => {
              const product = data[key];
              return (
                <ProductCard key={key} product={product} id={key} />
              );
            })
          ) : (
            <Flex justifyContent="center" alignItems="center">
              <Text>No products found.</Text>
            </Flex>
          )}
        </SimpleGrid>
      )}
    </VStack>
  );
}

export default DescriptionPage;