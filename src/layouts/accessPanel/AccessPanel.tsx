import Link from 'next/link';

export default function AccessPanel() {
  return (
    <div className="h-9 flex justify-end">
      <Link href="/signin">로그인</Link>
      <Link href="/signup">회원가입</Link>
      <Link href="/admin/users">회원목록</Link>
    </div>
  );
}
