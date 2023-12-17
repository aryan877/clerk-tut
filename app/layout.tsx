import "@mantine/core/styles.css";
import { ClerkLoaded, ClerkProvider } from "@clerk/nextjs";
import React from "react";
import { dark } from "@clerk/themes";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { theme } from "../theme";

export const metadata = {
  title: "Mantine Next.js template",
  description: "I am using Mantine with Next.js!",
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <ClerkProvider
          appearance={{
            baseTheme: dark,
          }}
        >
          <ClerkLoaded>
            <MantineProvider defaultColorScheme="dark" theme={theme}>
              {children}
            </MantineProvider>
          </ClerkLoaded>
        </ClerkProvider>
      </body>
    </html>
  );
}
