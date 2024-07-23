'use client';

import ProfileConfirmPassword from './profile-confirm-password';
import ProfileDetail from './profile-detail';
import userService from '@/services/user.service';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ProfileClient() {
  const [isVerifiedPassword, setIsVerifiedPassword] = useState(false);

  const verifiedPassword = useMutation({
    mutationFn: userService.verifyPassword,
    onSuccess: (data: boolean) => {
      setIsVerifiedPassword(data);
      if (!data) {
        toast.error('비밀번호가 일치 하지 않습니다. 다시 확인하여 주세요.');
      }
    },
    onError: () => {
      toast.error(
        '비밀번호 확인중 에러가 발생하였습니다. 다시 확인하여 주세요.'
      );
    },
  });

  return (
    <>
      {isVerifiedPassword ? (
        <ProfileDetail />
      ) : (
        <ProfileConfirmPassword onVerifyPassword={verifiedPassword.mutate} />
      )}
    </>
  );
}
