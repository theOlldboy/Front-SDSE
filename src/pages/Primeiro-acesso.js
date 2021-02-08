import React, { Component } from 'react';
import { Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import { ReactstrapInput } from "reactstrap-formik";
import MaskedInput from "react-text-mask";
import { cnpjMask } from "../utils/Masks";
import { Container, Badge, Card, CardBody, CardHeader, Button } from "reactstrap";
import "../styles.css";
import Footer from '../components/Footer/footer';
import api from '../services/api'
import { getUser } from '../services/auth';
import { Redirect } from 'react-router';

    class PrimeiroAcesso extends Component {
        render(){
            if(getUser() !== null){
                return (<Redirect from={this.props.path} to='/inicio' />);
            }
        return (
            <Container className="main">
                <h1 align="center">Sistema de Doação de Solo de Escavações <Badge>SDSE</Badge></h1>
                <Card>
                <CardHeader>Preencha as informações abaixo e te enviaremos um link!</CardHeader>
                <CardBody>
            <Formik
                initialValues={{ cnpj: '', email: '' }}
                validationSchema={Yup.object().shape({
                    cnpj: Yup.string().required('Campo Obrigatório!'),
                    email: Yup.string().required('Campo Obrigatório!').email('E-mail inválido!'),
                })}
                onSubmit={async(values, { setSubmitting }) => {
                    const cnpj = values.cnpj;
                    const email = values.email;

                    await api.post("/password-firstaccess", {cnpj ,email}).then( response => {
                        alert('Você receberá em breve um email no endereço fornecido para que possa criar uma nova senha para sua conta!')
                        this.props.history.push('/login');
                        setSubmitting(false); 
                    })
                    .catch(error => {
                        alert(error.response.data.message);
                        console.log(error);
                      });  
                } }
            >
                <Form>
                    <Field name="cnpj"  label="CNPJ" type="text" 
                    tag={MaskedInput} mask={cnpjMask} component={ReactstrapInput} />

                    <Field name="email" label="E-mail" type="email" component={ReactstrapInput} />

                    <Button type="submit">Enviar</Button>
                </Form>
            </Formik>
            </CardBody>
            </Card>
            <Footer />
            </Container>
        )}};
export default PrimeiroAcesso;