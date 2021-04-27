import React, {Component} from 'react';
import {  Col, Label, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Container, Badge, Card, CardBody, CardTitle, InputGroup, Input, InputGroupAddon, Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Row } from 'reactstrap';
import TabelaSolicitacoes from '../components/TabelaSolicitacoes'
import * as toast from '../utils/toasts'
import Api from '../services/api'

class Solicitacao extends Component {

    state = {
        solicitacoes : [],
        new : {id: 0, volume : '', tipo_solo : {tipo: 'Tipo do solo', id : 0}, status_solo : {status : 'SOLICITAÇÃO - ABERTA', id : 2}},
        tipos : [],
        hidden : false,
        volume : '',
        dropdownOpen : false,
        dropdownOpenNew : false,
        labelTipo : {tipo : 'Tipo de solo', id : 0},
        showModal: false,
    }

    componentDidMount() {
        Api.post('solos-solicitacao-data-params').then(solos => {
            this.setState({
                solicitacoes : solos.data
            })
        })
        Api.get('solo-tipos').then(tipos => {
            this.setState({
                tipos : tipos.data.tipoSolos
            })
        })
    }

    hiddenTabela = () => this.setState({hidden : !this.state.hidden})

    toggleTipo = () => this.setState({dropdownOpen : !this.state.dropdownOpen})

    toggleTipoNew = () => this.setState({dropdownOpenNew : !this.state.dropdownOpenNew})

    setSolicitacoes(solicitacoes) {
        this.setState({solicitacoes : solicitacoes})
    }
    
    changeTipo = (e) => {
        this.setState({
            labelTipo : {
                tipo : e.target.textContent,
                id : e.target.value
            }  
        })
    }
    
    changeTipoNew = (e) => this.setState({
        new : {...this.state.new,
          tipo_solo : {
              tipo : e.target.textContent,
              id : e.target.value
            }
          }  
        })

    changeVolume = (e) => this.setState({volume : e.target.value})

    changeVolumeNew = (e) => this.setState({new: {...this.state.new, volume : e.target.value}})
    
    toggle = () => this.setState({showModal: !this.state.showModal})

    cleanFilters = () => {
        this.setState({
            labelTipo : {tipo : 'Tipo de solo', id : 0},
            volume : '',
        })
    }

    cleanForm = () => {
        this.setState({id: 0, volume : '', tipo_solo : {tipo: 'Tipo do solo', id : 0}, status_solo : {status : 'SOLICITAÇÃO - ABERTA', id : 2}})
    }

    buscarSolicitacao = async () => {
        const {volume} = this.state
        const tipoId = this.state.labelTipo.id
        await Api.post('solos-solicitacao-data-params/', {volume,tipoId}).then( response => {
            this.setState({solicitacoes : response.data})
            if (this.state.solicitacoes.length <= 0){
                toast.info("Nenhuma solicitação encontrada com os filtros informados")
            }
        })
        if (this.state.solicitacoes.length !== 0 && this.state.hidden) {
            this.hiddenTabela()
        }else if (this.state.solicitacoes.length === 0 && this.state.hidden === false){
            this.hiddenTabela()
        }
    }

    saveSolo = async () => {
        const { volume } = this.state.new;
        const tipoSoloId = this.state.new.tipo_solo.id
        if (volume !== '') {
          if (tipoSoloId !== 0 ) {
              await Api.post("solo/", {volume, tipoSoloId, statusSoloId : 2}).then(response => {
                  this.setState({new : {
                      ...this.state.new,
                      id: response.data.id
                  }})
                  this.setState({solicitacoes : [this.state.new].concat(this.state.solicitacoes)})
                  this.cleanForm()
                  if (this.state.solicitacoes.length !== 0 && this.state.hidden) {
                      this.hiddenTabela()
                  }else if (this.state.solicitacoes.length === 0 && this.state.hidden === false){
                      this.hiddenTabela()
                  }
                  toast.sucesso("Solicitação cadastrada com sucesso")
              }).catch( () => {
                  toast.erro("Erro ao cadastrar a solicitação")
              })
          }else {
              toast.erro("Informe o tipo do solo")
          }
        }else {
            toast.erro("Informe o volume de solo da solicitação")
        }
      }

    render () {
        return (
            <Container className="main">
                <h1 align="center" className='mb-5'><Badge>SDSE</Badge></h1>
                <Card className="p-3 mt-3">
                    <CardTitle><h3>Minhas solicitações
                    <Button className='ml-3 bg-success' onClick={() => this.toggle()}>Cadastrar solicitação</Button></h3>
                    </CardTitle>
                    <CardBody>
                    <Row className="pb-3">
                        <InputGroup>
                            <Input className='rounded-left' placeholder='Volume (m³)' type='number' value={this.state.volume} onChange={this.changeVolume}/>
                            <InputGroupAddon addonType="append"><Button className='rounded-right' onClick={this.buscarSolicitacao}>Buscar</Button></InputGroupAddon>
                            <ButtonDropdown className='ml-3' isOpen={this.state.dropdownOpen} toggle={this.toggleTipo}>
                                <DropdownToggle caret>
                                    {this.state.labelTipo.tipo}
                                </DropdownToggle>
                                <DropdownMenu>
                                    {this.state.tipos.map(tipo => {
                                        return(
                                            <DropdownItem key={tipo.id} disabled={tipo.id === 0 ? true : false} onClick={this.changeTipo} value={tipo.id}>{tipo.tipo}</DropdownItem>
                                        )
                                    })}
                                </DropdownMenu>
                            </ButtonDropdown>
                            <Button className='ml-3' outline onClick={this.cleanFilters}>Limpar filtros</Button>
                        </InputGroup>
                    </Row>
                    </CardBody>
                    <TabelaSolicitacoes change={this.setSolicitacoes.bind(this)} solos={this.state.solicitacoes} tipos={this.state.tipos} hidden={this.state.hidden}/>
                </Card>
                <Modal isOpen={this.state.showModal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Cadastrar solicitação</ModalHeader> 
                    <ModalBody>
                    <Form>
                        <FormGroup>
                            <Row form>
                                <Col>
                                    <Label for="volume">Volume (m³)</Label>
                                    <Input value={this.state.new.volume} type='number' id="volume" onChange={this.changeVolumeNew}/>
                                </Col>
                                <Col>
                                    <ButtonDropdown isOpen={this.state.dropdownOpenNew} toggle={this.toggleTipoNew}  className="pt-4">
                                        <DropdownToggle caret>
                                            {this.state.new.tipo_solo.tipo}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            {this.state.tipos.map(tipo => {
                                                return(
                                                    <DropdownItem key={tipo.id} disabled={tipo.id === 0 ? true : false} onClick={this.changeTipoNew} value={tipo.id}>{tipo.tipo}</DropdownItem>
                                                )
                                            })}
                                        </DropdownMenu>
                                    </ButtonDropdown>
                                </Col>
                            </Row>
                        </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => {this.saveSolo(); this.toggle()}}>Salvar</Button>
                        <Button className='ml-3' color="secondary" onClick={this.toggle}>Cancelar</Button>
                    </ModalFooter>
                </Modal>
            </Container>
        )
    }
}
export default Solicitacao;
