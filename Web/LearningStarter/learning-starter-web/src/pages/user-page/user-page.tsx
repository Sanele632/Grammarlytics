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
} from "@mantine/core";
import {
  IconUser,
  IconHistory,
  IconSettings,
  IconLock,
} from "@tabler/icons-react";
import { createStyles } from "@mantine/emotion";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useUser } from "../../authentication/use-auth";

export const UserPage = () => {
  const user = useUser();
  const { classes, cx } = useStyles();
  const [activeSection, setActiveSection] = useState("Profile");

  return (
    <Container size="md" className={classes.wrapper}>
      {/* Page Title */}
      <Title order={2} ta="center" mb="xl" c="purple">
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
          <Text fw={700} size="xl" lh={1.2}>
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
      variant={active ? "filled" : "subtle"}
      color="purple"
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
      <Text fw={600}>Name</Text>
      <Flex align="center" gap={4}>
        <IconLock size={16} color="green" />
        <Text c="green" size="sm" style={{ cursor: "pointer" }}>
          Change Password
        </Text>
      </Flex>
    </Flex>
    <Divider mb="md" />
    <Text fw={500}>
      {user.firstName} {user.lastName}
    </Text>
    <Box mt="md">
      <Text size="sm" fw={500}>
        Verified email
      </Text>
      <Flex align="center" gap={4}>
        <Text>{user.email}</Text>
        <Text c="green">●</Text>
      </Flex>
      <Text size="xs" c="dimmed">
        Account linked with Google
      </Text>
    </Box>
    <Divider my="md" />
    <Text size="sm" c="dimmed">
      User since Sep 2025
    </Text>
  </Box>
);

const HistorySection = () => (
  <Box>
    <Title order={4} mb="sm">
      Grammar Practice History
    </Title>
    <Text size="sm" c="dimmed">
      (show rewrites here.)
    </Text>
  </Box>
);

const PreferencesSection = () => (
  <Box>
    <Title order={4} mb="sm">
      Preferences
    </Title>
    <Text size="sm" c="dimmed">
      (Add theme, notification, or language preferences here.)
    </Text>
  </Box>
);

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
    backgroundColor: theme.colors.violet[1],
    color: theme.colors.violet[7],
  },
  infoCard: {
    flex: 1,
    padding: theme.spacing.lg,
    minHeight: 200,
  },
}));
