import { Container, Title, Select, Text, List, Divider, Paper } from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import { IconCircleCheck } from "@tabler/icons-react";
import { useState } from "react";

const PURPLE = "#73268D";

const ARTICLES: Record<
  string,
  {
    heading: string;
    intro: string;
    examples?: (string | JSX.Element)[];
    whenToUse?: (string | JSX.Element)[];
  }
> = {
  comma: {
    heading: "What is a Comma?",
    intro:
      "A comma ( , ) shows a soft break in a sentence. Think of it as a short pause in your reading — not as final as a period, but stronger than a space.",
    examples: [
      "I went to the store, but I forgot my wallet.",
      <span key="ex2">
        Without a comma: <b>I went to the store but I forgot my wallet.</b> (Harder to read!)
      </span>,
    ],
    whenToUse: [
      "Lists (three or more items)",
      <span key="w1" className="sub">
        • I bought apples, bananas, and oranges.
      </span>,
      "Joining two independent clauses (with FANBOYS: for, and, nor, but, or, yet, so)",
      <span key="w2" className="sub">
        • I was hungry, so I made a sandwich.
      </span>,
      "After an introductory phrase",
      <span key="w3" className="sub">
        • After the movie, we went out for pizza.
      </span>,
      "Nonessential information (extra details that can be removed)",
      <span key="w4" className="sub">
        • My sister, who loves dogs, just adopted a puppy.
      </span>,
      "Dates, locations, and addresses",
      <span key="w5" className="sub">
        • She was born on May 12, 2001, in New Orleans, Louisiana.
      </span>,
      "Direct address",
      <span key="w6" className="sub">
        • Let’s eat, Grandma.
      </span>,
    ],
  },

  semicolon: {
    heading: "What is a Semicolon?",
    intro:
      "A semicolon ( ; ) links two closely related independent clauses. It’s stronger than a comma but not as final as a period.",
    examples: [
      "I wanted to go for a walk; it was raining too hard.",
      "Use a semicolon before transitional words like however, therefore, and moreover.",
    ],
    whenToUse: [
      "Link two related independent clauses without a conjunction",
      "Before a transitional word/phrase (e.g., however, therefore) joining two independent clauses",
      "Separate long or comma-heavy list items",
    ],
  },

  apostrophe: {
    heading: "What is an Apostrophe?",
    intro:
      "An apostrophe ( ’ ) shows possession or forms contractions. It never makes a word plural by itself.",
    examples: [
      "Possession: Maria’s book; the dog’s bone; the students’ lounge.",
      "Contractions: don’t (do not), it’s (it is), you’re (you are).",
    ],
    whenToUse: [
      "Show possession (singular: ’s; plural ending in s: ’)",
      "Form contractions (it’s, can’t, you’re)",
      "Avoid for regular plurals (✅ tacos, CDs; ❌ taco’s, CD’s)",
    ],
  },
};

export const LearningResources = () => {
  const { classes, cx } = useStyles();
  const [selectedTopic, setSelectedTopic] = useState<string | null>("comma");

  const topics = [
    { value: "comma", label: "Commas" },
    { value: "semicolon", label: "Semicolons" },
    { value: "apostrophe", label: "Apostrophes" },
  ];

  const article = selectedTopic ? ARTICLES[selectedTopic] : null;

  return (
    <Container className={classes.page}>
      <Title className={classes.pageTitle}>Learning Resources</Title>
      <Text className={classes.subtitle}>Choose a grammar rule to learn</Text>

      <Select
        placeholder="Choose a topic..."
        data={topics}
        value={selectedTopic}
        onChange={setSelectedTopic}
        className={classes.dropdown}
      />

      {article && (
        <Paper withBorder className={classes.articleCard} shadow="sm" p="lg">
          <Title order={2} className={classes.heading}>
            {article.heading}
          </Title>

          <Text className={classes.paragraph}>{article.intro}</Text>

          {article.examples && (
            <>
              <Divider className={classes.divider} />
              <Text className={classes.subheading}>Example:</Text>
              <List className={classes.exampleList} withPadding>
                {article.examples.map((ex, i) => (
                  <List.Item key={i} className={classes.item}>
                    {ex}
                  </List.Item>
                ))}
              </List>
            </>
          )}

          {article.whenToUse && (
            <>
              <Divider className={classes.divider} />
              <Title order={3} className={classes.headingSmall}>
                When to Use {topics.find((t) => t.value === selectedTopic)?.label}
              </Title>

              <List
                className={classes.usageList}
                icon={<IconCircleCheck size={18} color="#27ae60" />}
              >
                {article.whenToUse.map((item, i) => (
                  <List.Item
                    key={i}
                    className={cx(classes.item, typeof item !== "string" && "sub")}
                  >
                    {item}
                  </List.Item>
                ))}
              </List>
            </>
          )}
        </Paper>
      )}
    </Container>
  );
};

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
  subtitle: {
    color: PURPLE,
    textAlign: "center",
    marginBottom: 12,
  },
  dropdown: {
    maxWidth: 420,
    margin: "0 auto 18px",
  },

  articleCard: {
    maxWidth: 760,
    margin: "0 auto",
    borderRadius: 16,
  },

  heading: {
    color: PURPLE,
    textAlign: "center",
    fontWeight: 800,
    marginBottom: 10,
  },
  headingSmall: {
    color: PURPLE,
    textAlign: "center",
    fontWeight: 800,
    marginTop: 8,
    marginBottom: 8,
  },

  paragraph: {
    color: "#3b3b3b",
    lineHeight: 1.65,
    margin: "0 auto 8px",
    maxWidth: 700,
  },

  subheading: {
    color: PURPLE,
    fontWeight: 700,
    marginTop: 6,
    marginBottom: 6,
  },

  exampleList: { marginLeft: 12, marginBottom: 8 },
  usageList: { marginTop: 8 },

  item: {
    marginBottom: 6,
    "&.sub": {
      color: "#555",
      marginTop: -2,
      marginLeft: 6,
      listStyleType: "none",
    },
  },

  divider: {
    marginTop: 12,
    marginBottom: 12,
  },
}));
