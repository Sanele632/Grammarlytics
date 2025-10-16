import React, { useState } from "react";
import {
  Container,
  Group,
  Image,
  Flex,
  Avatar,
  Menu,
  ActionIcon,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { IconMenu2, IconFlameFilled, IconUser } from "@tabler/icons-react";
import { NavLink, Link } from "react-router-dom";
import { routes } from "../../routes";
import { useAuth } from "../../authentication/use-auth";
import logo from "../../assets/full logo.png";
import { createStyles } from "@mantine/emotion";
import { Sidebar } from "../navigation/sidebar";
import { UserDto } from "../../constants/types";

type PrimaryNavigationProps = {
  user?: UserDto;
};

export const PrimaryNavigation: React.FC<PrimaryNavigationProps> = ({
  user,
}) => {
  const { classes } = useStyles();
  const { logout } = useAuth();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const [sidebarOpened, setSidebarOpened] = useState(false);

  return (
    <>
      <Container fluid className={classes.navbar}>
        <Flex justify="space-between" align="center" className={classes.inner}>
          <Flex align="center" gap="md">
            <ActionIcon
              size="lg"
              variant="subtle"
              color="purple.8"
              onClick={() => setSidebarOpened(true)}
            >
              <IconMenu2 size={24} />
            </ActionIcon>
            <NavLink to={routes.root}>
              <Image src={logo} alt="logo" height={40} fit="contain" />
            </NavLink>
          </Flex>

          {user && (
            <Flex align="center" gap="sm">
              <Flex align="center" gap={4}>
                <IconFlameFilled color="orange" size={20} />
                <span style={{ fontWeight: 600, color: "orange" }}>6</span>
              </Flex>
              <span>Welcome Back, {user.firstName}!</span>
              <Menu>
                <Menu.Target>
                  <Avatar className={classes.pointer}>
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </Avatar>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    component={Link}
                    to={`/user`} 
                    leftSection={<IconUser size={16} />}
                  >
                    View Profile
                  </Menu.Item>
                  <Menu.Item onClick={() => logout()}>Sign Out</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Flex>
          )}
        </Flex>
      </Container>

      <Sidebar opened={sidebarOpened} onClose={() => setSidebarOpened(false)} />
    </>
  );
};

const useStyles = createStyles(() => ({
  navbar: {
    height: 60,
    borderBottom: "1px solid #e9ecef",
  },
  inner: {
    height: "100%",
  },
  title: {
    fontWeight: 700,
    letterSpacing: 1,
    color: "#6E268C",
  },
  pointer: {
    cursor: "pointer",
  },
}));
