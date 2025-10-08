import {
  Container,
  Text,
  Box,
  SegmentedControl,
  Textarea,
  Group,
  Button,
  Select,
} from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import { useState } from "react";

const PURPLE = "#73268D";

export const LandingPage = () => {
  const { classes } = useStyles();

  const [inputText, setInputText] = useState("");
  const [tone, setTone] = useState<string | null>(null);

  const handleCorrectGrammar = () => {
    console.log("Correcting:", { inputText, tone });
  };

  return (
    <Box className={classes.page}>
      <Container size={980} className={classes.main}>
        <Text className={classes.title}>Let’s Get Started</Text>

        <SegmentedControl
          className={classes.segment}
          data={[
            { label: "Grammar Correction", value: "correction" },
            { label: "Grammar Practice", value: "practice" },
          ]}
          value="correction"
          onChange={() => {}}
          radius="md"
        />

        <Text className={classes.sectionLabel}>
          What can we correct for you today, Joane?
        </Text>

        <Textarea
          className={classes.card}
          minRows={8}
          autosize
          placeholder="Start writing here..."
          value={inputText}
          onChange={(e) => setInputText(e.currentTarget.value)}
          styles={{ input: { background: "#F7F7F7", border: "none" } }}
        />

        <Group justify="center" gap="lg" mt="md">
          <Button className={classes.pillBtn} onClick={handleCorrectGrammar}>
            Correct Grammar
          </Button>

          <Select
            className={`${classes.pillBtn} ${classes.selectBtn}`}
            placeholder="Choose Tone For Rephrasing:"
            data={["Neutral", "Formal", "Casual", "Academic", "Friendly"]}
            value={tone}
            onChange={setTone}
            rightSectionWidth={28}
            comboboxProps={{ shadow: "md" }}
          />
        </Group>
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

  pillBtn: {
    background: "#F7F7F7",
    color: PURPLE,
    border: "none",
    height: 42,
    paddingInline: 22,
    borderRadius: 999,
    boxShadow: "0px 4px 25px rgba(0,0,0,0.25)",
    fontWeight: 500,
    "&:hover": { background: "#eee" },
  },

  selectBtn: {
    ".mantine-Select-input": {
      background: "transparent",
      border: "none",
      height: 42,
      borderRadius: 999,
      textAlign: "left",
      color: PURPLE,
      fontWeight: 500,
      boxShadow: "none",
    },
    ".mantine-Select-rightSection": { pointerEvents: "none" },
  },
}));
