'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import MatrixCanvas from './components/MatrixCanvas/MatrixCanvas';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    // Запрос данных профиля
    fetch('/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user);
          console.log(data.user);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {user ? (
          <div>
            <h2>Welcome, {user.email}!</h2>
            <p>Your ID: {user._id}</p>
            logout

            <MatrixCanvas />

            <a className={styles.secondary} href="/logout">
              Logout
            </a>
        
          </div>
        ) : (
          <div>
            <p>You are not logged in.</p>
            <a className={styles.primary} href="/login">
              Login
            </a>
            <a className={styles.secondary} href="/register">
              Register
            </a>
          </div>
        )}

        <div className={styles.ctas}>
      
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>

      </footer>
    </div>
  );
}
