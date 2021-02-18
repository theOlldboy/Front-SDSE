import React, {Component} from 'react';
import {Col, Row, Modal, ModalHeader, ModalBody, ModalFooter, Table, Form, FormGroup, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Button } from 'reactstrap';
import Paginacao from './Paginacao';
import Api from '../services/api'
import * as toast from '../utils/toasts'

class TabelaSolicitacoes extends Component {
  
  
  state = {
    currentPage : 0,
    selected : {volume : '', tipo_solo : {tipo: 'Tipo do solo', id : 0}, status_solo : {status: 'Status do solo', id : 0}},
    dropdownOpenTipo : false,
    dropdownOpenStatus : false,
    showModalEdit: false,
    status : [{id : 2, status : 'SOLICITAÇÃO - ABERTA'},{id : 4, status : 'SOLICITAÇÃO - ATENDIDA'}]
  }

  componentWillReceiveProps() {
    this.setState({solos : this.props.solos})
  }
  
   handlePageClick = (e, index) => {
    e.preventDefault();
    this.setState({currentPage: index});
  };

  handlePreviousClick = (e) => {
    e.preventDefault();
    this.setState({currentPage: this.state.currentPage - 1});
  }

  handleNextClick = (e) => {
    e.preventDefault();
    this.setState({currentPage: this.state.currentPage + 1});
  }

  toggleEdit = () => this.setState({showModalEdit: !this.state.showModalEdit})

  toggleTipo = () => this.setState({dropdownOpenTipo : !this.state.dropdownOpenTipo})

  toggleStatus = () => this.setState({dropdownOpenStatus : !this.state.dropdownOpenStatus})

  changeVolume = (e) => this.setState({selected: {...this.state.selected, volume : e.target.value}})

  changeTipo = (e) => this.setState({
    selected : {...this.state.selected,
      tipo_solo : {
          tipo : e.target.textContent,
          id : e.target.value
        }
      }  
    })
    
  changeStatus = (e) => this.setState({
    selected : {...this.state.selected,
      status_solo : {
          status : e.target.textContent,
          id : e.target.value
        }
      }  
    })

  updateSolo = () => {
    const { id, volume } = this.state.selected;
    const tipoSoloId = this.state.selected.tipo_solo.id
    const statusSoloId = this.state.selected.status_solo.id
    if (volume !== '') {
      if (tipoSoloId !== 0 ) {
          if (statusSoloId !== 0) {
              Api.put(`solo/${id}`, {volume, tipoSoloId, statusSoloId}).then( () => {
                const solos = this.props.solos.filter(p => this.state.selected.id !== p.id)
                this.setState({solos : [this.state.selected].concat(solos)})
                this.props.change([this.state.selected].concat(solos));
                toast.sucesso("Solicitação atualizada com sucesso")
              }).catch( () => {
                  toast.erro("Erro ao atualizar a solicitação")
              })
          }else {
              toast.erro("Informe o status da solicitação")
          }
      }else {
          toast.erro("Informe o tipo do solo")
      }
    }else {
        toast.erro("Informe o volume de solo da solicitação")
    }
  }

  render() {
    return (
      <div>
        <Table striped bordered dark hover hidden={this.props.hidden}>
            <thead>
                <tr>
                  <th>Volume</th>
                  <th>Tipo</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
            </thead>
            <tbody>
            {this.props.solos
              .slice(this.state.currentPage * 10, (this.state.currentPage + 1) * 10)
              .map(solo => {
                return (
                  <React.Fragment key={solo.id}>
                    <tr>
                      <td>{solo.volume} m³</td>
                      <td>{solo.tipo_solo.tipo}</td>
                      <td>{solo.status_solo.status}</td>
                      <td>
                        <Button onClick={() => {this.setState({selected : solo}); this.toggleEdit()}}>Editar</Button>                    </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
        </Table>
        <Paginacao hidden={this.props.hidden}
          pagesCount={Math.round((this.props.solos.length / 10) + 0.5)}
          currentPage={this.state.currentPage}
          handlePageClick={this.handlePageClick}
          handlePreviousClick={this.handlePreviousClick}
          handleNextClick={this.handleNextClick}
        />
        <Modal isOpen={this.state.showModalEdit} toggle={this.toggleEdit}>
            <ModalHeader toggle={this.toggleEdit}>Editar solicitação</ModalHeader>
            <ModalBody>
              <Form>
                  <FormGroup>
                    <Row form>
                        <Col>
                            <Label for="volume">Volume (m³)</Label>
                            <Input value={this.state.selected.volume} type='number' id="volume" onChange={this.changeVolume}/>
                        </Col>
                        <Col>
                            <ButtonDropdown isOpen={this.state.dropdownOpenTipo} toggle={this.toggleTipo}  className="pt-4">
                                <DropdownToggle caret>
                                    {this.state.selected.tipo_solo.tipo}
                                </DropdownToggle>
                                <DropdownMenu>
                                    {this.props.tipos.map(tipo => {
                                        return(
                                            <DropdownItem key={tipo.id} disabled={tipo.id === 0 ? true : false} onClick={this.changeTipo} value={tipo.id}>{tipo.tipo}</DropdownItem>
                                        )
                                    })}
                                </DropdownMenu>
                            </ButtonDropdown>
                        </Col>
                    </Row>
                      <Row form>
                        <Col>
                            <ButtonDropdown isOpen={this.state.dropdownOpenStatus} toggle={this.toggleStatus}  className="pt-4">
                                <DropdownToggle caret>
                                    {this.state.selected.status_solo.status}
                                </DropdownToggle>
                                <DropdownMenu>
                                    {this.state.status.map(status => {
                                        return(
                                            <DropdownItem key={status.id} disabled={status.id === 0 ? true : false} onClick={this.changeStatus} value={status.id}>{status.status}</DropdownItem>
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
                <Button color="primary" onClick={() => {this.updateSolo(); this.toggleEdit()}}>Salvar</Button>
                <Button className='ml-3' color="secondary" onClick={this.toggleEdit}>Cancelar</Button>
            </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default TabelaSolicitacoes;
