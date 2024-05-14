export default function GroupReservationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <h1>단체 예약</h1>
      <hr />
      {children}
    </>
  );
}
