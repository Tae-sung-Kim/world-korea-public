'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User } from '@/definitions';

interface UserCardProps {
  user: User;
  onClick: (user: User) => void;
}

export default function UserCard({ user, onClick }: UserCardProps) {
  const {
    userCategory,
    loginId,
    name,
    companyNo,
    companyName,
    email,
    contactNumber,
    createdAt,
    isApproved,
    isPartner,
  } = user;

  return (
    <Card
      onClick={() => onClick(user)}
      className="cursor-pointer hover:shadow-md transition-shadow border border-gray-200"
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg break-words whitespace-normal">
              {name}
            </h3>
            <p className="text-sm text-gray-500 break-words whitespace-normal">
              {loginId}
            </p>
          </div>
          <div className="flex gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                isPartner
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {isPartner ? '파트너' : '일반'}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                isApproved
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {isApproved ? '승인' : '미승인'}
            </span>
          </div>
        </div>
      </CardHeader>
      <Separator className="mb-3" />
      <CardContent>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-3 gap-2 items-center">
            <span className="text-gray-500 break-words whitespace-normal">분류</span>
            <span className="col-span-2 font-medium break-words whitespace-normal">{userCategory?.name}</span>
          </div>
          <Separator className="my-2" />
          <div className="grid grid-cols-3 gap-2 items-center">
            <span className="text-gray-500 break-words whitespace-normal">업체명</span>
            <span className="col-span-2 font-medium break-words whitespace-normal">{companyName}</span>
          </div>
          <Separator className="my-2" />
          <div className="grid grid-cols-3 gap-2 items-center">
            <span className="text-gray-500 break-words whitespace-normal">업체번호</span>
            <span className="col-span-2 font-medium break-words whitespace-normal">{companyNo}</span>
          </div>
          <Separator className="my-2" />
          <div className="grid grid-cols-3 gap-2 items-center">
            <span className="text-gray-500 break-words whitespace-normal">이메일</span>
            <span className="col-span-2 font-medium break-words whitespace-normal">{email}</span>
          </div>
          <Separator className="my-2" />
          <div className="grid grid-cols-3 gap-2 items-center">
            <span className="text-gray-500 break-words whitespace-normal">연락처</span>
            <span className="col-span-2 font-medium break-words whitespace-normal">{contactNumber}</span>
          </div>
          <Separator className="my-2" />
          <div className="grid grid-cols-3 gap-2 items-center">
            <span className="text-gray-500 break-words whitespace-normal">등록일</span>
            <span className="col-span-2 font-medium break-words whitespace-normal">
              {createdAt && new Date(createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
