'use client';

import ProfileChangePassword from './profile-change-password';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import userService from '@/services/user.service';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ProfileDetail() {
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { isFetching, data: currentUserData } = useQuery({
    queryKey: ['userService.getCurrentUser'],
    queryFn: userService.getCurrentUser,
  });

  const handleUpdate = () => {
    router.push('/my/profile/edit');
  };

  //모달창 오픈
  const handleModalOpen = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <>
      <h1 className="text-2xl font-semibold text-center p-4">회원 정보</h1>

      <div className="container relative">
        <div className="absolute right-0 -top-[40px]">
          <Button onClick={handleModalOpen}>비밀번호 변경</Button>
        </div>
      </div>
      <div className="container space-y-8">
        <div className="space-y-2">
          <Label>아이디</Label>
          <Input readOnly disabled value={currentUserData?.loginId ?? ''} />
        </div>

        <div className="space-y-2">
          <Label>업체명</Label>
          <Input readOnly disabled value={currentUserData?.companyName ?? ''} />
        </div>

        <div className="space-y-2">
          <Label>업체 번호</Label>
          <Input readOnly disabled value={currentUserData?.companyNo ?? ''} />
        </div>
        <div className="space-y-2">
          <Label>주소</Label>
          <Input readOnly disabled value={currentUserData?.address ?? ''} />
        </div>
        <div className="space-y-2">
          <Label>연락처</Label>
          <Input
            readOnly
            disabled
            value={currentUserData?.contactNumber ?? ''}
          />
        </div>
        <div className="space-y-2">
          <Label>이름</Label>
          <Input readOnly disabled value={currentUserData?.name ?? ''} />
        </div>
        <div className="space-y-2">
          <Label>휴대폰</Label>
          <Input
            readOnly
            disabled
            value={currentUserData?.contactNumber ?? ''}
          />
        </div>
        <div className="space-y-2">
          <Label>이메일</Label>
          <Input readOnly disabled value={currentUserData?.email ?? ''} />
        </div>
        <Button className="ml-2" disabled={isFetching} onClick={handleUpdate}>
          수정하기
        </Button>
      </div>

      {isModalOpen && <ProfileChangePassword onClose={handleClose} />}
    </>
  );
}
