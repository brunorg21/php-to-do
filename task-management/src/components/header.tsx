import { Separator } from "./ui/separator";
import { NavLink } from "./nav-link";
import { Menu } from "./menu";

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center gap-6 px-6">
        <span className="text-2xl font-bold">Gerenciador de Tarefas</span>
        <Separator orientation="vertical" className="h-6" />
        <nav className="flex items-center space-x-4 lg:space-x-6">
          <NavLink to="/">Início</NavLink>
          <NavLink to="/credit">Créditos</NavLink>
        </nav>
        <Menu />
      </div>
    </div>
  );
}
