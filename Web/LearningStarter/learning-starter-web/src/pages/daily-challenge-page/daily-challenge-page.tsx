import {
  Container,
  Text,
  Title,
  Box,
  Textarea,
  Button,
  Center,
  Group,
} from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import { IconCircleCheck, IconCircle } from "@tabler/icons-react";
import { useMemo, useState } from "react";

const PURPLE = "#73268D";

export const DailyChallengePage = () => {
  const { classes, cx } = useStyles();

  const [answer, setAnswer] = useState("");

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
                <IconCircleCheck className={classes.dotSuccess} size={18} />
              ) : (
                <IconCircle className={classes.dotIdle} size={18} />
              )}
            </Box>
          ))}
        </Group>
      </Box>

      <Box className={classes.streakPill}>
        <Text size="xs" c="dimmed">
          Streak Count
        </Text>
        <Group gap={6} align="center" justify="center" mt={4}>
          <Text fw={700}>6</Text>
          <Text>🔥</Text>
        </Group>
      </Box>

      <Text className={classes.dateText}>{niceDate}</Text>

      <Box className={classes.challengeWrap}>
        <Text className={classes.helperText}>
          Correct this statement to keep your streak alive!
        </Text>

        <Textarea
          minRows={3}
          autosize
          value={"Each of the players on the team have practiced hard for the game."}
          readOnly
          className={cx(classes.cardArea, classes.promptArea)}
          styles={{ input: { background: "#F7F7F7", border: "none" } }}
        />

        <Text className={classes.inputLabel}>Type your answer here</Text>

        <Textarea
          placeholder="Type your answer here"
          minRows={4}
          autosize
          value={answer}
          onChange={(e) => setAnswer(e.currentTarget.value)}
          className={cx(classes.cardArea, classes.answerArea)}
          styles={{ input: { background: "#F7F7F7", border: "none" } }}
        />

        <Center>
          <Button className={classes.pillBtn}>Check Answer</Button>
        </Center>
      </Box>
    </Container>
  );
};

const useStyles = createStyles(() => ({
  page: {
    background: "#fff",
    minHeight: "100vh",
    paddingTop: 24,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  title: {
    color: PURPLE,
    fontWeight: 500,
    fontSize: 32,
    marginBottom: 12,
  },

  weekCard: {
    width: 720,
    background: "#fff",
    borderRadius: 20,
    boxShadow: "0px 16px 42px rgba(0,0,0,0.10)",
    padding: "14px 20px",
    marginBottom: 18,
  },
  weekRow: { width: "100%" },
  weekCell: {
    width: 80,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  weekLabel: {
    color: "#000",
    opacity: 0.75,
    width: 24,
    textAlign: "center",
    marginRight: 6,
    fontWeight: 600,
  },
  dotSuccess: { color: "#27ae60" }, 
  dotIdle: { color: "#cfcfcf" },

  streakPill: {
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0px 10px 26px rgba(0,0,0,0.10)",
    padding: "10px 18px",
    textAlign: "center",
    marginBottom: 8,
    minWidth: 140,
  },
  dateText: {
    color: PURPLE,
    fontWeight: 700,
    marginBottom: 16,
  },

  challengeWrap: {
    width: 720,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  helperText: {
    color: PURPLE,
    fontWeight: 500,
    textAlign: "center",
    marginBottom: 12,
  },

  cardArea: {
    width: "100%",
    borderRadius: 20,
    boxShadow: "0px 22px 60px rgba(0,0,0,0.14)",
    textarea: { borderRadius: 20, padding: 16, fontSize: 14 },
  },
  promptArea: { marginBottom: 18 },
  inputLabel: {
    color: PURPLE,
    fontWeight: 500,
    margin: "4px 0 8px",
    alignSelf: "flex-start",
  },
  answerArea: { marginBottom: 14 },

  pillBtn: {
    background: "#F7F7F7",
    color: PURPLE,
    border: "none",
    height: 40,
    paddingInline: 28,
    borderRadius: 999,
    boxShadow: "0px 4px 25px rgba(0,0,0,0.25)",
    fontWeight: 600,
    letterSpacing: 0.2,
    "&:hover": { background: "#eee" },
  },
}));
