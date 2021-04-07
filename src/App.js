import React, { useState, useRef, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

import { FaCar, FaCartArrowDown, FaMotorcycle, FaCarSide, FaTruck} from 'react-icons/fa'

function App() {

  //marca quando os dados da API estão sendo coletados
  const [estaObtendoDados, setEstaObtendoDados] = useState(false)
  //armazena o tipo de veiculo
  const [tipoVeiculo, setTipoVeiculo] = useState('')
  //armazena a marca selecionada
  const [marcaSelecionada, setMarcaSelecionada] = useState('')
  //armazena o codigo da marca selecionada
  const [codigoDaMarcaSelecionada, setCodigoDaMarcaSelecionada] = useState('')
  //armazena o nome do veiculo selecionado
  const [veiculoSelecionado, setVeiculoSelecionado] = useState('')


  //armazena a marcas
  const [marcasDeVeiculo, setMarcasDeVeiculo] = useState([])
  //armazena os veiculos da marca
  const [veiculosDaMarca, setVeiculosDaMarca] = useState([])
  //armazena os veiculos especificos
  const [veiculos, setVeiculos] = useState([])

  //o segundo select (Marcas)
  const selectMarcas = useRef(null)
  //o terceiro select (Meiculos)
  const selectVeiculos = useRef(null)

  //atualiza o segundo select quando as marcas disponiveis mudam
  useEffect(() => {

    if (selectMarcas.current !== null) {

      let listaMarcas = marcasDeVeiculo

      selectMarcas.current.innerHTML = ''
      let info = '<option><option/>'

      listaMarcas.forEach((valores) => {

        info += `<option>${valores.name}<option/>`

      })

      selectMarcas.current.innerHTML = info
  
    }
  }, [marcasDeVeiculo])
  //atualiza o terceiro select quando os veiculos disponiveis mudam
  useEffect(() => {

    if (selectVeiculos.current !== null) {

      let listaVeiculos = veiculosDaMarca

      selectVeiculos.current.innerHTML = ''
      let info = '<option><option/>'

      listaVeiculos.forEach((valores,index) => {

        info += `<option>${valores.info[index].name}<option/>`

      })

      selectVeiculos.current.innerHTML = info

    }
    
  }, [veiculosDaMarca])

  //obtem as marcas para um determinado tipo de veiculo
  async function ObterMarcas(props) {

    //o valor no select do formulario
    let tipoDeVeiculo = props === 'caminhões' ? 'caminhoes' : props

    let marcas = []
    let url = `https://fipeapi.appspot.com/api/1/${tipoDeVeiculo}/marcas.json`

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        //coleta certas propriedades e as passa para {marcas}
        for (let index = 0; index < data.length; index++) {
          let { key, name, id } = data[index]
          marcas.push({ key, name, id })
        }

        setMarcasDeVeiculo(marcas)
      })
      .catch(error => {
        alert(error)
        console.error(error)
        setTipoVeiculo('') //faz o segundo select desparecer em caso de erro
      })
  }
  //obtem os veiculos de uma determinada marca
  async function ObterVeiculos(props) {

    /**
     * @param string (props) - o noma da marca contido no segundo select
     */

    let marcas = []

    for (let index = 0; index < marcasDeVeiculo.length; index++) {

      marcas.push(marcasDeVeiculo[index])

    }

    let url = ``

    //procura uma marca especifica e coleta o seu ID
    marcas.forEach((valor) => {

      if (valor.name === props){

        setCodigoDaMarcaSelecionada(valor.id)

        url = `https://fipeapi.appspot.com/api/1/${tipoVeiculo}/veiculos/${valor.id}.json`

      }

    })

    await fetch(url)
      .then(response => response.json())
      .then(data => {

        /*
        0:{
  ​
        fipe_marca: "HONDA"
           fipe_name: "ADV 150"
           id: "9265"
           key: "adv-9265"
           marca: "HONDA"
           name: "ADV 150"

        }
        */

        let dados = []

        for (let index = 0; index < data.length; index++) {

          let {...info} = data

          dados.push({info})

        }

        setVeiculosDaMarca(dados)

      })
      .catch(error => {
        alert(error)
        console.error(error)
        setMarcaSelecionada('')//em caso de erro o Select desaparece
      })
  }
  //obtem mais informações sobre um veiculo especifico
  async function ObterVeiculoEspecifico(props){

    /**
     * @param string (props) - o nome do veiculo contido no terceiro select
     */

     let veiculos = []

     for (let index = 0; index < veiculosDaMarca.length; index++) {
 
       veiculos.push(veiculosDaMarca[index])
 
     }
 
     let url = ``

     //filtra um veiculo por nome e coleta o seu ID
     veiculos.forEach((valor, index, vet) => {

      if (valor.info[index].name === props){

        url = `https://fipeapi.appspot.com/api/1/${tipoVeiculo}/veiculo/${codigoDaMarcaSelecionada}/${valor.info[index].id}.json`
      
      }

    })

    await fetch(url)
      .then(response => response.json())
      .then(data => {

        let dados = []

        for (let index = 0; index < data.length; index++) {

          let {...info} = data[index]

          dados.push({info})

        }

        setVeiculos(dados)

      })
      .catch(error => {
        alert(error)
        console.error(error)
        setVeiculoSelecionado('')//em caso de erro o Select desaparece
      })

  }

  //arruma a UI quando o usuario troca o tipo de veiculo
  function confirmaTipoDeVeiculo(props) {

    setEstaObtendoDados(true)

    setMarcasDeVeiculo([]) //caso ocorra um erro as marcas anteriores ja foram apagadas
    setTipoVeiculo(props) //faz o segundo select aparecer/desaparecer
    if (props !== '') {

      ObterMarcas(props.toLowerCase())

    }
    setEstaObtendoDados(false)
  }
  //Arruma a UI quando a marca é trocada
  function confirmaMarcaDoVeiculo(props) {

    setEstaObtendoDados(true)

    setVeiculosDaMarca([])
    setMarcaSelecionada(props)
    if (props !== '') {

      ObterVeiculos(props)

    }
    setEstaObtendoDados(false)
  }
  //Arruma a UI quando o veiculo é trocado
  function confirmaVeiculo(props) {
    setEstaObtendoDados(true)

    setVeiculos([])
    setVeiculoSelecionado(props)
    if(props !== ''){

      ObterVeiculoEspecifico(props)

    }

    setEstaObtendoDados(false)

  }

  return (
    <>
      {/*uma navbar simples que não faz nada*/}
      <Navbar bg='dark' variant='dark'>
        <Navbar.Brand href="#inicio"> <FaCar /> ChecKar</Navbar.Brand>
        <Nav className="ml-auto">
          <Nav.Link href="#inicio">Início</Nav.Link>
          <Nav.Link href="#inicio">Nossos Veículos</Nav.Link>
          <Nav.Link href="#Venda">Venda</Nav.Link>
          <Nav.Link href="#contato">Contato</Nav.Link>
        </Nav>
      </Navbar>
      {/*um Jumbotrons que segura as opções de busca */}
      <Jumbotron>
        <div>
          <h2>Encontre o veículo que você precisa <FaCartArrowDown /></h2> <br></br>
          <Form>

            {/*seleciona o tipo de veiculo*/}
            <Form.Group>
              <Form.Label>Tipo</Form.Label>
              <Form.Control as='select' onChange={e => confirmaTipoDeVeiculo(e.target.value)}>
                <option></option>
                <option>Carros</option>
                <option>Motos</option>
                <option>Caminhões</option>
              </Form.Control>
            </Form.Group>

            {/*seleciona as marcas quando disponivel*/}
            {estaObtendoDados && !tipoVeiculo && 
            <Spinner animation='border' variant='primary' />}
            {tipoVeiculo &&
              <Form.Group>
                <Form.Label>Marca</Form.Label>
                <Form.Control as='select' onChange={e => confirmaMarcaDoVeiculo(e.target.value)} ref={selectMarcas}>
                  <option></option>
                </Form.Control>
              </Form.Group>}

              {/*seleciona os veiculos da marca selecionada*/}
              {estaObtendoDados && tipoVeiculo && !marcaSelecionada &&
              <Spinner animation='border' variant='primary' />}
              {marcaSelecionada &&
              <Form.Group>
                <Form.Label>Veiculo</Form.Label>
                <Form.Control as='select' onChange={e => confirmaVeiculo(e.target.value)} ref={selectVeiculos}>
                  <option></option>
                </Form.Control>
              </Form.Group>}
          </Form>
        </div>
      </Jumbotron>

      {estaObtendoDados && tipoVeiculo && marcaSelecionada && veiculoSelecionado &&
      <Spinner animation='border' variant='primary' />}
      {veiculoSelecionado && marcaSelecionada && tipoVeiculo &&
        <Jumbotron>

        {veiculos[0] &&
          <Card bg='secondary' text='light'>
            <Card.Header>
              <Card.Title>{veiculos[0]? veiculos[0].info.veiculo:''}</Card.Title>
              <Card.Subtitle>{veiculos[0]? veiculos[0].info.name:''}</Card.Subtitle>
            </Card.Header>
            <Card.Body>
                {
                  tipoVeiculo === 'Carros'
                    ? <FaCarSide />
                    : tipoVeiculo === 'Motos'
                      ? <FaMotorcycle />
                      : <FaTruck />
                } &nbsp;
            </Card.Body>
            <Card.Footer>
              <Button variant='success'> Fale Com Nossos Vendedores </Button>
            </Card.Footer>
          </Card>
        }
        <br></br>
        {veiculos[1] &&
          <Card bg='secondary' text='light'>
            <Card.Header>
              <Card.Title>{veiculos[1]? veiculos[1].info.veiculo:''}</Card.Title>
              <Card.Subtitle>{veiculos[1]? veiculos[1].info.name:''}</Card.Subtitle>
            </Card.Header>
            <Card.Body>
                {
                  tipoVeiculo === 'Carros'
                    ? <FaCarSide />
                    : tipoVeiculo === 'Motos'
                      ? <FaMotorcycle />
                      : <FaTruck />
                } &nbsp;
            </Card.Body>
            <Card.Footer>
              <Button variant='success'> Fale Com Nossos Vendedores </Button>
            </Card.Footer>
          </Card>
        }
        <br></br>
        {veiculos[2] &&
          <Card bg='secondary' text='light'>
            <Card.Header>
              <Card.Title>{veiculos[2]? veiculos[2].info.veiculo:''}</Card.Title>
              <Card.Subtitle>{veiculos[2]? veiculos[2].info.name:''}</Card.Subtitle>
            </Card.Header>
            <Card.Body>
                {
                  tipoVeiculo === 'Carros'
                    ? <FaCarSide />
                    : tipoVeiculo === 'Motos'
                      ? <FaMotorcycle />
                      : <FaTruck />
                } &nbsp;
            </Card.Body>
            <Card.Footer>
              <Button variant='success'> Fale Com Nossos Vendedores </Button>
            </Card.Footer>
          </Card>
        }
        </Jumbotron>
      }
    </>
  )
}

export default App
