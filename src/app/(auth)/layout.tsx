export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container flex items-center justify-center">
      <div className="w-[800px]">{children}</div>
    </div>
  );
}
