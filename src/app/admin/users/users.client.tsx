'use client';

import { useUserListQuery } from '../queries';
import UserCard from './components/user-card.component';
import { User } from '@/definitions';
import { useRouter } from 'next/navigation';

export default function UsersClient() {
  const userList = useUserListQuery();
  const router = useRouter();

  const handleUserClick = (user: User) => {
    router.push(`/admin/users/${user._id}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userList.map((user) => (
          <UserCard key={user._id} user={user} onClick={handleUserClick} />
        ))}
      </div>
    </div>
  );
}
