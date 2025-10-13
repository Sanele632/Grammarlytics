import { Box, Container, Text, SegmentedControl } from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import { useNavigate, useLocation } from "react-router-dom";

const PURPLE = "#73268D";
const HOME = "/";          
const PRACTICE = "/practice"; 

export const PracticePage = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const location = useLocation();

  const tabValue = location.pathname === PRACTICE ? "practice" : "correction";
  const handleSwitch = (val: string) => {
    navigate(val === "practice" ? PRACTICE : HOME);
  };

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
