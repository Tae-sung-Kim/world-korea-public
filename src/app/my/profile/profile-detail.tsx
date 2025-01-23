'use client';

import ProfileChangePasswordModal from './profile-change-password.modal';
import { ProfileStep } from './profile.constant';
import { useGetCurrentUserQuery } from '@/app/admin/queries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useModalContext } from '@/contexts/modal.context';
import { MdOutlineEdit } from 'react-icons/md';

export default function ProfileDetail({
  onStep,
}: {
  onStep: (type: ProfileStep) => void;
}) {
  const { openModal } = useModalContext();

  const currentUserData = useGetCurrentUserQuery();

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
    <div>
      <div className="container px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-8">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-semibold">회원 정보</h1>
            <Button
              onClick={handleModalOpen}
              variant="outline"
              className="hover:bg-gray-100 w-full sm:w-auto"
            >
              비밀번호 변경
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-500">아이디</Label>
                <Input
                  readOnly
                  disabled
                  value={currentUserData?.loginId ?? ''}
                  className="bg-gray-50 font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-500">업체명</Label>
                <Input
                  readOnly
                  disabled
                  value={currentUserData?.companyName ?? ''}
                  className="bg-gray-50 font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-500">업체 번호</Label>
                <Input
                  readOnly
                  disabled
                  value={currentUserData?.companyNo ?? ''}
                  className="bg-gray-50 font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-500">연락처</Label>
                <Input
                  readOnly
                  disabled
                  value={currentUserData?.contactNumber ?? ''}
                  className="bg-gray-50 font-medium"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-500">이름</Label>
                <Input
                  readOnly
                  disabled
                  value={currentUserData?.name ?? ''}
                  className="bg-gray-50 font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-500">휴대폰</Label>
                <Input
                  readOnly
                  disabled
                  value={currentUserData?.phoneNumber ?? ''}
                  className="bg-gray-50 font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-500">주소</Label>
                <Input
                  readOnly
                  disabled
                  value={currentUserData?.address ?? ''}
                  className="bg-gray-50 font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-500">이메일</Label>
                <Input
                  readOnly
                  disabled
                  value={currentUserData?.email ?? ''}
                  className="bg-gray-50 font-medium"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Button
              onClick={handleUpdate}
              disabled={!currentUserData}
              variant="utility"
            >
              <MdOutlineEdit className="text-xl mr-2" />
              정보 수정
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
