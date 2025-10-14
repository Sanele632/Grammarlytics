import {
  Container,
  Title,
  Select,
  Loader,
  Paper,
  Text,
  Center,
} from "@mantine/core";
import { useState } from "react";
import { useAsync } from "react-use";
import api from "../../config/axios";
import {
  ApiResponse,
  LearningResourceDto,
} from "../../constants/types";

export const LearningResourcesPage = () => {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  // --- API Call to GET all resources for the dropdown ---
  const {
    value: resources,
    loading: isLoadingResources,
    error,
  } = useAsync(async () => {
    const response = await api.get<ApiResponse<LearningResourceDto[]>>(
      "/api/learning-resources"
    );
    return response.data.data;
  }, []);

  const selectedResource = resources?.find(
    (res) => res.id.toString() === selectedTopicId
  );

  const dropdownData =
    resources?.map((res) => ({
      value: res.id.toString(),
      label: res.topic,
    })) ?? [];
    
  // --- Main Component View ---
  return (
    <Container mt="lg">
      <Title order={2}>Learning Resources</Title>
      <Text c="dimmed" mb="md">
        Choose a grammar rule to learn more about it.
      </Text>

      {/* --- Loading State for Dropdown --- */}
      {isLoadingResources && (
        <Center>
          <Loader />
        </Center>
      )}

      {error && (
        <Text color="red">Could not load learning resources.</Text>
      )}

      {resources && (
        <Select
          label="Choose a topic"
          placeholder="Select a grammar rule"
          data={dropdownData}
          value={selectedTopicId}
          onChange={setSelectedTopicId}
          searchable
          clearable
        />
      )}

      {selectedResource && (
        <Paper withBorder shadow="sm" p="lg" mt="lg">
          <Title order={3} mb="sm">{selectedResource.topic}</Title>
          <div dangerouslySetInnerHTML={{ __html: selectedResource.content }} />
        </Paper>
      )}
    </Container>
  );
};

