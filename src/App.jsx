import { useState, useEffect } from 'react'
import Header from './components/Header'
import Modal from './components/Modal'
import ListadoGastos from './components/ListadoGastos'
import Filtros from './components/Filtros'
import IconoNuevoGasto from './img/nuevo-gasto.svg'
import {generarId} from './helpers'
 
function App() {

  const [presupuesto, setPresupuesto] = useState(
    Number(localStorage.getItem('presupuesto')) ?? 0
  ) //valor presupuesto inicial que sea el almacenado en localstorage y si no hay que sea 0
  const [isValidPresupuesto, setIsValidPresupuesto] = useState(false) //predeterminado falso la validacion
  const [modal, setModal] = useState(false) //no mostrar al inicio el modal, hasta que no haya un presupuesto valido
  const [animarModal, setAnimarModal] = useState(false) //no mostrar el modal hasta que no finalice el setTimeOut
  const [gastos, setGastos] = useState([
    ...(JSON.parse(localStorage.getItem("gastos")) ?? [])
  ]); //valor inicial de gastos sea el almacenado en localstorage, pero como es un string lo convierto a un arreglo y si no hay gastos que sea 0
  const [gastoEditar, setGastoEditar] = useState({}) //cada gasto es un objeto en si
  const [filtro, setFiltro] = useState('') //que inicie el filtro sin nada
  const [gastosFiltrados, setGastosFiltrados] = useState([]) //que inicie el arreglo de los gastos filtrados sin nada

  //Llamar al modal en caso de que se arrastre editar al gasto
  useEffect(()=> {
    if(Object.keys(gastoEditar).length > 0){
      setModal(true)
      setTimeout(() => {
        setAnimarModal(true)
      },500)
    }
  },[gastoEditar])

  //Almacenar en localstorage el presupuesto
  useEffect(()=>{
    localStorage.setItem('presupuesto', presupuesto ?? 0)
  }, [presupuesto])

  //Si hay presupuesto ya en el LS que directamente vaya a la segunda pantalla
  useEffect(()=> {
    const presupuestoLS = Number(localStorage.getItem('presupuesto')) ?? 0
    if(presupuestoLS > 0){
      setIsValidPresupuesto(true)
    }
  }, [])

  //Almacenar en localstorage los gastos
  useEffect(()=> {
    localStorage.setItem('gastos', JSON.stringify(gastos) ?? [])
  }, [gastos])

  //Filtrar gastos
  useEffect(()=>{
    if(filtro){
      const gastosFiltrados = gastos.filter(gasto => gasto.categoria === filtro)
      setGastosFiltrados(gastosFiltrados)
    }
  }, [filtro]);

  //funcion mostrar modal al agregar un nuevo gasto
  const handleNuevoGasto = () => {
    setModal(true)
    setGastoEditar({}) //limpiar el state
    setTimeout(() => {
      setAnimarModal(true)
    },500)
  }

  //funcion de guardar el gasto al agregar uno nuevo
  const guardarGasto = gasto => {
    if(gasto.id){
      //Actualizar
      const gastosActualizados = gastos.map(gastoState => gastoState.id === gasto.id ? gasto : gastoState)
      setGastos(gastosActualizados)
      setGastoEditar({}) //limpiar el state
    } else{
      //Nuevo gasto
      gasto.id = generarId()
      gasto.fecha = Date.now()
      setGastos([...gastos, gasto])
    }
    setTimeout(()=>{
        setModal(false)
    },500)
    setAnimarModal(false)
  }

  //funcion para eliminar el gasto segun el id del producto
  const eliminarGasto = id => {
    const gastosActualizados = gastos.filter(gasto => gasto.id !== id)
    setGastos(gastosActualizados)
  }

  return (
    <div className={modal ? 'fijar' : ''}>
      <Header
        gastos={gastos}
        setGastos={setGastos}
        presupuesto={presupuesto}
        setPresupuesto={setPresupuesto}
        isValidPresupuesto={isValidPresupuesto}
        setIsValidPresupuesto={setIsValidPresupuesto}
      />
      {isValidPresupuesto ? (
        //si el presupuesto es valido, que aparezca la imagen de +
        <>
          <main>
            <Filtros
              filtro={filtro}
              setFiltro={setFiltro}
            />
            <ListadoGastos 
              gastos={gastos}
              setGastoEditar={setGastoEditar}
              eliminarGasto={eliminarGasto}
              filtro={filtro}
              gastosFiltrados={gastosFiltrados}
            />
          </main>
          
          <div className='nuevo-gasto'>
            <img src={IconoNuevoGasto} alt="icono nuevo gasto" onClick={handleNuevoGasto}/>
          </div>
        </>
      ) : null}
      {modal && <Modal 
                  setModal={setModal}
                  animarModal={animarModal}
                  setAnimarModal={setAnimarModal}
                  guardarGasto={guardarGasto}
                  gastoEditar={gastoEditar}
                  setGastoEditar={setGastoEditar}
                />}
    </div>
  )
}

export default App
