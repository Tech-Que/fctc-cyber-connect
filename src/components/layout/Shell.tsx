import { Nav } from "./Nav";
import { Footer } from "./Footer";
import type { AuthUser } from "@/lib/auth/types";

export function Shell({
  user,
  children,
}: {
  user: AuthUser | null;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-bg-base text-text-primary">
      <Nav user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
