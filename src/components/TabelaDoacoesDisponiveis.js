import React, {Component} from 'react';
import { ListGroup, ListGroupItem, Modal, ModalHeader, ModalBody, ModalFooter, Table, Button, Label, Row, InputGroup, Input, InputGroupAddon } from 'reactstrap';
import Paginacao from './Paginacao';
import Mapa from './Mapa';
import * as toast from '../utils/toasts'
import Api from '../services/api'

class TabelaDoacoes extends Component {
  
  state = {
    currentPage : 0,
    volume: '',
    selected : {volume : '', 
      tipo_solo : {tipo: 'Tipo do solo', id : 0}, 
      status_solo : {status: 'Status do solo', id : 0},
      empresa_user : {nome : '', telefone : '', cnpj : '', email: '', representante: ''},
      file : {url : ''}
    },
    showModal: false,
    places : []
  }

  changeVolume = (e) => this.setState({volume : e.target.value})

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

  toggle = () => this.setState({showModal: !this.state.showModal})

  interesse = async () => {
    const { volume } = this.state;
    const tipoSoloId = this.state.selected.tipo_solo.id;
    const soloId = this.state.selected.id;
      if(volume !== '') {
          await Api.post("solo-interesse/", {volume, tipoSoloId, statusSoloId : 5, soloId}).then(response => {
              toast.sucesso("Interesse informado com sucesso")
              this.toggle();
          }).catch( () => {
              toast.erro("Erro ao manifestar o interesse")
          })
      }else {
          toast.erro("Informe o volume de solo de interesse")
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
                  <th>Informações</th>
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
                      <td>
                        <Button onClick={() => {this.setState({selected : solo}); this.toggle()}}>Mais +</Button></td>
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
        <Modal isOpen={this.state.showModal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Informações sobre a doação</ModalHeader>
          <ModalBody>
          <ListGroup>
            <ListGroupItem>Empresa: {this.state.selected.empresa_user.nome}</ListGroupItem>
            <ListGroupItem>Telefone: {this.state.selected.empresa_user.telefone}</ListGroupItem>
            <ListGroupItem>CNPJ: {this.state.selected.empresa_user.cnpj}</ListGroupItem>
            <ListGroupItem>E-mail: {this.state.selected.empresa_user.email}</ListGroupItem>
            <ListGroupItem>Representante: {this.state.selected.empresa_user.representante}</ListGroupItem>
          </ListGroup>
          <a className="button-pdf" href={this.state.selected.file.url} download="laudoSTP">Baixar laudo de caractarização do solo<i className="fa fa-file-pdf-o"></i></a>
          <Row className="ml-5 mr-5">
            <Label>Tem interese?</Label><br/>
              <InputGroup>
                  <Input className='rounded-left' placeholder='Volume (m³)' type='number' value={this.state.volume} onChange={this.changeVolume}/>
                  <InputGroupAddon addonType="append"><Button className='rounded-right' onClick={this.interesse}>Sim!</Button></InputGroupAddon>
              </InputGroup>
          </Row>
          <div className='mapa'>
            <Mapa place={this.state.selected}/>
          </div>
          </ModalBody>
          <ModalFooter>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default TabelaDoacoes;
