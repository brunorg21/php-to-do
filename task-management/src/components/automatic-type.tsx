import { useEffect, useState } from "react";

export function AutomaticType({ text }: { text: string }) {
  const [type, setType] = useState("");

  useEffect(() => {
    const id = setTimeout(() => {
      setType(text.slice(0, type.length + 1));
    }, 70);
    return () => clearInterval(id);
  }, [text, type]);

  return (
    <div>
      <h1 className="text-6xl">{type}</h1>
    </div>
  );
}
