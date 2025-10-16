import { ApiResponse } from "../../constants/types";
import { useAsyncFn } from "react-use";
import { FormErrors, useForm } from "@mantine/form";
import {
  Alert,
  Button,
  Container,
  Input,
  Text,
  Title,
  Group,
  Stack,
  Box,
  Divider,
} from "@mantine/core";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { createStyles } from "@mantine/emotion";
import { Link } from "react-router-dom";

type RegisterRequest = {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  profilePicture?: string;
};

type RegisterResponse = ApiResponse<boolean>;

export const UserCreate = ({
  fetchCurrentUser,
}: {
  fetchCurrentUser: () => void;
}) => {
  const { classes } = useStyles();

  const form = useForm<RegisterRequest>({
    initialValues: {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      password: "",
      profilePicture: "",
    },
    validate: {
      firstName: (v) => (v.length <= 0 ? "First name is required" : null),
      lastName: (v) => (v.length <= 0 ? "Last name is required" : null),
      userName: (v) => (v.length <= 0 ? "Username is required" : null),
      email: (v) => (v.length <= 0 ? "Email is required" : null),
      password: (v) => (v.length < 8 ? "Password must be at least 8 characters" : null),
    },
  });

  const [, submitSignUp] = useAsyncFn(async (values: RegisterRequest) => {
    const response = await api.post<RegisterResponse>(`/api/users`, values);

    if (response.data.hasErrors) {
      const formErrors: FormErrors = response.data.errors.reduce(
        (prev, curr) => {
          Object.assign(prev, { [curr.property]: curr.message });
          return prev;
        },
        {} as FormErrors
      );
      form.setErrors(formErrors);
      return;
    }

    if (response.data.data) {
      showNotification({ message: "Account created successfully!", color: "green" });
      fetchCurrentUser();
    }
  }, []);

  return (
    <Container size="100%" className={classes.wrapper}>
      <Box className={classes.header}>
        <img
          src="/logo.png"
          alt="Grammarlytics Logo"
          className={classes.logo}
        />
        <Title order={1} className={classes.title} fw={400}>
          GRAMMARLYTICS
        </Title>
        <Text size="sm" color="dimmed" className={classes.subtitle}>
          Write with Confidence. Master Your Grammar.
        </Text>
      </Box>

      <Box className={classes.formBox}>
        <Title order={4} ta="center" mb="md" fw={400}>
          Create your account
        </Title>

        {form.errors[""] && (
          <Alert className={classes.generalErrors} color="red">
            <Text>{form.errors[""]}</Text>
          </Alert>
        )}

        <form onSubmit={form.onSubmit(submitSignUp)}>
          <Stack>
            <Group grow>
              <div>
                <Input placeholder="First Name" {...form.getInputProps("firstName")} />
                <Text c="red" size="xs">
                  {form.errors["firstName"]}
                </Text>
              </div>

              <div>
                <Input placeholder="Last Name" {...form.getInputProps("lastName")} />
                <Text c="red" size="xs">
                  {form.errors["lastName"]}
                </Text>
              </div>
            </Group>

            <div>
              <Input placeholder="Username" {...form.getInputProps("userName")} />
              <Text c="red" size="xs">
                {form.errors["userName"]}
              </Text>
            </div>

            <div>
              <Input placeholder="Email" {...form.getInputProps("email")} />
              <Text c="red" size="xs">
                {form.errors["email"]}
              </Text>
            </div>

            <div>
              <Input
                type="password"
                placeholder="Password"
                {...form.getInputProps("password")}
              />
              <Text c="red" size="xs">
                {form.errors["password"]}
              </Text>
            </div>

            <div>
              <Input
                placeholder="Profile Picture URL (optional)"
                {...form.getInputProps("profilePicture")}
              />
            </div>

            <Button fullWidth color="purple.6" type="submit">
              Sign Up
            </Button>
          </Stack>
        </form>

        <Divider label="already have an account?" labelPosition="center" my="md" />

        <Button
          variant="default"
          fullWidth
          component={Link}   
          to="/login"
        >
          Back to Login
        </Button>

        <Text size="xs" ta="center" mt="sm" color="dimmed">
          By signing up, you agree to our{" "}
          <a href="#" className={classes.link}>
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className={classes.link}>
            Privacy Policy
          </a>
          .
        </Text>
      </Box>
    </Container>
  );
};

const useStyles = createStyles(() => ({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#fff",
  },

  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },

  logo: {
    width: "120px",
    height: "100px",
    marginBottom: "0.5rem",
  },

  title: {
    fontWeight: 600,
    color: "#828282",
    letterSpacing: "3px",
  },

  subtitle: {
    fontSize: "0.9rem",
  },

  formBox: {
    width: "100%",
    maxWidth: "420px",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
    backgroundColor: "#fff",
  },

  generalErrors: {
    marginBottom: "8px",
  },

  link: {
    color: "#5a2ea6",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));
