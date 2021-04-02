import React, { useState, useRef, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'
import Card from 'react-bootstrap/Card'

//import ObterMarcas from './components/ObterMarcas'

import { FaCar, FaCartArrowDown } from 'react-icons/fa'



function App() {

  //marca quando os dados da API estão sendo coletados
  const [estaObtendoDados, setEstaObtendoDados] = useState(false)
  //seleciona o tipo de veiculo
  const [tipoVeiculo, setTipoVeiculo] = useState('')
  //armazena a marcas
  const [marcasVeiculo, setMarcasVeiculo] = useState([])
  //armazena os carros da marca
  const [veiculosMarca, setVeiculosMarca] = useState([])

  //o segundo select (Marcas)
  const selectMarcas = useRef(null)

  useEffect(() => {
    //console.log(selectMarcas.current)


    //console.log(selectMarcas.current)
    if (selectMarcas.current !== null) {

      let listaMarcas = marcasVeiculo

      selectMarcas.current.innerHTML = '<option><option/>'

      listaMarcas.forEach((valores, index, vet) => {

        vet[index] = `<option>${valores.name}<option/>\n`
        selectMarcas.current.innerHTML += vet[index]

      })
    }


  }, [marcasVeiculo])

  async function ObterMarcas(props) {

    let tipoDeVeiculo = props === 'caminhões' ? 'caminhoes' : props //o valor no select do formulario

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
        setMarcasVeiculo(marcas)
      })
      .catch(error => {
        alert(error)
        console.error(error)
        setTipoVeiculo('') //faz o segundo select desparecer em caso de erro
      })
  }

  function confirmaTipoDeVeiculo(props) {

    setEstaObtendoDados(true)
    setMarcasVeiculo([])
    setTipoVeiculo(props)
    if (props !== '') {

      ObterMarcas(props.toLowerCase())

      setEstaObtendoDados(false)

    }
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
            {estaObtendoDados && !tipoVeiculo && <Spinner animation='border' variant='primary' />}
            {tipoVeiculo &&
              <Form.Group>
                <Form.Label>Marca</Form.Label>
                <Form.Control as='select' id='selectMarcas' ref={selectMarcas}>
                  <option></option>
                </Form.Control>
              </Form.Group>}
          </Form>
        </div>
      </Jumbotron>
    </>
  )
}

export default App
