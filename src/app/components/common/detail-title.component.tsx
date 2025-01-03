import { RiArticleLine } from 'react-icons/ri';

export default function DetailTitle({ title }: { title: string }) {
  console.log(title);
  return (
    <>
      {title && (
        <div className="sticky top-[-16px] z-10 bg-white border-b rounded-lg shadow-sm mb-4">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <RiArticleLine className="w-4 h-4 text-primary" />
              <h1 className="text-base sm:text-lg font-medium bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {title}
              </h1>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
