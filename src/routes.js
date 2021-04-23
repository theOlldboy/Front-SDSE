import Login from './pages/Login';
import Inicio from './pages/Inicio';
import RedefSenha from './pages/Redef-senha';
import RecuSenha from './pages/Recu-senha';
import PrimeiroAcesso from './pages/Primeiro-acesso';
import PrimeiraSenha from './pages/Primeira-senha';
import Doacoes from './pages/Doacoes';
import DoacoesDisponiveis from './pages/DoacoesDisponiveis';
import Solicitacao from './pages/Solicitacao';
import EdicaoDados from './pages/EdicaoDados';
import Interesse from './pages/Interesse';

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
        path: "/interesse_doacao/:interesse",
        name: "InteresseDoacao",
        isAuth: true,
        component: Interesse
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
    },
    {
        path: "/edicao-dados",
        name: "EdicaoDados",
        isAuth: true,
        component: EdicaoDados
    }
];
export default routes;