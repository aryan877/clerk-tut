"use client";
import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Center, useMantineColorScheme, Title, Stack } from "@mantine/core";

export default function Page() {
  const { colorScheme } = useMantineColorScheme();
  const appearance = {
    ...(colorScheme === "dark" ? { baseTheme: dark } : {}),
  };
  return (
    <Center h="100vh">
      <Stack>
        <Title>Clerk Tutorial Sign In</Title>
        <SignIn appearance={appearance} />
      </Stack>
    </Center>
  );
}
