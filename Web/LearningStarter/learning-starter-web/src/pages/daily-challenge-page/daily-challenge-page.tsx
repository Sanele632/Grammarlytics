import { Container, Text, Title, Box, TextInput, Button, Center } from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import { useState } from "react";

const PURPLE = "#73268D";

export const DailyChallengePage = () => {
  const { classes } = useStyles();
  const [answer, setAnswer] = useState("");

  return (
    <Container className={classes.page}>
      <Title className={classes.title}>Daily Challenge</Title>

      <Box className={classes.challengeBox}>
        <Text className={classes.label}>Correct this statement to keep your streak alive!</Text>
        <TextInput
          placeholder="Type your answer here"
          value={answer}
          onChange={(e) => setAnswer(e.currentTarget.value)}
          className={classes.input}
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
    paddingTop: 40,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    color: PURPLE,
    fontWeight: 500,
    fontSize: 32,
    marginBottom: 24,
  },
  challengeBox: {
    background: "#F7F7F7",
    borderRadius: 16,
    padding: 24,
    width: 600,
    boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
  },
  label: {
    color: PURPLE,
    fontWeight: 500,
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
  },
  button: {
    background: PURPLE,
    color: "#fff",
    borderRadius: 20,
    width: 200,
    "&:hover": { background: "#5e1f72" },
  },
}));
