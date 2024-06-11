import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FormEvent, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Link } from "react-router-dom";

export function SignUp() {
  const [date, setDate] = useState<Date>();
  const { signUp } = useAuth();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await signUp({
      birthDate: new Date(),
      email: event.currentTarget.email.value,
      name: event.currentTarget.firstName.value,
      password: event.currentTarget.password.value,
      surname: event.currentTarget.surname.value,
    });

    console.log(response);
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Cadastro</CardTitle>
        <CardDescription>
          Crie sua conta e comece a gerenciar suas tarefas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="firstName">Nome</Label>
              <Input type="text" id="firstName" placeholder="Nome" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="surname">Sobrenome</Label>
              <Input type="surname" id="surname" placeholder="Nome" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input type="email" id="email" placeholder="Digite seu e-mail" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Senha</Label>
              <Input type="password" id="password" placeholder="Senha" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="confirmPassword">Cofirme sua senha</Label>
              <Input
                type="password"
                id="confirmPassword"
                placeholder="Confirme sua senha"
              />
            </div>
            <Label htmlFor="birthDate">Data de nascimento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Selecione uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  id="birthDate"
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
            <Button>Cadastrar</Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex text-sm items-center">
        Já possui conta.
        <Link to={"/auth/sign-in"}>
          <Button variant={"link"}>Entrar agora</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
