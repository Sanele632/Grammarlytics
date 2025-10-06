import { ApiResponse } from "../../constants/types";
import { useAsyncFn } from "react-use";
//import { PageWrapper } from "../../components/page-wrapper/page-wrapper";
import { FormErrors, useForm, } from "@mantine/form";
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
  createTheme
} from "@mantine/core";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { createStyles } from "@mantine/emotion";
import { FcGoogle } from "react-icons/fc";

type LoginRequest = {
  userName: string;
  password: string;
};

type LoginResponse = ApiResponse<boolean>;

export const LoginPage = ({
  fetchCurrentUser,
}: {
  fetchCurrentUser: () => void;
}) => {
  const { classes } = useStyles();

  const form = useForm<LoginRequest>({
    initialValues: {
      userName: "",
      password: "",
    },
    validate: {
      userName: (value) =>
        value.length <= 0 ? "Username must not be empty" : null,
      password: (value) =>
        value.length <= 0 ? "Password must not be empty" : null,
    },
  });

  const [, submitLogin] = useAsyncFn(async (values: LoginRequest) => {
    const response = await api.post<LoginResponse>(`/api/authenticate`, values);
    if (response.data.hasErrors) {
      const formErrors: FormErrors = response.data.errors.reduce(
        (prev, curr) => {
          Object.assign(prev, { [curr.property]: curr.message });
          return prev;
        },
        {} as FormErrors
      );
      form.setErrors(formErrors);
    }

    if (response.data.data) {
      showNotification({ message: "Successfully Logged In!", color: "green" });
      fetchCurrentUser();
    }
  }, []);

  return (
    //<PageWrapper>
      <Container size="100%" className={classes.wrapper}>
        <Box className={classes.header}>
          <img
            src="/logo.png" 
            alt="Grammarlytics Logo"
            className={classes.logo}
          />
          <Title order={1} className={classes.title}>
            GRAMMARLYTICS
          </Title>
          <Text size="sm" color="dimmed" className={classes.subtitle}>
            Write with Confidence. Master Your Grammar.
          </Text>
        </Box>

        <Box className={classes.formBox}>
          <Title order={4} ta="center" mb="md">
            Sign in to your account
          </Title>

          {form.errors[""] && (
            <Alert className={classes.generalErrors} color="red">
              <Text>{form.errors[""]}</Text>
            </Alert>
          )}

          <form onSubmit={form.onSubmit(submitLogin)}>
            <Stack>
              <div>
                <Input
                  placeholder="Username"
                  {...form.getInputProps("userName")}
                />
                <Text c="red" size="xs">
                  {form.errors["userName"]}
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

              <Button fullWidth color='purple' type="submit">
                Sign in
              </Button>
            </Stack>
          </form>

          <Divider label="or continue with" labelPosition="center" my="md" />

          <Button
            variant="default"
            leftSection={<FcGoogle size={20} />}
            fullWidth
          >
            Google
          </Button>

          <Text size="xs" ta="center" mt="sm" color="dimmed">
            By clicking continue, you agree to our{" "}
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
    //</PageWrapper>
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


