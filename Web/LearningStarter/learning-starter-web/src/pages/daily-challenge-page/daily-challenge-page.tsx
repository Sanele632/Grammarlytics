import {
  Card,
  Title,
  Text,
  TextInput,
  Button,
  Container,
  Group,
  Loader,
  Badge,
  Center,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useAsync, useAsyncFn } from "react-use";
import api from "../../config/axios";
import { ApiResponse, DailyChallengeDto } from "../../constants/types";

export const DailyChallengePage = () => {
  const [submissionResult, setSubmissionResult] =
    useState<SubmissionResult | null>(null);

  // --- API Call to GET Today's Challenge ---
  const {
    value: challenge,
    loading: isLoadingChallenge,
    error,
  } = useAsync(async () => {
    const response = await api.get<ApiResponse<DailyChallengeDto>>(
      "/api/daily-challenges/today"
    );
    return response.data.data;
  }, []);

  // --- API Call to POST User's Answer ---
  const [{ loading: isSubmitting }, submitAnswer] = useAsyncFn(
    async (values: { userAnswer: string }) => {
      if (!challenge) return;

      const response = await api.post<ApiResponse<SubmissionResult>>(
        `/api/daily-challenges/submit`,
        {
          challengeId: challenge.id,
          userAnswer: values.userAnswer,
        }
      );

      setSubmissionResult(response.data.data);

      notifications.show({
        title: response.data.data.wasCorrect
          ? "Correct!"
          : "Not quite!",
        message: response.data.data.wasCorrect
          ? `Your streak is now ${response.data.data.newStreakCount}!`
          : "Try again tomorrow.",
        color: response.data.data.wasCorrect ? "green" : "red",
        icon: response.data.data.wasCorrect ? <IconCheck /> : <IconX />,
      });

      return response.data;
    },
    [challenge]
  );

  const form = useForm({
    initialValues: {
      userAnswer: "",
    },
  });

  // --- Loading State ---
  if (isLoadingChallenge) {
    return (
      <Center style={{ height: "100%" }}>
        <Loader />
      </Center>
    );
  }

  // --- Error State ---
  if (error || !challenge) {
    return (
      <Center style={{ height: "100%" }}>
        <Text color="red">
          Could not load the challenge for today. Please try again later.
        </Text>
      </Center>
    );
  }

  // --- Main Component View ---
  return (
    <Container size="sm" mt="lg">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack align="center">
          <Title order={2}>Daily Challenge</Title>
          <Badge size="lg" variant="light" color="orange">
            Streak Count: {submissionResult?.newStreakCount ?? "..."} 🔥
          </Badge>
          <Text c="dimmed" fz="sm">
            {new Date().toLocaleDateString("en-US", { dateStyle: "long" })}
          </Text>
          <Text mt="md">
            Correct this statement to keep your streak alive!
          </Text>

          <Text c="dimmed" fs="italic" w="100%" p="xs" bg="gray.1">
            {challenge.incorrectSentence}
          </Text>

          <form
            onSubmit={form.onSubmit(submitAnswer)}
            style={{ width: "100%" }}
          >
            <Stack>
              <TextInput
                placeholder="Type your answer here"
                label="Your correction"
                required
                {...form.getInputProps("userAnswer")}
              />
              <Button type="submit" loading={isSubmitting} disabled={!!submissionResult}>
                Check Answer
              </Button>
            </Stack>
          </form>
        </Stack>
      </Card>
    </Container>
  );
};

interface SubmissionResult {
  wasCorrect: boolean;
  newStreakCount: number;
}

