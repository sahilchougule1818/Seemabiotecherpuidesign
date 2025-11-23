import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Breadcrumbs() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  const formatSegment = (segment: string) => {
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="h-12 bg-white border-b border-border/50 px-6 flex items-center gap-2">
      <Link to="/" className="hover:text-[#4CAF50] transition-colors">
        <Home className="w-4 h-4" />
      </Link>
      {pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
        const isLast = index === pathSegments.length - 1;

        return (
          <div key={path} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-[#717182]" />
            {isLast ? (
              <span className="text-[#4CAF50]">{formatSegment(segment)}</span>
            ) : (
              <Link to={path} className="hover:text-[#4CAF50] transition-colors">
                {formatSegment(segment)}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
