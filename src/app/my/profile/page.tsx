import ProfileClient from './profile.client';
import { Toaster } from 'sonner';

export default function ProfilePage() {
  //비밀번호 먼저 확인
  return (
    <>
      <Toaster position="bottom-center" expand={true} richColors />
      <ProfileClient />
    </>
  );
}
