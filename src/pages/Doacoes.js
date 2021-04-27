import React, {Component} from 'react';
import {  Col, Label, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Container, Badge, Card, CardBody, CardTitle, InputGroup, Input, InputGroupAddon, Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Row } from 'reactstrap';
import TabelaDoacoes from '../components/TabelaDoacoes'
import * as toast from '../utils/toasts'
import Api from '../services/api'

class Doacao extends Component {

    state = {
        doacoes : [],
        new : {id : 0, volume : '', cbr : '', latitude : '', longitude : '', responsaLaudo : false,
            tipo_solo : {tipo: 'Tipo do solo', id : 0}, 
            status_solo : {status : 'DOAÇÃO - DISPONÍVEL', id : 1},
            ra_solo : {ra : 'Selecione a RA', id : 0}
        },
        tipos : [],
        ras : [],
        hidden : false,
        hiddenResponsa : false,
        volume : '',
        dropdownOpen : false,
        dropdownOpenNew : false,
        dropdownOpenRA : false,
        labelTipo : {tipo : 'Tipo de solo', id : 0},
        showModal: false,
        modalAdd : {       
            selectedFile: null,
            soloId : 0
        },
    }

    componentDidMount() {
        this.getLoc()
        Api.post('solos-doacao-data-params').then(solos => {
            this.setState({
                doacoes : solos.data
            })
        })
        Api.get('solo-tipos').then(tipos => {
            this.setState({
                tipos : tipos.data.tipoSolos
            })
        })
        Api.get('solo-ras').then(ras => {
            this.setState({
                ras : ras.data.ra
            })
        })
    }

    hiddenTabela = () => this.setState({hidden : !this.state.hidden})

    hiddenResponsa = (value) => this.setState({hiddenResponsa : value})

    toggleTipo = () => this.setState({dropdownOpen : !this.state.dropdownOpen})

    toggleTipoNew = () => this.setState({dropdownOpenNew : !this.state.dropdownOpenNew})

    toggleTipoRA = () => this.setState({dropdownOpenRA : !this.state.dropdownOpenRA})

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
    
    changeResponsa = () => this.setState({new : {...this.state.new, responsaLaudo : !this.state.new.responsaLaudo}})

    changeTipoRA = (e) => this.setState({
        new : {...this.state.new,
            ra_solo : {
              ra : e.target.textContent,
              id : e.target.value
            }
        }  
    })

    changeVolume = (e) => this.setState({volume : e.target.value})

    changeVolumeNew = (e) => this.setState({new: {...this.state.new, volume : e.target.value}})

    changeCbrNew = (e) => this.setState({new: {...this.state.new, cbr : e.target.value}})

    changeLatLong = (lat, long) => this.setState({new: {...this.state.new, latitude : lat, longitude : long}})
    
    toggle = () => this.setState({showModal: !this.state.showModal})

    changeFile = (e) => {
        let modalAdd = this.state.modalAdd;
        modalAdd.selectedFile = e.target.files[0];
        this.setState({ modalAdd });
        if(modalAdd.selectedFile != null) {
            this.hiddenResponsa(true)
        }else{
            this.hiddenResponsa(false)
        }
    }

    cleanFilters = () => {
        this.setState({
            labelTipo : {tipo : 'Tipo de solo', id : 0},
            volume : '',
        })
    }

    cleanForm = () => {
        this.setState({
            new : {id : 0, volume : '', cbr : '',  responsaLaudo : false,
                tipo_solo : {tipo: 'Tipo do solo', id : 0}, 
                status_solo : {status : 'DOAÇÃO - DISPONÍVEL', id : 1},
                ra_solo : {ra : 'Selecione a RA', id : 0}
            }
        })
        this.hiddenResponsa(false)
    }

    buscarDoacao = async () => {
        const {volume} = this.state
        const tipoId = this.state.labelTipo.id
        await Api.post('solos-doacao-data-params/', {volume,tipoId}).then( response => {
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
        const { volume, cbr, latitude, longitude } = this.state.new;
        let { responsaLaudo } = this.state.new;
        const { modalAdd } = this.state;
        const tipoSoloId = this.state.new.tipo_solo.id
        const raSoloId = this.state.new.ra_solo.id
        if(!!latitude && !!longitude){
            if(volume !== '') {
                if (tipoSoloId !== 0) {
                    if (raSoloId !== 0) {
                        if (this.state.modalAdd.selectedFile != null || responsaLaudo) {
                            if (this.state.modalAdd.selectedFile != null && responsaLaudo) {
                                responsaLaudo = false;
                            }
                            await Api.post("solo/", {volume, cbr, tipoSoloId, raSoloId, latitude, longitude, statusSoloId : 1, responsaLaudo}).then(response => {
                                this.setState({new : {
                                    ...this.state.new,
                                    id: response.data.id
                                }})
                                this.setState({modalAdd : {
                                    ...this.state.modalAdd,
                                    soloId: response.data.id
                                }})
                                this.setState({doacoes : [this.state.new].concat(this.state.doacoes)})
                                if (this.state.doacoes.length !== 0 && this.state.hidden) {
                                    this.hiddenTabela()
                                }else if (this.state.doacoes.length === 0 && this.state.hidden === false){
                                    this.hiddenTabela()
                                }
                                if (modalAdd.selectedFile !== null){
                                    this.saveFile();
                                }
                                this.cleanForm()
                                toast.sucesso("Doação cadastrada com sucesso")
                                this.toggle();
                            }).catch( () => {
                                toast.erro("Erro ao cadastrar a doação")
                            })
                        }else{
                            toast.erro("Forneça o laudo de caracterização do solo ou concorde no campo a baixo")
                        }
                    }else {
                        toast.erro("Informe a RA do solo")
                    }
                }else {
                    toast.erro("Informe o tipo do solo")
                }
            }else {
                toast.erro("Informe o volume de solo da doação")
            }
            
        }else{
            toast.info("Por favor, permita o acesso a sua localização para poder cadastrar novas doações no SDSE.")

        }
    }

    saveFile () {

        let { modalAdd } = this.state;

        let url = `/file-solo`;

        const formData = new FormData();
        formData.append('file', modalAdd.selectedFile);
        formData.append('soloId', modalAdd.soloId);

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
        navigator.permissions.query({name:'geolocation'}).then(result => {
            if (result.state === 'granted' || result.state === 'prompt') {
                var startPos
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
            } else if (result.state === 'denied') {
                toast.info("Por favor, permita o acesso a sua localização para poder cadastrar novas doações no SDSE.")
            }
        });
    }

    render () {
        return (
            <Container className="main">
                <h1 align="center" className='mb-5'><Badge>SDSE</Badge></h1>
                <Card className="p-3 mt-3">
                    <CardTitle><h3>Minhas doações
                    <Button className='ml-5 bg-success' onClick={() => this.toggle()}>Cadastrar nova doação</Button></h3>
                    </CardTitle>
                    <CardBody>
                    <Row className="pb-3">
                        <InputGroup>
                            <Input className='rounded-left' placeholder='Volume (m³)' type='number' value={this.state.volume} onChange={this.changeVolume}/>
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
                    <TabelaDoacoes change={this.setDoacoes.bind(this)} solos={this.state.doacoes} tipos={this.state.tipos} ras={this.state.ras} hidden={this.state.hidden}/>
                </Card>
                <Modal isOpen={this.state.showModal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Cadastrar doação</ModalHeader>
                    <ModalBody>
                    <Form>
                        <FormGroup>
                            <Row form>
                                <Col>
                                    <Label for="volume">Volume (m³)</Label>
                                    <Input value={this.state.new.volume} type='number' id="volume" onChange={this.changeVolumeNew}/>
                                </Col>
                                <Col>
                                    <Label for="cbr">CBR (%)</Label>
                                    <Input value={this.state.new.cbr} type='number' id="cbr" onChange={this.changeCbrNew}/>
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
                            <Row form>
                                <ButtonDropdown isOpen={this.state.dropdownOpenRA} toggle={this.toggleTipoRA}  className="pt-4">
                                    <DropdownToggle caret>
                                        {this.state.new.ra_solo.ra}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        {this.state.ras.map(ra => {
                                            return(
                                                <DropdownItem key={ra.id} disabled={ra.id === 0 ? true : false} onClick={this.changeTipoRA} value={ra.id}>{ra.ra}</DropdownItem>
                                            )
                                        })}
                                    </DropdownMenu>
                                </ButtonDropdown>
                            </Row>
                            <Row form>
                                <div className="mt-3">
                                    <label>Laudo de caracterização do solo</label>
                                    <input type="file" onChange={this.changeFile} name="file" required />
                                </div>    
                            </Row>
                            <Row form>
                                <div className="mt-3" hidden={this.state.hiddenResponsa}>
                                    <label> 
                                    <Input className='mr-2' addon type="checkbox" onChange={this.changeResponsa} value={this.state.new.responsaLaudo}/>
                                    Eu concordo e estou ciente da responsabilidade em disponibilizar este solo para doação sem o laudo que o caracteriza.</label>
                                </div>
                            </Row>
                        </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.saveSolo}>Salvar</Button>
                        <Button className='ml-3' color="secondary" onClick={this.toggle}>Cancelar</Button>
                    </ModalFooter>
                </Modal>
            </Container>
        )
    }
}
export default Doacao;
