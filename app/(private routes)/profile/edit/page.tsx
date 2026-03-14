'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getMe, updateMe } from '../../../../lib/api/clientApi';
import { useAuthStore } from '../../../../lib/store/authStore';
import { User } from '../../../../types/user';
import css from './EditProfilePage.module.css';

export default function EditProfilePage() {
  const [user, setUserData] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe();
        setUserData(data);
        setUsername(data.username);
      } catch (error) {
        console.error('Failed to fetch user data for edit', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const updatedUser = await updateMe({ username });
      setUser(updatedUser); // Update zustand store
      router.push('/profile');
    } catch (error) {
      console.error('Failed to update user', error);
    }
  };

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>Loading...</div>;
  if (!user) return <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>Failed to load user data</div>;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user.avatar || 'https://ac.goit.global/fullstack/react/notehub-avatar.png'}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={handleSave}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button type="button" className={css.cancelButton} onClick={() => router.push('/profile')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
