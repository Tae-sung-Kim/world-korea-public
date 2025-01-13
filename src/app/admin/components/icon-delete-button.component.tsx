import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';

type IconDeleteButtonProps = {
  variant?: ButtonProps['variant'];
  className?: string;
  onDelete: (e?: React.MouseEvent<HTMLButtonElement>) => void;
};
export default function IconDeleteButton({
  variant,
  className,
  onDelete,
}: IconDeleteButtonProps) {
  return (
    <Button
      variant={variant ?? 'ghost'}
      size="icon"
      className={cn('hover:bg-destructive/10', className)}
      onClick={onDelete}
    >
      <RiDeleteBin6Line className="icon-delete" />
    </Button>
  );
}
