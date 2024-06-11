import { AutomaticType } from "@/components/automatic-type";

export function Credit() {
  const students = [
    {
      name: "Gestor de Atividades",
    },
    {
      name: "Bianca Letícia",
    },
    {
      name: "Bruno Rafael",
    },
    {
      name: "Lukas Guilherme",
    },
    {
      name: "Milene Oliveira",
    },
    {
      name: "Victor Hugo Magno",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-10">
      {students.map((student) => (
        <AutomaticType text={student.name} />
      ))}
    </div>
  );
}
