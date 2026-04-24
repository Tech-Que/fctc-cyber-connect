import { AppThemeDefault } from "@/components/layout/AppThemeDefault";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppThemeDefault />
      {children}
    </>
  );
}
