export default function TrustItem({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center justify-center gap-3 text-gray-600">
      <div className="text-blue-600">
        {icon}
      </div>

      <span className="text-xs font-bold sm:text-sm">
        {title}
      </span>
    </div>
  );
}