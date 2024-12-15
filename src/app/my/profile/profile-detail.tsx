'use client';

import ProfileChangePasswordModal from './profile-change-password.modal';
import { ProfileStep } from './profile.constant';
import { useGetCurentUserQuery } from '@/app/admin/queries';
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
    <div className="min-h-screen">
      <div className="container px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold">회원 정보</h1>
            <Button
              onClick={handleModalOpen}
              variant="outline"
              className="hover:bg-gray-100"
            >
              비밀번호 변경
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  value={currentUserData?.contactNumber ?? ''}
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
              className="relative inline-flex items-center px-8 py-3 overflow-hidden text-lg font-medium transition duration-300 ease-out rounded-lg group bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              <span className="relative flex items-center gap-2">
                <MdOutlineEdit className="text-xl" />
                정보 수정
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
