import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import { ThemeProvider, useTheme } from "next-themes";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import NextNProgress from "nextjs-progressbar";

export default function App({ Component, pageProps }) {

  const [user, setUser] = useState({ value: null })
  const { theme, setTheme } = useTheme();
  setTheme("dark")
  const router = useRouter();

  const getUserInfo = async (token) => {
    let a = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/users/getUserInfo`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    })
    let data = await a.json();
    return data;
  }
  useEffect(() => {

    let token = localStorage.getItem('MeraNewsCMSToken');
    if (token) {
      getUserInfo(token).then((userData) => {
        if (userData.success) {
          setUser({ value: token, email: userData.email, firstname: userData.firstname, lastname: userData.lastname, username: userData.username, roleId: userData.roleId });
        }
        else {
          if (userData.message.name == "TokenExpiredError") {
            toast.error("Session Expired. Please Login Again.");

          } else {
            toast.error("Some Error Occured!");
          }
          logout();
        }
      });
    }
  }, [router.query])

  const logout = () => {
    localStorage.removeItem('MeraNewsCMSToken');
    setUser({ value: null });
    toast.success("Logged Out Successfully.")
    setTimeout(() => {
      router.push('/login')
    }, 1000);
  }

  return <>
    <NextNProgress color='#3b82f6' startPosition={0.3} stopDelayMs={400} height={2} showOnShallow={true} />
    <div className="font-display">
      <Toaster toastOptions={{
        style: {
          background: '#17255499',
          color: '#fff',
        }
      }} />
      <Navbar user={user} logout={logout} />
      <ThemeProvider themes={theme}>
        <Component user={user} {...pageProps} />
      </ThemeProvider>
    </div>
  </>;
}
