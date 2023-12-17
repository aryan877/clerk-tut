'use client';
import { AppShell, Box, Burger, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import LoginButton from '@/components/LoginButton';

export default function HomePage({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header p="md">
        <Group justify='space-between'>
          <Box>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Text>LCO</Text>
          </Box>
          <LoginButton />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Text>Navbar</Text>
      </AppShell.Navbar>

      <AppShell.Main>Main</AppShell.Main>
    </AppShell>
  );
}
