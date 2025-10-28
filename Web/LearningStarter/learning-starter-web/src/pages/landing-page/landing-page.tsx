import {
  Container,
  Text,
  Box,
  SegmentedControl,
  Textarea,
  Group,
  Button,
  Select,
  Menu,
} from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import jsPDF from "jspdf";

const PURPLE = "#73268D";
const CORRECTION_ROUTE = "/";          // home
const PRACTICE_ROUTE = "/practice";    // practice page

export const LandingPage = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const tabValue =
    location.pathname === PRACTICE_ROUTE ? "practice" : "correction";

  const [inputText, setInputText] = useState("");
  const [tone, setTone] = useState<string | null>(null);
  const [outputText, setOutputText] = useState("");

  const handleSwitch = (val: string) => {
    if (val === "practice") navigate(PRACTICE_ROUTE);
    else navigate(CORRECTION_ROUTE);
  };

  const handleCorrectGrammar = async () => {
    try {
      setLoading(true);
      setOutputText("AI is analyzing your text…");

      const response = await fetch(
        "https://e47e098a8435.ngrok-free.app",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: inputText, tone }),
        }
      );

      const data = await response.json();
      setOutputText(data.corrected_text || "No response from model");
    } catch (error) {
      console.error("Error calling backend:", error);
      setOutputText("Error connecting to grammar service");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (format: "pdf" | "docx") => {
    if (!outputText) return;

    if (format === "pdf") {
      const doc = new jsPDF();
      doc.text(outputText, 10, 10);
      doc.save("corrected_text.pdf");
    } else if (format === "docx") {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [new Paragraph({ children: [new TextRun(outputText)] })],
          },
        ],
      });

      Packer.toBlob(doc).then((blob) => {
        saveAs(blob, "corrected_text.docx");
      });
    }
  };

  return (
    <Box className={classes.page}>
      <Container size={980} className={classes.main}>
        <Text className={classes.title}>Let’s Get Started</Text>

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

        <Text className={classes.sectionLabel}>
          What can we correct for you today, Joane?
        </Text>

        <Textarea
          className={classes.card}
          minRows={8}
          autosize
          placeholder="Start writing here."
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

        <Text className={classes.sectionLabel} style={{ marginTop: 24 }}>
          Here’s what we got!
        </Text>

        <Textarea
          className={`${classes.card} ${loading ? classes.loading : ""}`}
          minRows={8}
          autosize
          value={outputText}
          onChange={(e) => setOutputText(e.currentTarget.value)}
          styles={{ input: { background: "#F7F7F7", border: "none" } }}
        />

        <Group justify="center" mt="lg">
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button className={classes.saveBtn}>Save Text</Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item onClick={() => handleSave("pdf")}>Save as PDF</Menu.Item>
              <Menu.Item onClick={() => handleSave("docx")}>Save as Word</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Container>
    </Box>
  );
};

const useStyles = createStyles(() => ({
  page: { minHeight: "100vh" },
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
    transition: "background-color 0.5s",
  },

  loading: {
    animation: "$colorFade 1.5s infinite",
  },

  "@keyframes colorFade": {
    "0%": { backgroundColor: "#F7F7F7" },
    "50%": { backgroundColor: "#D6C0E0" },
    "100%": { backgroundColor: "#FFFFFF" },
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

  saveBtn: {
    background: "#F7F7F7",
    color: PURPLE,
    border: "none",
    height: 42,
    width: 220,
    borderRadius: 999,
    boxShadow: "0px 4px 25px rgba(0,0,0,0.25)",
    fontWeight: 500,
    "&:hover": { background: "#eee" },
  },
}));
