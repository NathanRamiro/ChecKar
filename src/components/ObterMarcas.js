/**
 * consulta a API para descobrir as marcas de carro disponiveis
 * 
 * @param String {props} //o tipo de veiculo a ser procurado
 * @returns um json contendo os nomes e codigos das marcas disponiveis
 */

 async function ObterMarcas(props) {
    
    let tipoDeVeiculo = props === 'caminhões'? 'caminhoes' : props //o valor no select do formulario
        //console.log(tipoDeVeiculo)
    let marcas = []
    let url = `https://fipeapi.appspot.com/api/1/${tipoDeVeiculo}/marcas.json`
    await fetch(url)
        .then(response => response.json())
        .then(data => {

            /*data.forEach(element => {
                marcas.push(element)
            });*/

            //descon
            for (let index = 0; index < data.length; index++) {
        
                let {key, name, id} = data[index]
                //let {...dados} = data[index]
                marcas.push({key,name,id})
                //marcas.push({dados})
                
            }
                //console.log(marcas)
                return(marcas)
                //console.log(marcasVeiculo)
                
                //console.log(marcas)
            
            //return(marcas)
        })
        .catch(error => {
            alert(error)
            console.error(error)
            return([])
        })



}

export default ObterMarcas