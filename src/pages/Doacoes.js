import React, {Component} from 'react';
import {  Col, Label, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Container, Badge, Card, CardBody, CardTitle, InputGroup, Input, InputGroupAddon, Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Row } from 'reactstrap';
import TabelaDoacoes from '../components/TabelaDoacoes'
import * as toast from '../utils/toasts'
import Api from '../services/api'

class Doacao extends Component {

    state = {
        doacoes : [],
        new : {id : 0, volume : '', latitude : '', longitude : '', tipo_solo : {tipo: 'Tipo do solo', id : 0}, status_solo : {status : 'DOAÇÃO - DISPONÍVEL', id : 1}},
        tipos : [],
        hidden : false,
        volume : '',
        dropdownOpen : false,
        dropdownOpenNew : false,
        labelTipo : {tipo : 'Tipo de solo', id : 0},
        showModal: false,
        modalAdd : {       
          selectedFile: null
        },
    }

    componentDidMount() {
        this.getLoc()
        Api.post('solos-data-params').then(solos => {
            this.setState({
                doacoes : solos.data
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

    setDoacoes(doacoes) {
        this.setState({doacoes : doacoes})
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

    changeLatLong = (lat, long) => this.setState({new: {...this.state.new, latitude : lat, longitude : long}})
    
    toggle = () => this.setState({showModal: !this.state.showModal})

    cleanFilters = () => {
        this.setState({
            labelTipo : {tipo : 'Tipo de solo', id : 0},
            volume : '',
        })
    }

    buscarDoacao = async () => {
        const {volume} = this.state
        const tipoId = this.state.labelTipo.id
        await Api.post('solos-data-params/', {volume,tipoId}).then( response => {
            this.setState({doacoes : response.data})
            if (this.state.doacoes.length <= 0){
                toast.info("Nenhuma doação encontrada com os filtros informados")
            }
        })
        if (this.state.doacoes.length !== 0 && this.state.hidden) {
            this.hiddenTabela()
        }else if (this.state.doacoes.length === 0 && this.state.hidden === false){
            this.hiddenTabela()
        }
    }

    saveSolo = async () => {
      const { volume, latitude, longitude } = this.state.new;
      const tipoSoloId = this.state.new.tipo_solo.id
      if (volume !== '') {
        if (tipoSoloId !== 0 ) {
            await Api.post("solo/", {volume, tipoSoloId, latitude, longitude, statusSoloId : 1}).then(response => {
                this.setState({new : {
                    ...this.state.new,
                    id: response.data.id
                }})
                this.setState({doacoes : [this.state.new].concat(this.state.doacoes)})
                if (this.state.doacoes.length !== 0 && this.state.hidden) {
                    this.hiddenTabela()
                }else if (this.state.doacoes.length === 0 && this.state.hidden === false){
                    this.hiddenTabela()
                }
                this.saveFile();
                toast.sucesso("Doação cadastrada com sucesso")
            }).catch( () => {
                toast.erro("Erro ao cadastrar a doação")
            })
        }else {
            toast.erro("Informe o tipo do solo")
        }
      }else {
          toast.erro("Informe o volume de solo da doação")
      }
    }

    saveFile () {

        let { modalAdd } = this.state;

        let url = `/file-solo`;

        const formData = new FormData();
        formData.append('file', modalAdd.selectedFile);

        Api({
          method: 'post',
          url,
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then((response) => {
            toast.sucesso("Relatório PDF cadastrado com sucesso")

            let modalAdd = {
              selectedFile: null
            };

            this.setState({ modalAdd });
        })
        .catch((response) => {
          console.log(response);
        });
    }

    getLoc() {
        var latitude = ''
        var longitude = ''
        if (navigator.geolocation) {
            var startPos;
          var geoSuccess = async (position) => {
            if (position.coords.latitude != null){
                startPos = position;
                latitude = startPos.coords.latitude
                longitude = startPos.coords.longitude
                localStorage.setItem('@user-loc', JSON.stringify({lat : startPos.coords.latitude, lng : startPos.coords.longitude}));
                this.changeLatLong(latitude, longitude)
            }else{
                localStorage.setItem('@user-loc',{});
            }
          };
          navigator.geolocation.getCurrentPosition(geoSuccess);
      }
      else {
        console.log('Geolocation is not supported for this Browser/OS.');
      }
    }

    render () {
        return (
            <Container className="main">
                <h1 align="center">Sistema de Doação de Solo de Escavações <Badge>SDSE</Badge></h1>
                <Card className="p-3 mt-3">
                    <CardTitle><h3>Minhas doações
                    <Button className='ml-5 bg-success' onClick={() => this.toggle()}>Cadastrar nova doação!</Button></h3>
                    </CardTitle>
                    <CardBody>
                    <Row className="pb-3">
                        <InputGroup>
                            <Input className='rounded-left' placeholder='Volume (Kg)' type='number' value={this.state.volume} onChange={this.changeVolume}/>
                            <InputGroupAddon addonType="append"><Button className='rounded-right' onClick={this.buscarDoacao}>Buscar</Button></InputGroupAddon>
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
                    <TabelaDoacoes change={this.setDoacoes.bind(this)} solos={this.state.doacoes} tipos={this.state.tipos} hidden={this.state.hidden}/>
                </Card>
                <Modal isOpen={this.state.showModal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Cadastrar doação</ModalHeader>
                    <ModalBody>
                    <Form>
                        <FormGroup>
                            <Row form>
                                <Col>
                                    <Label for="volume">Volume (Kg)</Label>
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
                                <div className="mt-3">
                                    <label>Laudo de caracterização do solo</label>
                                    <input type="file" onChange={(e) => {
                                    let modalAdd = this.state.modalAdd;
                                    modalAdd.selectedFile = e.target.files[0];
                                    this.setState({ modalAdd });
                                    }} name="file" required />
                                </div>    
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
export default Doacao;
