export default function DetailTitle({ title }: { title: string }) {
  return (
    <>
      {title && (
        <div className="pb-4 sm:pb-6 mb-4 sm:mb-6 border-b">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>
      )}
    </>
  );
}
