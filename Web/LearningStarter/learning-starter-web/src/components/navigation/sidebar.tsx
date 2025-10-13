import React from "react";
import { Drawer, Button, Flex, Text } from "@mantine/core";
import { NavLink } from "react-router-dom";
import { routes } from "../../routes";
import { IconHome, IconUser, IconBook, IconFlame} from '@tabler/icons-react';

type SidebarProps = {
  opened: boolean;
  onClose: () => void;
};

export const Sidebar: React.FC<SidebarProps> = ({ opened, onClose }) => {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      overlayProps={{ backgroundOpacity: 0.4, blur: 4 }}
      size="xs"
      //padding="md"
      withCloseButton={true}
    >
      <Flex direction="column" gap = "lg">
        <Button
          component={NavLink}
          to={routes.home}
          leftSection={<IconHome size={17} color="#6E268C" />}
          variant="default"
          onClick={onClose}
        >
          Home
        </Button>
        <Button
          component={NavLink}
          to={routes.user}
          leftSection={<IconFlame size={17} color="#6E268C" />}
          variant="default"
          onClick={onClose}
        >
          Daily Challenge
        </Button>
        <Button
          component={NavLink}
          to={routes.user}
          leftSection={<IconBook size={17} color="#6E268C"/>}
          variant="default"
          onClick={onClose}
        >
          Learning Resources
        </Button>
        <Button
          component={NavLink}
          to={routes.user}
          leftSection={<IconUser size={17} color="#6E268C"/>}
          variant="default"
          onClick={onClose}
        >
          Profile
        </Button>
      </Flex>
    </Drawer>
  );
};