import React from 'react';
import { Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

function SearchBar({ onSearch }) {
  const [query, setQuery] = React.useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <InputGroup size="lg" maxWidth="600px" width="100%">
      <Input
        pr="4.5rem"
        type="text"
        placeholder="Search for your Product"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={handleSearch}>
          <SearchIcon />
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}

export default SearchBar;