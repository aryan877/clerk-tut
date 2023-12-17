'use client'
import { SignUp } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { Center, useMantineColorScheme, Title, Stack } from '@mantine/core';

export default function Page() {

  const {  colorScheme } = useMantineColorScheme();
  const appearance = {
    ...(colorScheme === 'dark' ? { baseTheme: dark } : {}),
  };
  return (
    <Center h="100vh">
      <Stack>
        <Title>Clerk Tutorial Sign Up</Title>
        <SignUp appearance={appearance} />
      </Stack>
    </Center>
  );
}
