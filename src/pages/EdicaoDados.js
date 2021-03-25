import React, { Component } from 'react';
import '../styles.css';
import { Field, Form, Formik } from "formik";
import { getUser, setUser } from '../services/auth';
import { ReactstrapInput } from "reactstrap-formik";
import {Button, Container, Card, CardBody, Badge, CardTitle} from 'reactstrap';
import * as Yup from 'yup';
import MaskedInput from "react-text-mask";
import { cnpjMask, telefoneMask, cpfMask, cfdfMask } from "../utils/Masks";
import api from '../services/api';
import Footer from '../components/Footer/footer';
import * as toast from '../utils/toasts'



  class EdicaoDados extends Component {
    render() { 
      const { user } = getUser()
      const { nome, cnpj, cfdf, email, telefone, representante, cargo_representante, cpf_representante, senha, senhaConf} = user;
    return (
    <Container className="mt-5 mb-5 main">
      <h1 align="center" className='mb-5'><Badge>SDSE</Badge></h1>
        <Card>
            <CardBody>
              <CardTitle>Dados empresariais</CardTitle>
        <Formik
              initialValues={{nome, cnpj, cfdf, email, telefone, representante, cargo_representante, cpf_representante, senha, senhaConf }}
              validationSchema={Yup.object().shape({
                nome: Yup.string().required('Campo Obrigatório!'),
                cnpj: Yup.string().required('Campo Obrigatório!'),
                cfdf: Yup.string(),
                email: Yup.string().required('Campo Obrigatório!').email('E-mail inválido!'),
                senha: Yup.string().required('Campo Obrigatório!'),
                senhaConf: Yup.string().test('senha-match', 'As senhas não conferem', function(value) {
                  const {senha} = this.parent;
                  return senha === value
                }),
                telefone: Yup.string().required('Campo Obrigatório!'),
                representante: Yup.string().required('Campo Obrigatório!'),
                cargo_representante: Yup.string(),
                cpf_representante: Yup.string(),
              })}
              onSubmit={async(values, { setSubmitting }) => {          
                const nome = values.nome;       
                const cnpj = values.cnpj;
                const cfdf = values.cfdf;
                const email = values.email;
                const telefone = values.telefone;
                const representante = values.representante;
                const cargo_representante = values.cargo_representante;
                const cpf_representante = values.cpf_representante;
                const senha = values.senha;
          
                await api.put('empresa/', {nome, cnpj, cfdf, email, telefone, representante, cargo_representante, cpf_representante, senha}).then(response => {
                  toast.sucesso("Dados atualizados com sucesso!")
                  setUser(response.data)
                  this.props.history.push("/inicio")
                })
                  .catch(error => {
                    alert(error);
                  });
              } }
              >
              <Form>
                  <Field name="nome"  label="Nome" type="text" component={ReactstrapInput} />

                  <Field name="telefone"  label="Telefone" type="text"
                  tag={MaskedInput} mask={telefoneMask} component={ReactstrapInput} />

                  <Field name="email"  label="Email" type="text" component={ReactstrapInput} />

                  <Field name="senha"  label="Senha" type="password" component={ReactstrapInput} /> 

                  <Field name="senhaConf"  label="Confirmação Senha" type="password" component={ReactstrapInput} /> 

                  <Field name="cnpj"  label="CNPJ" type="text" 
                  tag={MaskedInput} mask={cnpjMask} component={ReactstrapInput} />

                  <Field name="cfdf"  label="CFDF" type="text"
                  tag={MaskedInput} mask={cfdfMask} component={ReactstrapInput} />

                  <Field name="representante"  label="Representante" type="text" component={ReactstrapInput} />

                  <Field name="cargo_representante"  label="Cargo do Representante" type="text" component={ReactstrapInput} />

                  <Field name="cpf_representante"  label="CPF do Representante" type="text"
                  tag={MaskedInput} mask={cpfMask} component={ReactstrapInput} />

                <Button type="submit">Salvar</Button>
                <Button className="ml-3" type="reset">Limpar</Button>

              </Form>
              </Formik>
            </CardBody>
        </Card>
      <Footer />
    </Container>
  )
    }}
    export default EdicaoDados;
