"use client";
import { useCallback, useState, type ReactNode } from "react";

export default function Dropzone({
  accept,
  onDrop,
  className,
  children,
}: {
  accept: string[];
  onDrop: (file: File) => void;
  className?: string;
  children?: ReactNode;
}) {
  const [over, setOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) onDrop(file);
    },
    [onDrop]
  );

  return (
    <div
      className={`${className ?? ""} ${over ? "border-zinc-500" : ""}`}
      onDragOver={e => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={handleDrop}
    >
      <label className="block">
        {children}
        <input
          type="file"
          accept={accept.join(",")}
          className="hidden"
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) onDrop(file);
            e.target.value = "";   // ← allow re-upload of same file
          }}
        />
      </label>
    </div>
  );
}