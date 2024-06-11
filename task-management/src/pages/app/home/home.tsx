import { NewTaskDialog } from "@/components/new-task-dialog";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { PopoverClose } from "@radix-ui/react-popover";
import { format } from "date-fns";

import { Check, Loader, MoreVerticalIcon, Plus } from "lucide-react";
import { useEffect, useState } from "react";

export interface ActivitiesProps {
  id: number;
  titulo: string;
  data_criacao: string;
  data_conclusao: string;
  id_usuario: number;
  descricao: string;
  status?: string;
}

export function Home() {
  const [activities, setActivities] = useState<ActivitiesProps[]>([]);
  const [activityToEdit, setActivityToEdit] = useState<ActivitiesProps | null>(
    null
  );

  useEffect(() => {
    async function getActivities() {
      const response = await fetch("http://localhost:3000/atividades.php", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();

      setActivities(result);
    }

    getActivities();
  }, []);

  useEffect(() => {
    const expiredTask = activities.filter(
      (activity) => new Date(activity.data_conclusao) < new Date()
    );

    expiredTask.map((activity) =>
      toast({
        title: `A atividade ${activity.id} está expirada`,
      })
    );
  }, [activities]);

  async function handleDeleteTask(task: ActivitiesProps) {
    const response = await fetch(
      `http://localhost:3000/atividades.php?id=${task.id}`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status === 200) {
      setActivities((act) => {
        const newActs = act.filter((activity) => activity.id !== task.id);

        return newActs;
      });

      toast({
        title: "Atividade deletada com sucesso!",
      });
    }
  }
  async function handleUpdateTask(task: ActivitiesProps) {
    const response = await fetch(`http://localhost:3000/atividades.php`, {
      method: "PATCH",
      body: JSON.stringify({ id: task.id }),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.status === 200) {
      setActivities((state) => {
        const activityToEditIndex = state.findIndex(
          (activity) => activity.id === task.id
        );

        const newState = [...state];

        newState[activityToEditIndex] = {
          id: task.id,
          data_conclusao: task.data_conclusao,
          data_criacao: task.data_criacao,
          descricao: task.descricao,
          id_usuario: task.id_usuario,
          titulo: task.titulo,
          status: "concluído",
        };

        return newState;
      });

      toast({
        title: "Atividade realizada com sucesso!",
      });
    }
  }

  return (
    <div className="p-5 space-y-5">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Suas atividades</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              onClick={() => setActivityToEdit(null)}
              variant={"outline"}
              className="flex gap-2 items-center"
            >
              <Plus size={20} />
              Nova tarefa
            </Button>
          </DialogTrigger>
          <NewTaskDialog setEntities={setActivities} />
        </Dialog>
      </div>
      {activities.length !== 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Código</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Data de criação</TableHead>
                <TableHead>Data de conclusão</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.id}</TableCell>
                  <TableCell>{task.titulo}</TableCell>
                  <TableCell>{task.descricao}</TableCell>

                  <TableCell>
                    {format(new Date(task.data_criacao), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(task.data_conclusao!), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>
                    {task.status === "concluído" ? (
                      <Check color="green" size={20} />
                    ) : (
                      <Loader color="yellow" size={20} />
                    )}
                  </TableCell>
                  <TableCell>
                    <Popover>
                      <PopoverTrigger>
                        <Button size={"icon"} variant="outline">
                          <MoreVerticalIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40 flex flex-col gap-2">
                        <PopoverClose className="w-full gap-2 flex flex-col">
                          <Button
                            className="w-full"
                            variant={"destructive"}
                            onClick={async () => {
                              await handleDeleteTask(task);
                            }}
                          >
                            Deletar
                          </Button>
                          <Button
                            className="w-full flex items-center gap-4 bg-green-400"
                            variant={"default"}
                            onClick={async () => {
                              await handleUpdateTask(task);
                            }}
                          >
                            Concluir tarefa
                          </Button>
                        </PopoverClose>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              onClick={() => {
                                setActivityToEdit(task);
                              }}
                            >
                              Editar
                            </Button>
                          </DialogTrigger>
                          <NewTaskDialog
                            setEntities={setActivities}
                            activityToEdit={activityToEdit}
                          />
                        </Dialog>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div>Nenhuma tarefa cadastrada.</div>
      )}
    </div>
  );
}
