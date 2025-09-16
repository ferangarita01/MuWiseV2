
import { cn } from "@/lib/utils";

export function DocumentLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-white rounded-md shadow-lg w-full max-w-4xl mx-auto print:shadow-none print:rounded-none text-black",
        className
      )}
    >
      {/* A4 aspect ratio padding-bottom */}
      <div 
        className="p-8 md:p-12 lg:p-16 space-y-8 print:p-12"
        style={{ fontFamily: "'Times New Roman', Times, serif", lineHeight: 1.5 }}
      >
        {children}
      </div>
    </div>
  );
}
