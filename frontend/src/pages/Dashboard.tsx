import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-bg text-text-primary flex flex-col items-center justify-center gap-4">
      <p className="font-display text-2xl">Welcome, {user?.name} 👋</p>
      <button
        onClick={logout}
        className="text-accent text-sm hover:underline font-body"
      >
        Log out
      </button>
    </div>
  );
}