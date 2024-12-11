'use client';

import { useEffect, useState } from 'react';

export default function ProfilePage() {
  interface User {
    _id: string;
    email: string;
  }

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUser(data.user);
      });
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome, {user.email}!</h1>
      <p>Your ID: {user._id}</p>
    </div>
  );
}
