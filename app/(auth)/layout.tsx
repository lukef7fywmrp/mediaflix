function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100svh-4rem)]">
      {children}
    </div>
  );
}

export default AuthLayout;
