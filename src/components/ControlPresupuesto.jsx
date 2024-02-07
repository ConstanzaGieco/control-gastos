import { useEffect, useState } from "react"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import 'react-circular-progressbar/dist/styles.css'

const ControlPresupuesto = ({presupuesto,gastos, setGastos, setPresupuesto, setIsValidPresupuesto}) => {

    const [disponible, setDisponible] = useState(0)
    const [gastado, setGastado] = useState(0)
    const [porcentaje, setPorcentaje] = useState(0)

    //Definir el total gastado y el total disponible. Se coloca [gastos], para que la primer vuelta tome su useState [] vacio
    useEffect(()=>{
        const totalGastado = gastos.reduce((total, gasto) => {
            return gasto.cantidad + total;
        }, 0)
        const totalDisponible = presupuesto - totalGastado
        setGastado(totalGastado)
        setDisponible(totalDisponible)
        //calcular el porcentaje gastado
        const nuevoPorcentaje = (((presupuesto - totalDisponible) / presupuesto) * 100).toFixed(2)
        setTimeout(()=>{
            setPorcentaje(nuevoPorcentaje)
        },1000)
    },[gastos])

    //Hay que asegurarse de no modificar el state original, en este caso presupuesto. Le definimos el formato de moneda
    const formatearCantidad = (cantidad) => {
        return cantidad.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        })

    }

    //Funcion para resetear la app
    const handleResetApp = () => {
        const resultado = confirm('¿Desear reiniciar presupuesto y gastos?');
        if(resultado){
            setGastos([])
            setPresupuesto(0)
            setIsValidPresupuesto(false)
        }
    }

    return (
        <div className='contenedor-presupuesto contenedor sombra dos-columnas'>
            <div>
                <CircularProgressbar
                    value={porcentaje}
                    styles={buildStyles({
                        pathColor: porcentaje > 100 ? '#DC2626' : '#3B82F6',
                        trailColor: '#F5F5F5',
                        textColor: porcentaje > 100 ? '#DC2626' : '#3B82F6',
                    })}
                    text={`${porcentaje}% Gastado`}
                />
            </div>
            <div className='contenido-presupuesto'>
                <button 
                    className="reset-app"
                    type='button'
                    onClick={handleResetApp}
                >
                    Resetear App
                </button>
                <p>
                    <span>Presupuesto: </span>{formatearCantidad(presupuesto)}
                </p>
                <p className={`${disponible < 0 ? 'negativo' : ''}`}>
                    <span>Disponible: </span>{formatearCantidad(disponible)}
                </p>
                <p>
                    <span>Gastado: </span>{formatearCantidad(gastado)}
                </p>
            </div>
            
        </div>
    )
}

export default ControlPresupuesto
