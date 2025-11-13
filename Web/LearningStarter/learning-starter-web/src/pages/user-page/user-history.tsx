import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { ApiResponse, PracticeAttemptGetDto, } from "../../constants/types";
import { useUser } from "../../authentication/use-auth";


interface PracticeTopicGroup {
  topic: string;
  attempts: PracticeAttemptGetDto[];
}

export const UserHistory = () => {
  const userContext = useUser();
  const { classes } = useStyles();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<PracticeTopicGroup[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);

        const response = await api.get<PracticeAttemptGetDto[]>(
          `/api/GrammarPractice/history/${userContext.id}`
        );

        const attempts = response.data || [];;

        console.log("response.data:", response.data);
        const grouped = attempts.reduce<PracticeTopicGroup[]>((acc, attempt) => {
          const existing = acc.find((g) => g.topic === attempt.topic);
          if (existing) {
            existing.attempts.push(attempt);
          } else {
            acc.push({
              topic: attempt.topic || "Unknown Topic",
              attempts: [attempt],
            });
          }
          return acc;
        }, []);

        setHistory(grouped);
      } catch (err) {
        console.error("Error loading practice history:", err);
        showNotification({
          message: "Error loading practice history.",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    };

    if (userContext?.id) {
      fetchHistory();
    }
  }, [userContext?.id]);
  
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