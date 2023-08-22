import { requireAdminUser } from "~/utils";
import { UserPropsForClient } from "~/utils/types";
import { useNavigate } from "@remix-run/react";
import { User } from "./User";
import {
  Navbar,
  ThemeIcon,
  UnstyledButton,
  Group,
  Text,
  useMantineTheme,
} from "@mantine/core";
import {
  IconMessages,
  IconDatabase,
  IconLogin,
  IconAlertCircle,
  IconUser,
  IconEditCircle,
} from "@tabler/icons-react";

export const AdminNavigation: React.FC<UserPropsForClient> = (props) => {
  const user = props!;
  return (
    <Navbar p="xs" width={{ base: 275 }}>
      <Navbar.Section grow mt="md">
        <Text
          size="sm"
          sx={(theme) => ({
            color:
              theme.colorScheme === "dark"
                ? theme.colors.dark[2]
                : theme.colors.dark,
          })}
        >
          GAME
        </Text>
        <GameMainLinks />
        <Text
          size="sm"
          sx={(theme) => ({
            color:
              theme.colorScheme === "dark"
                ? theme.colors.dark[2]
                : theme.colors.dark,
          })}
        >
          USER
        </Text>
        <UserMainLinks />
      </Navbar.Section>
      <Navbar.Section>
        <User {...user} />
      </Navbar.Section>
    </Navbar>
  );
};

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  link: string;
}

function MainLink({ icon, color, label, link }: MainLinkProps) {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  return (
    <UnstyledButton
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        // color:
        //   theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.black,

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      })}
      onClick={() => {
        navigate(link);
      }}
    >
      <Group>
        <ThemeIcon
          color={color}
          variant={theme.colorScheme === "dark" ? "dark" : "light"}
        >
          {icon}
        </ThemeIcon>
        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
}

const gameData = [
  {
    icon: <IconDatabase size={16} />,
    color: "gray",
    label: "Add games",
    link: "/admin/add-game",
  },
  {
    icon: <IconEditCircle size={16} />,
    color: "gray",
    label: "View /Edit games",
    link: "/admin",
  },
  {
    icon: <IconMessages size={16} />,
    color: "gray",
    label: "Add game genre",
    link: "/admin/add-game-genre",
  },
  {
    icon: <IconMessages size={16} />,
    color: "gray",
    label: "Add game platform",
    link: "/admin/add-platform",
  },
];

const userData = [
  {
    icon: <IconUser size={16} />,
    color: "gray",
    label: "Add user",
    link: "/admin/add-user",
  },

  {
    icon: <IconLogin size={16} />,
    color: "gray",
    label: "Logout",
    link: "/admin/logout",
  },
];

export function GameMainLinks() {
  const links = gameData.map((link) => <MainLink {...link} key={link.label} />);
  return <div>{links}</div>;
}

export function UserMainLinks() {
  const links = userData.map((link) => <MainLink {...link} key={link.label} />);
  return <div>{links}</div>;
}
