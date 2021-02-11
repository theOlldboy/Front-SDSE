import Login from './pages/Login';
import Inicio from './pages/Inicio';
import RedefSenha from './pages/Redef-senha';
import RecuSenha from './pages/Recu-senha';
import PrimeiroAcesso from './pages/Primeiro-acesso';
import Doacoes from './pages/Doacoes';
import DoacoesDisponiveis from './pages/DoacoesDisponiveis';
import PrimeiraSenha from './pages/Primeira-senha';
import Solicitacao from './pages/Solicitacao';

var routes = [
    {
        path: "/login",
        name: "Login",
        component: Login
    },
    {
        path: "/inicio",
        name: "Inicio",
        isAuth: true,
        component: Inicio
    },
    {
        path: "/redef_senha/:token",
        name: "RedefSenha",
        component: RedefSenha
    },
    {
        path: "/cadastro_senha/:token",
        name: "PrimeiraSenha",
        component: PrimeiraSenha

    },
    {
        path: "/recupera_senha",
        name: "RecuperaSenha",
        component: RecuSenha
    },
    {
        path: "/primeiro_acesso",
        name: "PrimeiroAcesso",
        component: PrimeiroAcesso
    },
    {
        path: "/doacoes",
        name: "Doacoes",
        isAuth: true,
        component: Doacoes
    },
    {
        path: "/solicitacao",
        name: "Solicitacao",
        isAuth: true,
        component: Solicitacao
    },
    {
        path: "/doacoes-disponiveis",
        name: "DoacoesDisponiveis",
        isAuth: true,
        component: DoacoesDisponiveis
    }
];
export default routes;