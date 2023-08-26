const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-full bg-[#111827]">
      {" "}
      <div className="mx-auto max-w-screen-xl h-full">{children}</div>
    </main>
  );
};

export default LandingLayout;

// "({ children }: { children: React.ReactNode })" - деструктурированное свойсво "children", которое ожидает дочерние элементы React
