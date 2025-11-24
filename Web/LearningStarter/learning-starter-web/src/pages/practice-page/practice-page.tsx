import {
  Box,
  Container,
  Text,
  SegmentedControl,
  Select,
  Textarea,
  Group,
  Button,
  Loader,
  Alert,
} from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import { useNavigate, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { useUser } from "../../authentication/use-auth";

/** ========================
 *  CONFIG
 *  ======================== */
const API_BASE = (import.meta.env.VITE_API_BASE as string) ?? "";
const PURPLE = "#73268D";
const HOME = "/";
const PRACTICE = "/practice";

/** Backend item shape from /practice/generate */
type PracticeItem = {
  incorrect: string;
  corrected: string;
  mistakeType: string;
  explanation: string;
};

/** IMPROVED TOPICS - Most commonly tested grammar mistakes */
const TOPIC_OPTIONS = [
  { label: "Commas", value: "Commas" },
  { label: "Subject–Verb Agreement", value: "Subject–Verb Agreement" },
  { label: "Pronouns", value: "Pronouns" },
  { label: "Apostrophes", value: "Apostrophes" },
  { label: "Run-On Sentences", value: "Run-On Sentences" },
  { label: "Verb Tense", value: "Verb Tense" },
  { label: "Sentence Fragments", value: "Sentence Fragments" },
  { label: "Homophones", value: "Homophones" },
] as const;

function normalize(s: string): string {
  return s
    .trim()
    .replace(/\s*,\s*/g, ", ")
    .replace(/\s*;\s*/g, "; ")
    .replace(/\s*\.\s*$/g, ".")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function acceptableAlternatives(expected: string): string[] {
  const e = expected.trim();
  const alts = [e];
  // allow semicolon alternative for compound sentences
  const m = e.match(/^(.*),\s+(and|but|or|nor|for|so|yet)\s+(.*)$/i);
  if (m) {
    const left = m[1].replace(/\s*\.\s*$/, "");
    const right = m[3].replace(/^\s*/, "");
    alts.push(`${left}; ${right}.`);
  }
  return alts;
}

export const PracticePage = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useUser();

  const tabValue = location.pathname === PRACTICE ? "practice" : "correction";
  const handleSwitch = (val: string) =>
    navigate(val === "practice" ? PRACTICE : HOME);

  const [topic, setTopic] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [solution, setSolution] = useState("");
  const [keyItem, setKeyItem] = useState<PracticeItem | null>(null);
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const jsonHeaders = useMemo(() => ({ "Content-Type": "application/json" }), []);

  async function fetchPractice(topicKey: string): Promise<PracticeItem | null> {
    const res = await fetch('api/GrammarPractice/generate', {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({ topic: topicKey, level: "medium", n: 1 }),
    });
    if (!res.ok) throw new Error(`Practice API error ${res.status}`);
    const data = await res.json();
    return (data?.items?.[0] ?? null) as PracticeItem | null;
  }

  async function saveAttempt(attempt: {
    userId: number;
    topic: string;
    prompt: string;
    answer: string;
    feedback: string;
  }) {
    await fetch('api/GrammarPractice/save', {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(attempt),
    });
  }

  async function correctAnswerAPI(text: string): Promise<string> {
    const res = await fetch('api/GrammarPractice/correct', {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error(`Correct API error ${res.status}`);
    const data = await res.json();
    return String(data?.corrected_text ?? "");
  }

  const handleTopicChange = async (v: string | null) => {
    setTopic(v);
    setAnswer("");
    setSolution("");
    setKeyItem(null);
    setError(null);

    if (!v) {
      setPrompt("");
      return;
    }

    try {
      setLoadingPrompt(true);
      const item = await fetchPractice(v);
      setKeyItem(item);
      setPrompt(item?.incorrect ?? "");
      if (!item) setError("Couldn't get a practice sentence. Try again.");
    } catch (e: any) {
      setError(e?.message || "Failed to load practice sentence.");
      setPrompt("");
    } finally {
      setLoadingPrompt(false);
    }
  };

  const handleCheck = async () => {
    setError(null);
    setSolution("");

    if (!answer.trim()) {
      setSolution("Try writing an answer first 🙂");
      return;
    }

    const expected = keyItem?.corrected?.trim() ?? "";
    if (!expected) {
      setSolution("No expected solution loaded. Try generating a new sentence.");
      return;
    }

    setChecking(true);

    try {
      // ✅ 1. Check with backend corrector
      const backendCorr = await correctAnswerAPI(answer);

      const expSet = acceptableAlternatives(expected).map(normalize);
      const ok =
        expSet.includes(normalize(backendCorr)) ||
        expSet.includes(normalize(answer));

      const feedback =
        (ok ? "✅ Correct!\n\n" : "🟡 Not quite. One acceptable fix is:\n") +
        expected +
        (keyItem?.explanation ? `\n\n${keyItem.explanation}` : "");

      setSolution(feedback);

      await saveAttempt({
        userId: user.id,
        topic: topic!,
        prompt: keyItem?.incorrect ?? "",
        answer,
        feedback,
      });

    } catch (e: any) {
      // Fallback only – still show the result but do NOT save
      const expSet = acceptableAlternatives(expected).map(normalize);
      const ok = expSet.includes(normalize(answer));

      const feedback =
        (ok ? "✅ Correct!\n\n" : "🟡 Not quite. One acceptable fix is:\n") +
        expected +
        (keyItem?.explanation ? `\n\n${keyItem.explanation}` : "");

      setSolution(feedback);
      setError(e?.message || "Failed to check your answer (used fallback).");
    } finally {
      setChecking(false);
    }
  };

  const regeneratePrompt = async () => {
    if (!topic) return;
    await handleTopicChange(topic);
  };

  return (
    <Box className={classes.page}>
      <Container size={980} className={classes.main}>
        <Text className={classes.title}>Grammar Practice</Text>

        <Box style={{ display: "flex", justifyContent: "center" }}>
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
        </Box>

        {error && (
          <Alert color="red" mb="sm" variant="light">
            {error}
          </Alert>
        )}

        <Text className={classes.sectionLabel}>
          What would you like to practice today, {user?.firstName ?? "there"}?
        </Text>

        <Group justify="center" mb={4} gap="sm">
          <Select
            className={classes.selectPill}
            placeholder="Choose a topic..."
            data={TOPIC_OPTIONS}
            value={topic}
            onChange={handleTopicChange}
            searchable
            nothingFoundMessage="No topics"
          />
          <Button
            className={classes.pillBtn}
            onClick={regeneratePrompt}
            disabled={!topic || loadingPrompt}
            title={!topic ? "Pick a topic first" : "Generate a new sentence"}
          >
            {loadingPrompt ? <Loader size="sm" /> : "New sentence"}
          </Button>
        </Group>

        <Text className={classes.sectionLabel} mt="sm">
          Correct this statement
        </Text>
        <Textarea
          className={classes.card}
          minRows={3}
          autosize
          value={prompt}
          onChange={(e) => setPrompt(e.currentTarget.value)}
          placeholder="Select a topic to generate a sentence…"
          styles={{ input: { background: "#F7F7F7", border: "none" } }}
          readOnly
        />

        <Text className={classes.sectionLabel} mt="sm">
          Type your answer here
        </Text>
        <Textarea
          className={classes.card}
          minRows={4}
          autosize
          value={answer}
          onChange={(e) => setAnswer(e.currentTarget.value)}
          placeholder="Rewrite the sentence with correct grammar…"
          styles={{ input: { background: "#F7F7F7", border: "none" } }}
        />

        <Group justify="center" mt="md">
          <Button
            className={classes.pillBtn}
            onClick={handleCheck}
            disabled={checking || !answer.trim() || !keyItem}
            title={!keyItem ? "Generate a sentence first" : "Check your answer"}
          >
            {checking ? <Loader size="sm" /> : "Check Answer"}
          </Button>
        </Group>

        <Text className={classes.sectionLabel} mt="lg">
          Solution
        </Text>
        <Textarea
          className={classes.card}
          minRows={4}
          autosize
          value={solution}
          onChange={(e) => setSolution(e.currentTarget.value)}
          placeholder="The solution and feedback will appear here."
          styles={{ input: { background: "#F7F7F7", border: "none" } }}
        />
      </Container>
    </Box>
  );
};

const useStyles = createStyles(() => ({
  page: {
    background: "linear-gradient(180deg, #F4E8F9 0%, #F8ECFF 100%)",
    minHeight: "100vh",
  },

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
    paddingInline: 28,
    borderRadius: 999,
    boxShadow: "0px 4px 25px rgba(0,0,0,0.25)",
    fontWeight: 500,
    "&:hover": { background: "#eee" },
    "&[data-disabled]": { opacity: 0.6, cursor: "not-allowed" },
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