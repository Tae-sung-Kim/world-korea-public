import { Button } from '@/components/ui/button';
import React from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';

type IconDeleteButtonProps = {
  onDelete: (e?: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function IconDeleteButton({ onDelete }: IconDeleteButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="hover:bg-destructive/10"
      onClick={onDelete}
    >
      <RiDeleteBin6Line className="icon-delete" />
    </Button>
  );
}
