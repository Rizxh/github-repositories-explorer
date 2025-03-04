import React, { useState } from 'react';
import axios from 'axios';
import UserRepos from './UserRepos';
import { Box, Button, Input, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Text, useToast } from '@chakra-ui/react';

interface User {
  id: number;
  login: string;
  avatar_url: string;
}

const SearchUser: React.FC = () => {
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const handleSearch = async () => {
    if (!username) {
      toast({
        title: 'Error',
        description: 'Please enter a username',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://api.github.com/search/users?q=${username}`, {
        headers: {
          Authorization: `${process.env.REACT_APP_GITHUB_TOKEN}`,
        },
      });
      console.log('API Response:', response.data);
      setUsers(response.data.items);
    } catch (error) {
      console.error('API Error:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          setError('Rate limit exceeded. Please try again later.');
        } else {
          setError('Failed to fetch users. Please check your network or Github token.');
        }
      } else {
        setError('An unexpected error occurred.');
      }
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="600px" mx="auto" p={4}>
      <Box py={4}>
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
          GitHub Repositories Explorer
        </Text>
      </Box>
      <Box>
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </Box>
      <Box mt={4}>
        <Button onClick={handleSearch} disabled={loading} w="100%" colorScheme="blue">
          {loading ? 'Searching...' : 'Search'}
        </Button>

        {error && <Text color="red.500" mt={2}>{error}</Text>}

        <Accordion allowToggle mt={4}>
          {users.map((user) => (
            <AccordionItem key={user.id}>
              <h2>
                <AccordionButton onClick={() => setSelectedUser(user.login)}>
                  <Box flex="1" textAlign="left">
                    {user.login}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                {selectedUser === user.login && <UserRepos username={user.login} />}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Box>
    </Box>
  );
};

export default SearchUser;