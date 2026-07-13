export const ActivatedCode = ({ activatedCode }: { activatedCode: string }) => {
  return (
    <div className="my-auto flex flex-col items-center gap-2 pb-4 pt-2">
      <p className="w-full truncate text-center text-3xl font-semibold">
        {activatedCode}
      </p>
      <p className="text-sm text-[#8C98A9]">Code provided</p>
    </div>
  );
};
