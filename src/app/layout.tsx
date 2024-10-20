"use client";
import localFont from "next/font/local";
import "./globals.css";
import { ChakraProvider } from '@chakra-ui/react'
import theme from "../theme";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
// Metadata should be moved to a separate file for client components
// For example, create a new file named 'metadata.ts' in the same directory
// and export the metadata from there.
// Then import it in server components where needed.
// Example of how to use metadata in a server component:
// import { metadata } from './metadata';
// export { metadata };


export default function RootLayout({
  children,

}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ChakraProvider theme={theme}>
          {children}
        </ChakraProvider>
      </body>

    </html>
    );
  
}