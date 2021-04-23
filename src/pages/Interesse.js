import React, { Component } from 'react';
import '../styles.css';
import {Button, Container, Card, CardBody, CardHeader, Badge} from 'reactstrap';
import Footer from '../components/Footer/footer';
import * as toast from '../utils/toasts'
import Api from '../services/api'

class Interesse extends Component {

    state = {
        interesse : {volume : '', cbr : '',
            tipo_solo : {tipo: 'Tipo do solo', id : 0}, 
            ra_solo : {ra: 'RA do solo', id : 0}, 
            status_solo : {status: 'Status do solo', id : 0},
            empresa_user : {nome : '', telefone : '', cnpj : '', email: '', representante: ''}
        },
        doacao : {volume : '', cbr : '',
            tipo_solo : {tipo: 'Tipo do solo', id : 0}, 
            ra_solo : {ra: 'RA do solo', id : 0}, 
            status_solo : {status: 'Status do solo', id : 0},
            empresa_user : {nome : '', telefone : '', cnpj : '', email: '', representante: ''}
        }
    }

    async componentDidMount(){
        const id = this.props.match.params.interesse;
        await Api.get(`solo-id/${id}`).then(response => {
            this.setState({interesse : response.data})
        })
        .catch( () => {
            console.log("Erro ao buscar manifestação")
        })
        await Api.get(`solo-id/${this.state.interesse.idInteresse}`).then(response => {
            this.setState({doacao : response.data})
        })
        .catch( () => {
            console.log("Erro ao buscar manifestação")
        })
    }

    async aceitar() {
        await Api.post('aceitar/', this.state.interesse).then(() => {
            toast.sucesso("Dados atualizados e empresa notificada com sucesso!")
        })
        .catch( () => {
            toast.erro("Erro ao notificar empresa!")
        })
    }

    async recusar() {
        await Api.post('recusar/', this.state.interesse).then(() => {
            toast.sucesso("Dados atualizados e empresa notificada com sucesso!")
        })
        .catch( () => {
            toast.erro("Erro ao notificar empresa!")
        })
    }

    render (){
    return(
        <Container className="main">
        <h1 align="center" className='mb-5'><Badge>SDSE</Badge></h1>
        <Container>
        <Card>
            <CardHeader className='text-center'>A empresa <span className='font-weight-bold'>{this.state.interesse.empresa_user.nome} </span>
                tem interesse em <span className='font-weight-bold'>{this.state.interesse.volume}m³ </span>
                de sua doação de <span className='font-weight-bold'>{this.state.doacao.volume}m³</span> de 
                <span className='font-weight-bold'> {this.state.doacao.tipo_solo.tipo}</span>.<br/>
                Você ainda possui essa doação disponível?<br/>
                Deseja fornecer a quantidade solicitada de solo para a <span className='font-weight-bold'>{this.state.interesse.empresa_user.nome}</span>?</CardHeader>

            <CardBody>
                <Button size="lg" block onClick={() => {this.aceitar(); this.props.history.push("/inicio")}}>Sim, informe sobre a disponibilidade</Button>
                <Button size="lg" block onClick={() => {this.recusar(); this.props.history.push("/inicio")}}>Não, está indisponível para a necessidade</Button>
            </CardBody>

        </Card>
        </Container>
        <Footer />
        </Container>
    );
}} export default Interesse; 