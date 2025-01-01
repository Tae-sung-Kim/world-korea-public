import cn from 'classnames';

export default function ListWrapper({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('list-container', className)}>
      <div className="list-content-wrapper">
        <div className="absolute inset-0 overflow-auto">
          <div className="min-w-[1024px]">{children}</div>
        </div>
      </div>
    </div>
  );
}
