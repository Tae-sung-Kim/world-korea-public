'use client';

import ProfileConfirmPassword from './profile-confirm-password';
import ProfileDetail from './profile-detail';
import ProfileEdit from './profile-edit';
import { ProfileStep } from './profile.constant';
import userService from '@/services/user.service';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ProfileClient() {
  const [isVerifiedPassword, setIsVerifiedPassword] = useState(false);
  const [step, setStep] = useState(ProfileStep.Detail);

  const verifiedPassword = useMutation({
    mutationFn: userService.verifyPassword,
    onSuccess: (data: boolean) => {
      setIsVerifiedPassword(data);
      if (!data) {
        toast.error('비밀번호가 일치 하지 않습니다. 다시 확인하여 주세요.');
      } else {
        setStep(ProfileStep.Edit);
      }
    },
    onError: () => {
      toast.error(
        '비밀번호 확인중 에러가 발생하였습니다. 다시 확인하여 주세요.'
      );
    },
  });

  //number값에 따라 정의
  const handleStep = (type: ProfileStep) => {
    setStep(type);
  };

  return (
    <>
      {/* 회원정보 보기*/}
      {step === ProfileStep.Detail && <ProfileDetail onStep={handleStep} />}
      {/* 비번 확인 창 */}
      {step === ProfileStep.ConfirmPassword && (
        <ProfileConfirmPassword onVerifyPassword={verifiedPassword.mutate} />
      )}
      {/* 회원정보 변경 */}
      {step === ProfileStep.Edit && isVerifiedPassword && (
        <ProfileEdit onStep={handleStep} />
      )}
    </>
  );
}
