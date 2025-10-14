import {
  Container,
  Text,
  Title,
  Box,
  Textarea,
  Button,
  Center,
  Group,
  Badge,
} from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import {
  IconCircleCheck,
  IconCircle,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";

const PURPLE = "#73268D";

export const DailyChallengePage = () => {
  const { classes } = useStyles();

  // ---- demo UI state (no backend) ----
  const [answer, setAnswer] = useState("");

  // Fake weekly progress just for visuals (Sun..Sat)
  // true = completed; false = not yet
  const week = [true, true, true, true, true, false, false];

  const niceDate = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      }),
    []
  );

  return (
    <Container className={classes.page}>
      <Title className={classes.title}>Daily Challenge</Title>

      <Box className={classes.weekCard}>
        <Group justify="space-between" className={classes.weekRow}>
          {["S", "M", "T", "W", "Th", "F", "S"].map((d, i) => (
            <Box key={d} className={classes.weekCell}>
              <Text className={classes.weekLabel}>{d}</Text>
              {week[i] ? (
                <IconCircleCheck size={18} />
              ) : (
                <IconCircle size={18} />
              )}
            </Box>
          ))}
        </Group>
      </Box>

      <Box className={classes.streakPill}>
        <Text size="sm" c="dimmed">
          Streak Count
        </Text>
        <Group gap={6} align="center">
          <Text fw={700}>6</Text>
          <Text>🔥</Text>
        </Group>
      </Box>

      <Text className={classes.dateText}>{niceDate}</Text>

      <Box className={classes.challengeBox}>
        <Text className={classes.label}>
          Correct this statement to keep your streak alive!
        </Text>

        <Textarea
          minRows={3}
          autosize
          value={
            "Each of the players on the team have practiced hard for the game."
          }
          readOnly
          styles={{
            input: { background: "#F7F7F7", border: "none" },
          }}
          className={classes.promptArea}
        />

        <Text className={classes.answerLabel}>Type your answer here</Text>
        <Textarea
          placeholder="Type your answer here"
          minRows={4}
          autosize
          value={answer}
          onChange={(e) => setAnswer(e.currentTarget.value)}
          styles={{ input: { background: "#F7F7F7", border: "none" } }}
          className={classes.answerArea}
        />

        <Center>
          <Button className={classes.button}>Check Answer</Button>
        </Center>
      </Box>
    </Container>
  );
};

const useStyles = createStyles(() => ({
  page: {
    background: "#fff",
    minHeight: "100vh",
    paddingTop: 28,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    color: PURPLE,
    fontWeight: 500,
    fontSize: 32,
    marginBottom: 16,
  },

  weekCard: {
    width: 730,
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0px 10px 30px rgba(0,0,0,0.08)",
    padding: "14px 18px",
    marginBottom: 18,
  },
  weekRow: {
    width: "100%",
  },
  weekCell: {
    width: 80,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  weekLabel: {
    color: "#000",
    opacity: 0.8,
    width: 24,
    textAlign: "center",
    marginRight: 4,
  },

  streakPill: {
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0px 6px 18px rgba(0,0,0,0.08)",
    padding: "10px 16px",
    textAlign: "center",
    marginBottom: 8,
  },

  dateText: {
    color: PURPLE,
    fontWeight: 700,
    marginBottom: 12,
  },

  challengeBox: {
    background: "transparent",
    width: 730,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  label: {
    color: PURPLE,
    fontWeight: 500,
    textAlign: "center",
    marginBottom: 6,
  },
  promptArea: {
    width: "100%",
    borderRadius: 18,
    boxShadow: "0px 18px 50px rgba(0,0,0,0.12)",
  },
  answerLabel: {
    color: PURPLE,
    fontWeight: 500,
    marginTop: 8,
    marginBottom: 4,
    alignSelf: "flex-start",
  },
  answerArea: {
    width: "100%",
    borderRadius: 18,
    boxShadow: "0px 18px 50px rgba(0,0,0,0.12)",
    marginBottom: 10,
  },
  button: {
    background: "#F7F7F7",
    color: PURPLE,
    borderRadius: 999,
    paddingInline: 28,
    height: 40,
    boxShadow: "0px 4px 25px rgba(0,0,0,0.25)",
    border: "none",
    "&:hover": { background: "#eee" },
  },
}));
