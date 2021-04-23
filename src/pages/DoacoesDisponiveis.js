import React, {Component} from 'react';
import {  Container, Badge, Card, CardBody, CardTitle, InputGroup, Input, InputGroupAddon, Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Row } from 'reactstrap';
import TabelaDoacoesDisponiveis from '../components/TabelaDoacoesDisponiveis'
import * as toast from '../utils/toasts'
import Api from '../services/api'

class DoacoesDisponiveis extends Component {

    state = {
        doacoes : [],
        tipos : [],
        hidden : false,
        volume : '',
        dropdownOpen : false,
        labelTipo : {tipo : 'Tipo de solo', id : 0},
    }

    componentDidMount() {
        Api.post('/solos-doacao-disp-data-params').then(solos => {
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
    
    changeTipo = (e) => {
        this.setState({
            labelTipo : {
                tipo : e.target.textContent,
                id : e.target.value
            }  
        })
    }

    changeVolume = (e) => this.setState({volume : e.target.value})
    
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
        await Api.post('/solos-doacao-disp-data-params/', {volume,tipoId}).then( response => {
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

    render () {
        return (
            <Container className="main">
                <h1 align="center" className='mb-5'><Badge>SDSE</Badge></h1>
                <Card className="p-3 mt-3">
                    <CardTitle><h3>Doações disponíveis</h3>
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
                    <TabelaDoacoesDisponiveis solos={this.state.doacoes} hidden={this.state.hidden}/>
                </Card>
            </Container>
        )
    }
}
export default DoacoesDisponiveis;
