export default function Accordion({title, open, toggle, children}: {title: string; open: string | null; toggle: (title: string) => void; children: React.ReactNode}) {
  return (
    <div className="border-b pb-2">
      <div className="flex justify-between items-center cursor-pointer" onClick={() => toggle(title)}>
        <p className="font-semibold">{title}</p>
        <span>{open === title ? "▲" : "▼"}</span>
      </div>
      {open === title && <div className="mt-2 space-y-1">{children}</div>}
    </div>
  );
}
