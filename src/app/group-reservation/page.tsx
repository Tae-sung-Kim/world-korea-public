import GroupReservationClient from './group-reservation.client';
import Image from 'next/image';

export default function GroupReservationPage() {
  return (
    <div className="w-full h-full">
      <div className="grid justify-items-start">
        <Image
          src="/images/main_logo_invert.png"
          width={350}
          height={150}
          alt="Logo"
        />
      </div>
      <div className="grid justify-items-end">
        <Image
          src="/images/top_image.png"
          width={300}
          height={50}
          alt="group-reservation"
        />
      </div>
      <GroupReservationClient />
    </div>
  );
}
