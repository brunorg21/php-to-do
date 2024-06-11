import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "./ui/textarea";
import { Dispatch, useState, useEffect } from "react";
import { toast } from "./ui/use-toast";
import { ActivitiesProps } from "@/pages/app/home/home";
import { cn } from "@/lib/utils";

import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";

interface NewTaskDialogProps {
  setEntities: Dispatch<React.SetStateAction<ActivitiesProps[]>>;
  activityToEdit?: ActivitiesProps | null;
}

export function NewTaskDialog({
  setEntities,
  activityToEdit,
}: NewTaskDialogProps) {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<Date>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activityToEdit) {
      setTitle(activityToEdit.titulo);
      setDescription(activityToEdit.descricao);
      setDate(new Date(activityToEdit.data_conclusao!));
    }
  }, [activityToEdit]);

  async function handleSubmit() {
    setLoading(true);

    const payload = {
      id: activityToEdit?.id,
      titulo: title,
      descricao: description,
      data_conclusao: date ? date.toISOString() : new Date().toISOString(),
    };

    const method = activityToEdit ? "PUT" : "POST";
    const url = `http://localhost:3000/atividades.php`;

    const response = await fetch(url, {
      method,
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.status === 200 && !activityToEdit) {
      const result = await response.json();

      setEntities((state) => [...state, result.atividade]);
      toast({
        title: "Tarefa criada com sucesso",
      });
    } else if (response.status === 200 && activityToEdit) {
      setEntities((state) => {
        const activityToEditIndex = state.findIndex(
          (activity) => activity.id === activityToEdit.id
        );

        const newState = [...state];

        newState[activityToEditIndex] = {
          id: activityToEdit.id,
          data_conclusao: date?.toISOString() ?? null,
          data_criacao: activityToEdit.data_criacao,
          descricao: description,
          id_usuario: activityToEdit.id_usuario,
          titulo: title,
        };

        return newState;
      });

      toast({
        title: "Tarefa atualizada com sucesso",
      });
    }

    setLoading(false);
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Nova atividade</DialogTitle>
        <DialogDescription>
          Preencha os campos para criar uma nova atividade.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col items-start space-y-4">
          <Label htmlFor="title" className="text-right">
            Título
          </Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            id="title"
            className="col-span-3"
          />
        </div>
        <div className="flex flex-col items-start space-y-4">
          <Label htmlFor="description" className="text-right">
            Descrição
          </Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id="description"
            className="col-span-3 resize-none"
          />
        </div>
        <div className="flex flex-col items-start space-y-4">
          <Label htmlFor="date" className="text-right">
            Data de conclusão:
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] pl-3 text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                {date ? (
                  new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "full",
                    timeZone: "America/Sao_Paulo",
                  }).format(date)
                ) : (
                  <span>Selecione uma data</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                locale={ptBR}
                mode="single"
                selected={date!}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <DialogFooter>
        <Button
          className="disabled:cursor-not-allowed"
          onClick={handleSubmit}
          type="button"
          disabled={loading || !title || !description || !date}
        >
          {activityToEdit ? "Editar" : "Criar"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
