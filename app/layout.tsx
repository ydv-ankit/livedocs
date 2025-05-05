import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Provider from "./provider";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "LiveDocs",
	description: "Live document collaborator built",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider
			appearance={{
				baseTheme: dark,
				variables: {
					colorPrimary: "#3371FF",
					fontSize: "16px",
				},
			}}>
			<html lang="en" suppressHydrationWarning>
				<body className={`min-h-screen custom-scrollbar antialiased dark`}>
					<Provider>{children}</Provider>
				</body>
			</html>
		</ClerkProvider>
	);
}
