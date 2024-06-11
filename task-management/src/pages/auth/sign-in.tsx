import { Button } from "@/components/ui/button";
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
import { useAuth } from "@/context/auth-context";
import { LoaderCircle } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function SignIn() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    setIsLoading(true);
    event.preventDefault();
    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;

    const response = await signIn({
      email,
      password,
    });
    if (response.status === 200) {
      navigate("/");
    }
    setIsLoading(false);
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Preencha suas credenciais para acessar nosso sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input type="email" id="email" placeholder="Digite seu e-mail" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Senha</Label>
              <Input type="password" id="password" placeholder="Senha" />
            </div>
            <Button className="flex items-center gap-6" variant="default">
              {isLoading && (
                <span
                  className={`${
                    isLoading && "animate-spin disabled:cursor-not-allowed"
                  }`}
                >
                  <LoaderCircle />
                </span>
              )}
              Entrar
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button asChild variant="link">
          <Link to="/auth/sign-up">Crie sua conta agora</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
