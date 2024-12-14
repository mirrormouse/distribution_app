// pages/index.js
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ margin: '20px' }}>
      <h1>振り分けアプリ</h1>
      <Link href="/new">新しい振り分けの作成</Link>
    </div>
  );
}
