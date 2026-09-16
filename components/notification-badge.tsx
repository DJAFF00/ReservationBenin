export function NotificationBadge({ count }: { count: number }) {
    if (!count || count <= 0) return null;
  
    return (
      <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[11px] font-semibold leading-none text-danger-foreground">
        {count > 9 ? "9+" : count}
      </span>
    );
  }