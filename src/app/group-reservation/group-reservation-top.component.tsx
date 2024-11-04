import Image from 'next/image';

export default function GroupReservationTop() {
  return (
    <>
      <div className="grid justify-items-start m-4">
        <Image
          src="/images/main_logo_invert.png"
          width={350}
          height={150}
          alt="Logo"
        />
      </div>
      <div className="grid justify-items-end m-3">
        <Image
          src="/images/top_image.png"
          width={300}
          height={50}
          alt="group-reservation"
        />
      </div>
    </>
  );
}
