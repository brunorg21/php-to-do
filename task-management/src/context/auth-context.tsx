import { toast } from "@/components/ui/use-toast";
import { ISignIn } from "@/interfaces/sign-in";
import { ISignUp } from "@/interfaces/sign-up";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextProps {
  signIn(data: ISignIn): Promise<Response>;
  signUp: (data: ISignUp) => Promise<Response>;
  logOut: () => void;
  user: { nome: string } | null;
  loading: boolean;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ nome: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const me = async () => {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/usuarios.php", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          setUser(null);
        } else {
          const user = await response.json();
          setUser(user);
        }
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    me();
  }, []);

  async function signIn(data: ISignIn) {
    const response = await fetch("http://localhost:3000/login.php", {
      method: "POST",
      body: JSON.stringify({
        login: data.email,
        senha: data.password,
      }),
    });

    if (response.status === 401) {
      toast({
        title: "Credenciais inválidas.",
        description: "Por favor tente novamente.",
      });
    } else if (response.status === 200) {
      const result = await response.json();
      localStorage.setItem("token", result.token);

      setUser(result.user);
    }

    return response;
  }

  async function signUp(data: ISignUp) {
    const response = await fetch("http://localhost:3000/usuarios.php", {
      method: "POST",
      body: JSON.stringify({
        login: data.email,
        data_nascimento: data.birthDate,
        nome: data.name,
        sobrenome: data.surname,
        senha: data.password,
      }),
    });

    if (response.status === 200) {
      toast({
        title: "Usuário criado com sucesso!",
        description: "Clique em entrar agora.",
      });
    }

    return response;
  }

  function logOut() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signIn, signUp, logOut, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
