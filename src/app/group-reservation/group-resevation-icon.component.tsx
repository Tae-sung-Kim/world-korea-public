import Image from 'next/image';

type ReservationIconProps = {
  url: string;
  src: string;
  alt: string;
};

export default function GroupReservationIcon({
  url,
  alt,
  src,
}: ReservationIconProps) {
  return (
    <div 
      className="flex flex-col items-center p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200"
      onClick={() => window.open(url, '_blank')}
    >
      <Image
        src={src}
        alt={alt ?? ''}
        width={50}
        height={50}
        className="sm:w-[60px] sm:h-[60px] transform hover:scale-105 transition-transform duration-200"
      />
      <span className="mt-1 text-sm text-gray-600">{alt}</span>
    </div>
  );
}
