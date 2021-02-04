import React from 'react';
import { Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import { ReactstrapInput } from "reactstrap-formik";
import MaskedInput from "react-text-mask";
import { cnpjMask } from "../utils/Masks";
import { Container, Badge, Card, CardBody, CardHeader, Button } from "reactstrap";
import "../styles.css";
import Footer from '../components/Footer/footer';

    const RecuSenha = () => (
        <div>
            <Container className="main">
                <h1 align="center">Sistema de Doação de Solo de Escavações <Badge>SDSE</Badge></h1>
                <Card>
                <CardHeader>Preencha os campos abaixo e enviaremos um link em seu e-mail!</CardHeader>
                <CardBody>
            <Formik
                initialValues={{ cnpj: '', email: '' }}
                validationSchema={Yup.object().shape({
                    cnpj: Yup.string().required('Campo Obrigatório!'),
                    email: Yup.string().required('Campo Obrigatório!').email('E-mail inválido!'),
                })}
                onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2));
                        setSubmitting(false);
                    }, 400);
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
    </div>
    );export default RecuSenha;