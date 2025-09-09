import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "@/app/globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "next-themes"
import { App as AntdApp } from "antd"

export const metadata: Metadata = {
  title: "ServiceHub",
  description: "ServiceHub - Your one-stop solution for all your service needs",
  generator: "ServiceHub",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <AntdApp>{children}</AntdApp>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
