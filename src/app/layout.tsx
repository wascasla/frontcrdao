"use client"

import Header from "../components/header";
import AppProvider from "../context/AppProvider";
import "./globals.css";
import { Inter } from "next/font/google";
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "RDAO",
  description: "RDao",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <AppProvider>
          <Header></Header>
          <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <section>{children}</section>
          </main>
        <ToastContainer
          hideProgressBar
          position="bottom-right"
          autoClose={3000}
          />
          </AppProvider>
      </body>
    </html>
  );
}
