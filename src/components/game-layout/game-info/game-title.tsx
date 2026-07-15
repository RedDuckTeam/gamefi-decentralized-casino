export default function GameTitle({ title }: { title: string }) {
  return (
    <div className="flex w-full items-center">
      <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent from-20% to-[#434B71]" />
      <h2
        className="px-16 text-[32px] font-semibold uppercase tracking-[1px] text-[#9747FF]"
        data-cy="gameTitle"
      >
        {title}
      </h2>
      <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent from-20% to-[#434B71]" />
    </div>
  );
}
