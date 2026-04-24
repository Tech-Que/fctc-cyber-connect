import { Nav } from "./Nav";
import { Footer } from "./Footer";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg-base text-text-primary">
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
