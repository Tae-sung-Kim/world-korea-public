'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useModalContext, MODAL_TYPE } from '@/contexts/modal.context';
import userService from '@/services/user.service';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export default function ProfileDetail() {
  const router = useRouter();
  const { openModal } = useModalContext();

  const { isFetching, data: currentUserData } = useQuery({
    queryKey: ['userService.getCurrentUser'],
    queryFn: userService.getCurrentUser,
  });

  const handleUpdate = () => {
    router.push('/my/profile/edit');
  };

  //모달창 오픈
  const handleModalOpen = () => {
    openModal({
      type: MODAL_TYPE.ALERT,
      title: '타이틀 테스트 입니다',
      content: '내용 테스트 입니다.',
      cancelName: 'aaaaaaaaa',
      useOkClose: false,
      // useOverlayClose: true,
      onOk: () => {
        openModal({
          type: MODAL_TYPE.ALERT,
          title: 'asdasdasdasdasd',
          content: 'kljsdfjasdlfkl;ajsdf;klajsd;fkl',
          cancelName: 'bbbbbbbbbbb',
        });
      },
    });
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
    </>
  );
}
