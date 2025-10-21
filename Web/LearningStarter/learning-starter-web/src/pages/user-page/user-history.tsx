import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Title,
  Accordion,
  Card,
  Text,
  Box,
  Loader,
  Alert,
  Button,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { createStyles } from "@mantine/emotion";
import api from "../../config/axios";
import { ApiResponse } from "../../constants/types";

interface PracticeAttempt {
  prompt: string;
  answer: string;
  feedback: string;
  date: string;
}

interface PracticeTopicGroup {
  topic: string;
  attempts: PracticeAttempt[];
}

export const UserHistory = () => {
  const { classes } = useStyles();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<PracticeTopicGroup[]>([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Simulate loading delay
        await new Promise((r) => setTimeout(r, 800));

        // Mock data (replace this later with real API)
        const mockHistory: PracticeTopicGroup[] = [
          {
            topic: "Commas",
            attempts: [
              {
                prompt:
                  "After the game the players shook hands and left the field.",
                answer:
                  "After the game, the players shook hands and left the field.",
                feedback: "Correct! A comma should follow introductory phrases.",
                date: "2025-10-20T15:45:00",
              },
              {
                prompt: "When the teacher entered the room everyone became quiet.",
                answer:
                  "When the teacher entered the room, everyone became quiet.",
                feedback:
                  "Correct! Commas help separate dependent clauses from main ones.",
                date: "2025-10-18T09:22:00",
              },
            ],
          },
          {
            topic: "Subject–Verb Agreement",
            attempts: [
              {
                prompt: "Each of the players have a unique style.",
                answer: "Each of the players has a unique style.",
                feedback: "Correct — 'Each' is singular, so use 'has'.",
                date: "2025-10-19T10:10:00",
              },
            ],
          },
          {
            topic: "Verb Tense",
            attempts: [
              {
                prompt: "He run every morning before work.",
                answer: "He runs every morning before work.",
                feedback: "Good! The verb should agree with the subject in tense.",
                date: "2025-10-15T13:12:00",
              },
            ],
          },
        ];

        setHistory(mockHistory);
      } catch (err) {
        showNotification({
          message: "Error loading practice history.",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [id]);

  
  if (loading) {
    return (
      <Box className={classes.loaderWrapper}>
        <Loader />
      </Box>
    );
  }

  if (!history.length) {
    return (
      <Alert color="yellow">
        <Text>No practice history found yet.</Text>
      </Alert>
    );
  }

  return (
    <Container size="sm" className={classes.wrapper}>
      <Title order={3} ta="center" mb="md" c="purple.6">
        Your Grammar Practice History
      </Title>

      <Accordion variant="separated">
        {history.map((group) => (
          <Accordion.Item value={group.topic} key={group.topic}>
            <Accordion.Control>
              <Text fw={600}>{group.topic}</Text>
            </Accordion.Control>

            <Accordion.Panel>
              {group.attempts.map((a, i) => (
                <Card key={i} withBorder shadow="xs" mb="sm" radius="md">
                  <Text fw={500}>Prompt:</Text>
                  <Text mb="xs">{a.prompt}</Text>

                  <Text fw={500}>Your Answer:</Text>
                  <Text mb="xs">{a.answer}</Text>

                  <Text fw={500}>Feedback:</Text>
                  <Text mb="xs" c="green">
                    {a.feedback}
                  </Text>

                  <Text size="xs" c="dimmed">
                    {new Date(a.date).toLocaleString()}
                  </Text>
                </Card>
              ))}
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>

      <Button
        fullWidth
        mt="lg"
        variant="subtle"
        component={Link}
        to="/user"
        color="gray"
      >
        Back to Profile
      </Button>
    </Container>
  );
};

const useStyles = createStyles(() => ({
  wrapper: {
    paddingTop: "2rem",
    paddingBottom: "3rem",
  },
  loaderWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
  },
}));