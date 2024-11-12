'use client';

import ProfileChangePasswordModal from './profile-change-password.modal';
import { ProfileStep } from './profile.constant';
import { useGetCurentUserQuery } from '@/app/admin/queries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useModalContext } from '@/contexts/modal.context';

export default function ProfileDetail({
  onStep,
}: {
  onStep: (type: ProfileStep) => void;
}) {
  const { openModal } = useModalContext();

  const currentUserData = useGetCurentUserQuery();

  const handleUpdate = () => {
    onStep(ProfileStep.ConfirmPassword);
  };

  //모달창 오픈
  const handleModalOpen = async () => {
    return await openModal({
      // type: MODAL_TYPE.CONFIRM,
      showHeader: false,
      showFooter: false,
      Component: ({ id, onOk, onCancel }) => {
        return (
          <ProfileChangePasswordModal id={id} onOk={onOk} onCancel={onCancel} />
        );
      },
      useOverlayClose: true,
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
        <Button
          className="ml-2"
          disabled={!currentUserData}
          onClick={handleUpdate}
        >
          수정하기
        </Button>
      </div>
    </>
  );
}
