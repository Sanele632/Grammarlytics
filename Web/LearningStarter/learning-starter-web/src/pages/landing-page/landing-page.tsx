import { Container, Text, Box } from "@mantine/core";
import { createStyles } from "@mantine/emotion";

const PURPLE = "#73268D";

export const LandingPage = () => {
  const { classes } = useStyles();
  return (
    <Box className={classes.page}>
      <Container size={980} className={classes.main}>
        <Text className={classes.title}>Home Page</Text>
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
}));
