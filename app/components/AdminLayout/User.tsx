import * as React from "react";
import { IconUser } from "@tabler/icons-react";
import {
  UnstyledButton,
  Group,
  Text,
  Box,
  useMantineTheme,
  ThemeIcon,
} from "@mantine/core";
import { UserPropsForClient } from "~/utils/types";

export const User: React.FC<UserPropsForClient> = (props) => {
  const user = props!;
  const theme = useMantineTheme();
  return (
    <Box
      sx={{
        paddingTop: theme.spacing.sm,
        borderTop: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
      }}
    >
      <UnstyledButton
        sx={{
          display: "block",
          width: "100%",
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
          },
        }}
      >
        <Group>
          <ThemeIcon variant="dark">
            <IconUser color="gray" size={20} />
          </ThemeIcon>
          <Box sx={{ flex: 1 }}>
            <Text color={`gray`} size="sm" weight={500}>
              {user.userName}
            </Text>
            <Text size="xs">{user.email}</Text>
          </Box>
        </Group>
      </UnstyledButton>
    </Box>
  );
};
