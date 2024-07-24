'use client';

import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@/components/ui/modal';
import { ModalFunction } from '@/types';

export default function ProfileChangePassword({ onClose }: ModalFunction) {
  return (
    <Modal>
      <ModalHeader onClose={onClose}>
        <div>모달 헤더</div>
      </ModalHeader>
      <ModalContent>
        모달 내용모달 내용모달 내용모달 내용모달 내용모달 내용모달 내용모달
        <br />
        내용모달 내용모달 내용모달 내용모달 내용모달 내용모달 내용 aaaaaaaaa
      </ModalContent>
      <ModalFooter>버튼영역</ModalFooter>
    </Modal>
  );
}
