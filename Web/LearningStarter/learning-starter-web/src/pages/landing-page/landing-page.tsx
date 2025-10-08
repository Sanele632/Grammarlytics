import { Container, Text, Box, SegmentedControl } from "@mantine/core";
import { createStyles } from "@mantine/emotion";

const PURPLE = "#73268D";

export const LandingPage = () => {
  const { classes } = useStyles();

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
}));
