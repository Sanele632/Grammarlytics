import { Box, Container, Text, SegmentedControl, Select, Textarea } from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const PURPLE = "#73268D";
const HOME = "/";
const PRACTICE = "/practice";

export const PracticePage = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const location = useLocation();

  const tabValue = location.pathname === PRACTICE ? "practice" : "correction";
  const handleSwitch = (val: string) =>
    navigate(val === "practice" ? PRACTICE : HOME);

  const [topic, setTopic] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");

  return (
    <Box className={classes.page}>
      <Container size={980} className={classes.main}>
        <Text className={classes.title}>Grammar Practice</Text>

        <SegmentedControl
          className={classes.segment}
          data={[
            { label: "Grammar Correction", value: "correction" },
            { label: "Grammar Practice", value: "practice" },
          ]}
          value={tabValue}
          onChange={handleSwitch}
          radius="md"
        />

        <Text className={classes.sectionLabel}>
          What would you like to practice today, Joane?
        </Text>

        <Select
          className={classes.selectPill}
          placeholder="Choose a topic..."
          data={[
            "Commas",
            "Subject–Verb Agreement",
            "Pronouns",
            "Modifiers",
            "Parallelism",
            "Verb Tense",
          ]}
          value={topic}
          onChange={(v) => {
            setTopic(v);
            setPrompt(
              v
                ? "Each of the players on the team have practiced hard for the game."
                : ""
            );
          }}
        />

        <Text className={classes.sectionLabel} mt="sm">
          Correct this statement
        </Text>

        <Textarea
          className={classes.card}
          minRows={3}
          autosize
          value={prompt}
          onChange={(e) => setPrompt(e.currentTarget.value)}
          styles={{ input: { background: "#F7F7F7", border: "none" } }}
        />
      </Container>
    </Box>
  );
};

const useStyles = createStyles(() => ({
  page: { background: "#fff", minHeight: "100vh" },
  main: { paddingTop: 12, paddingBottom: 40 },
  title: {
    textAlign: "center",
    color: PURPLE,
    fontWeight: 300,
    fontSize: 40,
    margin: "12px 0",
  },
  segment: {
    width: 760,
    margin: "0 auto 18px auto",
    background: "#F7F7F7",
    borderRadius: 8,
    ".mantine-SegmentedControl-indicator": {
      background: "#fff",
      boxShadow: "0px 1px 2px rgba(0,0,0,0.05)",
      borderRadius: 6,
    },
    ".mantine-SegmentedControl-label": {
      color: PURPLE,
      fontWeight: 500,
      fontSize: 14,
    },
  },
  sectionLabel: {
    color: PURPLE,
    fontWeight: 500,
    fontSize: 16,
    marginTop: 4,
    marginBottom: 8,
  },
  card: {
    borderRadius: 24,
    boxShadow: "0px 4px 60px rgba(0,0,0,0.15)",
    padding: 10,
    textarea: { borderRadius: 24, padding: 16, fontSize: 14 },
  },
  selectPill: {
    maxWidth: 380,
    marginBottom: 8,
    ".mantine-Select-input": {
      background: "#F7F7F7",
      border: "none",
      height: 38,
      borderRadius: 999,
      paddingInline: 16,
      boxShadow: "0px 4px 25px rgba(0,0,0,0.15)",
    },
    ".mantine-Select-dropdown": { borderRadius: 12 },
  },
}));
