import React from 'react';
import '../styles.css';
import {Button, Container, Card, CardBody, CardHeader, Badge} from 'reactstrap';
import Footer from '../components/Footer/footer';
import {getToken, logout} from '../services/auth';
import { Link, useHistory } from "react-router-dom";

function Inicio() {
    const history = useHistory();

   function handleClick() {
        logout();
        window.location.href = '/login';
    }

    return(
        <Container className="main">
        <h1 align="center">Sistema de Doação de Solo de Escavações <Badge>SDSE</Badge></h1>
        <Container>
        <Card>
            <CardHeader>Selecione a opção que desejar!</CardHeader>

            <CardBody>
                <Button size="lg" block onClick={() => {history.push("/doacoes")}}>Doar Solo</Button>
                <Button size="lg" block onClick={handleClick}>Solicitar Doação</Button>
                <Button size="lg" block onClick={handleClick}>Editar Dados</Button>
            </CardBody>

        </Card>
        </Container>
        <Footer />
        </Container>
    )
} export default Inicio;