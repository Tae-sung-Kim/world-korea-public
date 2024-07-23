'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import userService from '@/services/user.service';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export default function ProfileDetail() {
  const router = useRouter();

  const { isFetching, data: currentUserData } = useQuery({
    queryKey: ['userService.getCurrentUser'],
    queryFn: userService.getCurrentUser,
  });

  const handleUpdate = () => {
    router.push('/my/profile/edit');
  };

  return (
    <>
      <h1 className="text-2xl font-semibold text-center p-4">회원 정보</h1>

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
    </>
  );
}
