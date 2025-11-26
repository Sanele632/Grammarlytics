import { useState } from "react";
import axios from "axios";
import { createStyles } from "@mantine/emotion";
import { useRef, useEffect } from "react";
import { marked } from "marked";
import {
  Card,
  Textarea,
  Button,
  Text,
  ScrollArea,
  Loader,
  Container,
  Title,
} from "@mantine/core";

const PURPLE = "#73268D";

export default function GrammarChat() {
  const { classes } = useStyles();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    const trimmed = question.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await axios.post("/api/grammar-chat/ask", {
        question: trimmed,
        history: messages,
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.data.answer },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "An error occurred while contacting the grammar tutor.",
        },
      ]);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Container className={classes.page}>
      <Title className={classes.pageTitle}>Grammar Chatbot</Title>
      <Card
        shadow="md"
        padding="lg"
        radius="md"
        withBorder
        style={{
          height: 500,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* Chat history */}
        <ScrollArea style={{ flex: 1 }} viewportRef={scrollRef}>
          {messages.map((msg, i) => (
            <Card
              key={i}
              shadow="xs"
              padding="sm"
              radius="md"
              withBorder
              mt="sm"
              style={{
                backgroundColor: msg.role === "user" ? "#f5e9fa" : "#f8f8f8",
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "100%",
              }}
            >
              <Text fw={600}>{msg.role === "user" ? "You" : "Tutor"}</Text>

              <div
                style={{ marginTop: 4, lineHeight: 1.6 }}
                dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) }}
              />
            </Card>
          ))}

          {loading && (
            <div style={{ padding: 10 }}>
              <Loader size="sm" />
            </div>
          )}
        </ScrollArea>

        {/* Sticky input area */}
        <div
          style={{
            position: "sticky",
            bottom: 0,
            background: "white",
            paddingTop: 10,
            paddingBottom: 10,
            borderTop: "1px solid #e0e0e0",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <Textarea
              placeholder="Ask a grammar question…"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              autosize
              minRows={1}
              style={{ flex: 1 }}
            />

            <Button onClick={askQuestion} loading={loading} style={{ height: "40px" }}>
              Send
            </Button>
          </div>
        </div>
      </Card>
    </Container>
  );
}

const useStyles = createStyles(() => ({
  page: {
    minHeight: "100vh",
    paddingTop: 30,
  },
  pageTitle: {
    color: PURPLE,
    fontWeight: 500,
    fontSize: 32,
    textAlign: "center",
    marginBottom: 6,
  },
  articleCard: {
    maxWidth: 760,
    margin: "0 auto",
    borderRadius: 16,
  },

  paragraph: {
    color: "#3b3b3b",
    lineHeight: 1.65,
    margin: "0 auto 8px",
    maxWidth: 700,
  },
}));
