// frontend/app/page.tsx
import { API_URL } from './lib/api';

export default async function Home() {
  const res = await fetch(`${API_URL}/users`);

  return (
    <div>
      <h1>Usuários</h1>
    </div>
  );
}
