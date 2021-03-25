import React, { Component } from 'react';
import '../styles.css';
import {Button, Container, Card, CardBody, CardHeader, Badge} from 'reactstrap';
import Footer from '../components/Footer/footer';
import * as toast from '../utils/toasts'
import Api from '../services/api'

class Interesse extends Component {

    state = {
        doacao : {},
        interesse : {}
    }

    async componentDidMount(){
        const {doacao, interesse} = this.props.match.params;
        await Api.get(`solo-id/${doacao}`).then(response => {
            this.setState({doacao : response.data})
        })
        .catch( () => {
            console.log("Erro ao buscar doação")
        })
        await Api.get(`solo-id/${interesse}`).then(response => {
            this.setState({interesse : response.data})
        })
        .catch( () => {
            console.log("Erro ao buscar manifestação")
        })
    }

    async aceitar() {

    }

    async recusar() {

    }

    render (){
    return(
        <Container className="main">
        <h1 align="center" className='mb-5'><Badge>SDSE</Badge></h1>
        <Container>
        <Card>
            <CardHeader>A empresa {this.state.interesse.empresa_user.nome} tem interesse em {this.state.interesse.volume}m³ 
            de sua doação de {this.state.doacao.volume}m³ de {this.state.doacao.tipo_solo.tipo}.<br/>
            Você ainda possui essa doação disponível? Deseja fornecer a quantidade solicitada de solo para a 
            {this.state.interesse.empresa_user.nome}?</CardHeader>

            <CardBody>
                <Button size="lg" block onClick={() => {this.recusar(); this.props.history.push("/inicio")}}>Não, está indisponível para a necessidade</Button>
                <Button size="lg" block onClick={() => {this.aceitar(); this.props.history.push("/inicio")}}>Sim! Informe sobre a disponibilidade</Button>
            </CardBody>

        </Card>
        </Container>
        <Footer />
        </Container>
    );
}} export default Interesse; 