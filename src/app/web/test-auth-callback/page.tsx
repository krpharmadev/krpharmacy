'use client';
import { auth, signIn, signOut } from '@/lib/auth';
import { useEffect, useState } from 'react';

export default function TestAuthCallbackPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const s = await auth();
      setSession(s);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div>กำลังโหลด...</div>;

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h1>ทดสอบ Auth Callback & Session</h1>
      <pre style={{ background: '#f8f8f8', padding: 16, borderRadius: 4, fontSize: 14 }}>
        {JSON.stringify(session, null, 2)}
      </pre>
      <div style={{ marginTop: 24 }}>
        <button
          style={{ marginRight: 12, padding: '8px 16px', borderRadius: 4, border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}
          onClick={() => signIn()}
        >
          Sign In
        </button>
        <button
          style={{ padding: '8px 16px', borderRadius: 4, border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}
          onClick={() => signOut()}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
} 