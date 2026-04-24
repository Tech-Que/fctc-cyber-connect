import { PublicThemeDefault } from "@/components/layout/PublicThemeDefault";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicThemeDefault />
      {children}
    </>
  );
}
