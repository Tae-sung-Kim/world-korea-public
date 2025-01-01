import Image from 'next/image';

export default function GroupReservationTop() {
  return (
    <div className="flex justify-between items-center px-4 py-6 md:px-6 md:py-8 bg-white shadow-sm">
      <Image
        src="/images/main_logo_invert.png"
        width={350}
        height={150}
        alt="Logo"
        className="w-[200px] md:w-[250px] h-auto"
      />
      <Image
        src="/images/top_image.png"
        width={300}
        height={50}
        alt="group-reservation"
        className="w-[200px] md:w-[250px] h-auto"
      />
    </div>
  );
}
