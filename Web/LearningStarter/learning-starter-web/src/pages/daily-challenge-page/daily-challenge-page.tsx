import {
  Container,
  Text,
  Title,
  Box,
  Loader,
  Center,
  Textarea,
  Button,
  Group,
} from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import { IconCircleCheck, IconCircle, IconCircleX } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { ApiResponse, UserGetDto, DailyChallengeGetDto } from "../../constants/types";
import { useUser, useAuth } from "../../authentication/use-auth";
import { showNotification } from "@mantine/notifications";
import api from "../../config/axios";

export const DailyChallenge = () => {
  const userContext = useUser();
  const { refetchUser } = useAuth();
  const [user, setUser] = useState<UserGetDto | null>(null);
  const [challenge, setChallenge] = useState<DailyChallengeGetDto | null>(null);
  const { classes, cx } = useStyles();
  const [answer, setAnswer] = useState("");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<string | null>(null);
  const [weekProgress, setWeekProgress] = useState<string[]>(["idle", "idle", "idle", "idle", "idle", "idle", "idle"]);

  const todayIndex = new Date().getDay(); 
  const niceDate = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      }),
    []
  );

  const fetchWeeklyProgress = async () => {
    try {
      const response = await api.get<ApiResponse<any>>(`/api/daily-challenges/weekly-progress/${userContext.id}`);
      setWeekProgress(response.data.data.weeklyProgress);
    } catch (error) {
      console.error("Failed to fetch weekly progress:", error);
    }
  };

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await api.get<ApiResponse<UserGetDto>>(`/api/users/${userContext.id}`);
      setUser(response.data.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      showNotification({ message: "Failed to load user", color: "red" });
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyChallenge = async () => {
    try {
      setLoading(true);
      const response = await api.get<ApiResponse<DailyChallengeGetDto>>(`/api/daily-challenges/today`);
      setChallenge(response.data.data);
    } catch (error) {
      console.error("Failed to fetch challenge:", error);
      setLoadError("Failed to load your Daily Challenge. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem(`dailyChallenge-${userContext.id}-${new Date().toDateString()}`);
    if (saved) {
      const data = JSON.parse(saved);
      setAnswer(data.answer || "");
      setSubmissionResult(data.result || null);
    }
    
    const loadData = async () => {
      await Promise.all([
        fetchUser(),
        fetchDailyChallenge(),
        fetchWeeklyProgress()
      ]);
    };
    
    loadData();
  }, [userContext.id]);

  const handleSubmit = async () => {
    if (!answer.trim()) {
      setSubmissionResult("Please enter your answer before submitting.");
      return;
    }

    if (submissionResult && (submissionResult.startsWith("✔️") || submissionResult.startsWith("🫤"))) {
      setSubmissionResult("You've already completed today's challenge! Come back tomorrow.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post<ApiResponse<any>>(`/api/daily-challenges/submit`, {
        userId: userContext.id,
        challengeId: challenge?.id,
        userAnswer: answer,
      });

      const result = response.data.data;
      
      const updatedWeekProgress = result.weeklyProgress || weekProgress;
          
      setUser((prev) =>
        prev
          ? { ...prev, streakCount: result.newStreakCount }
          : prev
      );
      
      await refetchUser();
      
      const newResult = result.wasCorrect
        ? `✔️ Correct! Your streak count is now ${result.newStreakCount} 🔥`
        : `🫤 That's not quite right. Try again tomorrow!\n\nCorrect answer: ${challenge?.correctSentence}`;

      setSubmissionResult(newResult);
      setWeekProgress(updatedWeekProgress); 
      
      localStorage.setItem(
        `dailyChallenge-${userContext.id}-${new Date().toDateString()}`,
        JSON.stringify({
          answer,
          result: newResult,
        })
      );
    
    } catch (error: any) {
      console.error("Submit error:", error);
      setSubmissionResult(`❌ ${error.response?.data?.errors?.[0] || "Failed to submit answer. Please try again."}`);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWeeklyProgress();
    }
  }, [user?.streakCount]);

  const hasCompletedToday = Boolean(submissionResult && 
    (submissionResult.startsWith("✔️") || submissionResult.startsWith("🫤")));

  if (loadError) {
    return (
      <Center style={{ height: "100vh", flexDirection: "column" }}>
        <Text size="lg" fw={600} c="red" mb="xs" style={{ textAlign: "center" }}>
          {loadError}
        </Text>

        <Button variant="light" color="red" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Center>
    );
  }

  if (loading) {
    return (
      <Center style={{ height: "100vh", flexDirection: "column" }}>
        <Text size="lg" fw={600} mb="xs" style={{ color: "purple", textAlign: "center" }}>
          AI is generating your Daily Challenge
        </Text>
        <Loader color="purple.6" size="md" variant="dots" />
      </Center>
    );
  }

  if (!user || !challenge) {
    return (
      <Center style={{ height: "100vh", flexDirection: "column" }}>
        <Text size="lg" fw={600} c="red" mb="xs">
          AI is unavailable right now. Please try again later.
        </Text>
        <Button variant="light" color="red" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Center>
    );
  }

  
  {/* 
  if (loading || !user || !challenge ) {
    return (
      <Center style={{ height: "100vh", flexDirection: "column" }}>
        <Text
          size="lg"
          fw={600}
          mb="xs"
          style={{ color: "purple", textAlign: "center" }}
        >
          AI is generating your Daily Challenge
        </Text>
        <Loader color="purple.6" size="md" variant="dots" />
      </Center>
    );
  }
  */}

  return (
    <Container className={classes.page}>
      <Title className={classes.title}>Daily Challenge</Title>

      {/* WEEK ROW */}
      <Box className={classes.weekCard}>
        <Group justify="space-between" className={classes.weekRow}>
          {["S", "M", "T", "W", "Th", "F", "S"].map((d, i) => (
            <Box key={`${d}-${i}`} className={classes.weekCell}>
              <Text className={classes.weekLabel}>{d}</Text>
              {weekProgress[i] === "correct" ? (
                <IconCircleCheck className={classes.dotSuccess} size={22} />
              ) : weekProgress[i] === "wrong" ? (
                <IconCircleX className={classes.dotError} size={22} />
              ) : (
                <IconCircle className={classes.dotIdle} size={22} />
              )}
            </Box>
          ))}
        </Group>
      </Box>

      {/* STREAK DISPLAY */}
      <Box className={classes.streakPill}>
        <Text size="xs" c="dimmed">
          Streak Count
        </Text>
        <Group gap={6} align="center" justify="center" mt={4}>
          <Text fw={700}>{user.streakCount}</Text>
          <Text>🔥</Text>
        </Group>
      </Box>

      <Text className={classes.dateText}>{niceDate}</Text>

      {/* CHALLENGE */}
      <Box className={classes.challengeWrap}>
        <Text className={classes.helperText}>
          Correct this statement to keep your streak alive!
        </Text>

        <Textarea
          minRows={3}
          autosize
          value={challenge.incorrectSentence}
          readOnly
          className={cx(classes.cardArea, classes.promptArea)}
          styles={{ input: { background: "#F7F7F7", border: "none" } }}
        />

        <Text className={classes.inputLabel}>Your Answer</Text>

        <Textarea
          placeholder="Type your corrected version here"
          minRows={4}
          autosize
          value={answer}
          onChange={(e) => setAnswer(e.currentTarget.value)}
          className={cx(classes.cardArea, classes.answerArea)}
          styles={{ input: { background: "#F7F7F7", border: "none" } }}
          disabled= {hasCompletedToday} // FIX: Disable input after completion
        />

        {submissionResult && (
          <Box
            mt="sm"
            p="sm"
            style={{
              background: submissionResult.startsWith("✔️") ? "#f0f9f0" : "#fef0f0",
              borderRadius: 10,
              boxShadow: "inset 0 0 6px rgba(0,0,0,0.05)",
              textAlign: "left",
              width: "100%",
              whiteSpace: "pre-line", 
              border: submissionResult.startsWith("✔️") ? "1px solid #27ae60" : "1px solid #e63946",
            }}
          >
            <Text
              fw={500}
              color={submissionResult.startsWith("✔️") ? "green" : "red"}
            >
              {submissionResult}
            </Text>
          </Box>
        )}

        <Center>
          <Button
            className={classes.pillBtn}
            loading={submitting}
            onClick={handleSubmit}
            disabled={hasCompletedToday} // FIX: Disable button after completion
          >
            {hasCompletedToday 
              ? "Challenge Completed!" 
              : "Submit Answer"}
          </Button>
        </Center>
      </Box>
    </Container>
  );
};

const useStyles = createStyles(() => ({
  page: {
    minHeight: "100vh",
    paddingTop: 24,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    color: "purple",
    fontWeight: 500,
    fontSize: 32,
    marginBottom: 12,
  },
  weekCard: {
    width: 720,
    background: "#fff",
    borderRadius: 20,
    boxShadow: "0px 16px 42px rgba(0,0,0,0.10)",
    padding: "14px 20px",
    marginBottom: 18,
  },
  weekRow: { width: "100%" },
  weekCell: {
    width: 80,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  weekLabel: {
    color: "#000",
    opacity: 0.75,
    width: 24,
    textAlign: "center",
    marginRight: 6,
    fontWeight: 600,
  },
  dotSuccess: { color: "#27ae60" },
  dotError: { color: "#e63946" },
  dotIdle: { color: "#cfcfcf" },
  streakPill: {
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0px 10px 26px rgba(0,0,0,0.10)",
    padding: "10px 18px",
    textAlign: "center",
    marginBottom: 8,
    minWidth: 140,
  },
  dateText: {
    color: "purple",
    fontWeight: 700,
    marginBottom: 16,
  },
  challengeWrap: {
    width: 720,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  helperText: {
    color: "purple",
    fontWeight: 500,
    textAlign: "center",
    marginBottom: 12,
  },
  cardArea: {
    width: "100%",
    borderRadius: 20,
    boxShadow: "0px 22px 60px rgba(0,0,0,0.14)",
    textarea: { borderRadius: 20, padding: 16, fontSize: 14 },
  },
  promptArea: { marginBottom: 18 },
  inputLabel: {
    color: "purple",
    fontWeight: 500,
    margin: "4px 0 8px",
    alignSelf: "flex-start",
  },
  answerArea: { marginBottom: 14 },
  pillBtn: {
    background: "#F7F7F7",
    color: "purple",
    border: "none",
    height: 40,
    paddingInline: 28,
    borderRadius: 999,
    boxShadow: "0px 4px 25px rgba(0,0,0,0.25)",
    fontWeight: 600,
    letterSpacing: 0.2,
    "&:hover": { background: "#eee" },
  },
}));