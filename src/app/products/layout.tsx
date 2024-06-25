export default function ProductsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <h1>상품 리스트</h1>
      <hr />
      {children}
    </>
  );
}
