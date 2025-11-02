import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Text,
  Title,
  Loader,
  Center,
  useMantineColorScheme,
  useMantineTheme,
  Group,
  Switch,
} from "@mantine/core";
import {
  ApiResponse,
  UserGetDto,
} from "../../constants/types";
import {
  IconUser,
  IconHistory,
  IconSettings,
  IconLock,
  IconSun,
  IconMoon,
  IconMail,
} from "@tabler/icons-react";
import { createStyles } from "@mantine/emotion";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useUser } from "../../authentication/use-auth";
import { Link } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import api from "../../config/axios";

export const UserPage = () => {
  const userContext = useUser();
  const [user, setUser] = useState<any>(null);
  const { classes } = useStyles();
  const [activeSection, setActiveSection] = useState("Profile");
  const [loading, setLoading] = useState(true);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  
  useEffect(() => {
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
  
      fetchUser();
    }, [userContext.id]);

  if (loading || !user) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader color="purple.6" size="lg" variant="dots" />
      </Center>
    );
  }

  
  return (
    <Container size="md" className={classes.wrapper}>
      <Title order={2} ta="center" mb="xl" c="purple.6" fw={400}>
        Profile
      </Title>

      {/* Header section */}
      <Flex align="center" mb="xl" gap="lg">
        <Avatar
          src={user.profilePicture || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"}
          size={150}
          radius={100}
        />

        <Flex direction="column" justify="center">
          <Text fw={600} size="xl" lh={1.2} >
            {user.firstName} {user.lastName}
          </Text>
          <Text size="lg" c="dimmed">
            {user.email}
          </Text>
        </Flex>
      </Flex>

      {/* Body layout */}
      <Flex direction={{ base: "column", sm: "row" }} gap="lg" justify="center">
        {/* Sidebar */}
        <Box className={classes.sidebar}>
          <Flex direction="column" gap="sm">
            <SidebarButton
              label="Profile"
              icon={<IconUser size={16} />}
              active={activeSection === "Profile"}
              onClick={() => setActiveSection("Profile")}
            />
            <SidebarButton
              label="History"
              icon={<IconHistory size={16} />}
              active={activeSection === "History"}
              onClick={() => setActiveSection("History")}
            />
            <SidebarButton
              label="Preferences"
              icon={<IconSettings size={16} />}
              active={activeSection === "Preferences"}
              onClick={() => setActiveSection("Preferences")}
            />
          </Flex>
        </Box>

        {/* Main content with animation */}
        <Card shadow="md" radius="md" withBorder className={classes.infoCard}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeSection === "Profile" && <ProfileInfo user={user} />}
              {activeSection === "History" && <HistorySection />}
              {activeSection === "Preferences" && <PreferencesSection />}
            </motion.div>
          </AnimatePresence>
        </Card>
      </Flex>
    </Container>
  );
};

const SidebarButton = ({ label, icon, active, onClick }: any) => {
  const { classes, cx } = useStyles();
  
  return (
    <Button
      leftSection={icon}
      variant = "subtle"
      color="purple.6"
      className={cx(classes.sidebarButton, {
        [classes.activeButton]: active,
      })}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

const ProfileInfo = ({ user }: any) => (
  <Box>
    <Flex justify="space-between" align="center" mb="md">
      <Text mb="sm">
      Personal Information
      </Text>
      <Button
        variant="light"
        color="green"
        size="xs"
        component={Link}
        to={`/user/${user.id}`}
        leftSection={<IconLock size={14} />}
        radius="md"
      >
        Update Profile
      </Button>
    </Flex>
    <Divider mb="md" />
    <Text fw={500} size="md">
      {user.firstName} {user.lastName}
    </Text>
    <Text size="sm" c="dimmed" mb="xs">
      @{user.userName}
    </Text>
    <Flex align="center" gap={4}>
      <IconMail size={16} />
      <Text size="sm">{user.email}</Text>
    </Flex>
  </Box>
);

const HistorySection = () => (
  <Box>
    <Title order={4} mb="sm">
      Grammar Practice History
    </Title>
    <Text size="sm" c="dimmed">
      View your{" "}
      <Text
        component={Link}
        to="/user/history"
        c="purple.6"
        fw={500}
        style={{ textDecoration: "none" }}
      >
        full practice history
      </Text>
      .
    </Text>
  </Box>
);

const PreferencesSection = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const theme = useMantineTheme();

  return (
    <Card
      withBorder
      radius="md"
      p="lg"
      style={{
        backgroundColor: dark
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      }}
    >
      <Title order={4} mb="md">
        Preferences
      </Title>
      <Group justify="space-between" align="center">
        <Group>
          {dark ? (
            <IconMoon size={20} color={theme.colors.yellow[5]} />
          ) : (
            <IconSun size={20} color={theme.colors.yellow[5]} />
          )}
          <Text fw={500}>{dark ? "Dark Mode" : "Light Mode"}</Text>
        </Group>
        <Switch
          checked={dark}
          onChange={() => toggleColorScheme()}
          color="purple"
          size="md"
        />
      </Group>
    </Card>
  );
};


const useStyles = createStyles((theme) => ({
  wrapper: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  sidebar: {
    minWidth: 150,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  sidebarButton: {
    justifyContent: "flex-start",
    width: "100%",
  },
  
  activeButton: {
  borderLeft: `4px solid ${theme.colors.purple[7]}`, 
  backgroundColor: "transparent",                   
  color: theme.colors.purple[7],                    
  paddingLeft: "calc(1rem - 4px)",                  
  },

  infoCard: {
    flex: 1,
    padding: theme.spacing.lg,
    minHeight: 200,
  },
}));
