'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import userService from '@/services/user.service';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function ProfileDetail() {
  const router = useRouter();

  const {
    isFetching,
    isSuccess,
    isError,
    data: currentUserData,
    refetch,
  } = useQuery({
    queryKey: ['userService.getCurrentUser'],
    queryFn: userService.getCurrentUser,
  });

  const handleUpdate = () => {
    router.push('/my/profile/edit');
  };

  // useEffect(() => {
  //   if (isSuccess) {
  //     refetch();
  //     // toast.success('정보 조회가 완료 되었습니다.');
  //   }
  //   // if (isError) {
  //   //   toast.error('정보 조회중 오류가 발생하였습니다.');
  //   // }
  // }, [isSuccess, isError, refetch]);

  return (
    <>
      <h1 className="text-2xl font-semibold text-center p-4">회원 정보</h1>

      <div className="container">
        <Label>아이디</Label>
        <Input readOnly disabled value={currentUserData?.loginId ?? ''} />
        <Label>업체명</Label>
        <Input readOnly disabled value={currentUserData?.companyName ?? ''} />
        <Label>업체 번호</Label>
        <Input readOnly disabled value={currentUserData?.companyNo ?? ''} />
        <Label>주소</Label>
        <Input readOnly disabled value={currentUserData?.address ?? ''} />
        <Label>연락처</Label>
        <Input readOnly disabled value={currentUserData?.contactNumber ?? ''} />
        <Label>이름</Label>
        <Input readOnly disabled value={currentUserData?.name ?? ''} />
        <Label>휴대폰</Label>
        <Input readOnly disabled value={currentUserData?.contactNumber ?? ''} />
        <Label>이메일</Label>
        <Input readOnly disabled value={currentUserData?.email ?? ''} />

        <Button className="ml-2" disabled={isFetching} onClick={handleUpdate}>
          수정하기
        </Button>
      </div>
    </>
  );
}
