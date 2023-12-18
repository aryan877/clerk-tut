"use client";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { AppShell, Box, Burger, Group, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Navbar from "@/components/Navbar";
import PostListComponent from "@/components/PostList";


export default function HomePage() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header p="md">
        <Group justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Title order={4}>LCO</Title>
            <OrganizationSwitcher
              afterSelectOrganizationUrl="/"
              afterSelectPersonalUrl="/"
            />
          </Group>
          <UserButton afterSignOutUrl="/sign-in" />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Navbar/>
      </AppShell.Navbar>

      <AppShell.Main>
        <PostListComponent/>
      </AppShell.Main>
    </AppShell>
  );
}
