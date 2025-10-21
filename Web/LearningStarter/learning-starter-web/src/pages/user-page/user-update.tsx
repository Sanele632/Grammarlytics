import {
  ApiResponse,
  UserGetDto,
  UserUpdateDto,
} from "../../constants/types";
import { useEffect, useState } from "react";
import { useForm, FormErrors } from "@mantine/form";
import {
  Alert,
  Button,
  Container,
  Input,
  Text,
  Title,
  Stack,
  Box,
  Divider,
  Loader,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { createStyles } from "@mantine/emotion";
import api from "../../config/axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../authentication/use-auth";

export const UserUpdate = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserGetDto | null>(null);
  const { id } = useParams();
  const { refetchUser } = useAuth();

  const form = useForm<UserUpdateDto>({
    initialValues: {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      profilePicture: "",
    },
    validate: {
      userName: (v) => (v.trim().length <= 0 ? "Username is required" : null),
      email: (v) => (v.trim().length <= 0 ? "Email is required" : null),
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get<ApiResponse<UserGetDto>>(
                `/api/users/${id}`
            );

        if (response.data.hasErrors) {
          showNotification({
            message: "Failed to load user data",
            color: "red",
          });
          return;
        }

        const currentUser = response.data.data;
        if (currentUser) {
          setUser(currentUser);
          form.setValues({
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            userName: currentUser.userName,
            email: currentUser.email,
            profilePicture: currentUser.profilePicture ?? "",
          });
        }
      } catch (error) {
        showNotification({
          message: "An error occurred while loading your profile.",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (values: UserUpdateDto) => {
    try {
      console.log("Updating user:", values);
      const response = await api.put<ApiResponse<UserGetDto>>(
        `/api/users/${id}`,
        values
      );

      if (response.data.hasErrors) {
        const formErrors: FormErrors = response.data.errors.reduce(
          (prev, curr) => {
            Object.assign(prev, { [curr.property]: curr.message });
            return prev;
          },
          {} as FormErrors
        );

        form.setErrors(formErrors);
        showNotification({
          message: "Please correct the highlighted errors.",
          color: "red",
        });
        return;
      }

      if (response.data.data) {
        showNotification({
          message: "User profile updated successfully!",
          color: "green",
        });
        navigate("/user");
      }
    } catch (error) {
      showNotification({
        message: "Failed to update profile. Please try again.",
        color: "red",
      });
    }
  };

  if (loading) {
    return (
      <Box className={classes.loaderWrapper}>
        <Loader />
      </Box>
    );
  }

  if (!user) {
    return (
      <Alert color="red">
        <Text>Unable to load user information.</Text>
      </Alert>
    );
  }

  return (
    <Container size="100%" className={classes.wrapper}>
      <Box className={classes.formBox}>
        <Title order={4} ta="center" mb="md" fw={400}>
          Update Profile
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
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
              <Input placeholder="Email" {...form.getInputProps("email")} />
              <Text c="red" size="xs">
                {form.errors["email"]}
              </Text>
            </div>

            <div>
              <Input
                placeholder="Profile Picture URL (optional)"
                {...form.getInputProps("profilePicture")}
              />
            </div>

            <Button fullWidth color="purple.6" type="submit">
              Save Changes
            </Button>

            <Button
              fullWidth
              variant="subtle"
              color="gray"
              component={Link}
              to="/user"
            >
              Cancel
            </Button>
          </Stack>
        </form>

        <Divider my="md" />

        <Text size="xs" ta="center" mt="sm" color="dimmed">
          Need to change your password?{" "}
          <a href="#" className={classes.link}>
            Reset it here
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
  },

  formBox: {
    width: "100%",
    maxWidth: "420px",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
    backgroundColor: "#fff",
  },

  loaderWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },

  link: {
    color: "#5a2ea6",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));