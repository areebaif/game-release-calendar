import { requireAdminUser } from "~/utils";
import { UserPropsForClient } from "~/utils/types";
import { useNavigate } from "@remix-run/react";
import { User } from "./User";
import { Navbar, ThemeIcon, UnstyledButton, Group, Text } from "@mantine/core";
import {
  IconMessages,
  IconDatabase,
  IconLogin,
  IconAlertCircle,
  IconUser,
} from "@tabler/icons-react";

export const AdminNavigation: React.FC<UserPropsForClient> = (props) => {
  const user = props!;
  return (
    <Navbar p="xs" width={{ base: 275 }}>
      <Navbar.Section grow mt="md">
        <MainLinks />
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
  return (
    <UnstyledButton
      sx={(theme) => ({
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
      })}
      onClick={() => {
        navigate(link);
      }}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>
        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
}

const data = [
  {
    icon: <IconDatabase size={16} />,
    color: "teal",
    label: "Add Game",
    link: "/admin/addGame",
  },
  {
    icon: <IconMessages size={16} />,
    color: "blue",
    label: "Add Gaming Platform",
    link: "/admin/addPlatform",
  },
  {
    icon: <IconUser size={16} />,
    color: "violet",
    label: "Add User",
    link: "/admin/addUser",
  },
  {
    icon: <IconAlertCircle size={16} />,
    color: "orange",
    label: "Admin Dashboard",
    link: "/admin",
  },
  {
    icon: <IconLogin size={16} />,
    color: "red",
    label: "Logout",
    link: "/admin/logout",
  },
];

export function MainLinks() {
  const links = data.map((link) => <MainLink {...link} key={link.label} />);
  return <div>{links}</div>;
}
