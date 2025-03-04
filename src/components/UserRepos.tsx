import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Text, Flex, Icon, Stack, Spinner, useToast } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

interface Repo {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
}

interface UserReposProps {
  username: string;
}

const UserRepos: React.FC<UserReposProps> = ({ username }) => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://api.github.com/users/${username}/repos`, {
          headers: {
            Authorization: `${process.env.REACT_APP_GITHUB_TOKEN}`,
          },
        });
        setRepos(response.data);
      } catch (error) {
        setError('Failed to fetch repositories');
        toast({
          title: 'Error',
          description: 'Failed to fetch repositories',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [username, toast]);

  return (
    <Box>
      {loading ? (
        <Flex justify="center" align="center" h="100px">
          <Spinner size="lg" />
        </Flex>
      ) : error ? (
        <Text color="red.500" textAlign="center">
          {error}
        </Text>
      ) : (
        <Stack spacing={4}>
          {repos.map((repo) => (
            <Box key={repo.id} p={4} borderWidth="1px" borderRadius="lg" boxShadow="md">
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="lg" fontWeight="bold">
                  {repo.name}
                </Text>
                <Flex alignItems="center">
                  <Icon as={StarIcon} color="yellow.400" />
                  <Text ml={2}>{repo.stargazers_count}</Text>
                </Flex>
              </Flex>
              <Text mt={2} color="gray.600">
                {repo.description || 'No description yet.'}
              </Text>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default UserRepos;