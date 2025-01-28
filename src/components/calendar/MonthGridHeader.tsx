export function MonthGridHeader() {
  return (
    <>
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div
          key={day}
          className="text-sm font-medium text-muted-foreground text-center pb-2"
        >
          {day}
        </div>
      ))}
    </>
  );
}