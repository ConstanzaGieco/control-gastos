import {Children, useState} from 'react'
import Mensaje from './Mensaje'

const NuevoPresupuesto = ({presupuesto, setPresupuesto, setIsValidPresupuesto}) => {

    const [mensaje, setMensaje] = useState('') //valor inicial

    const handlePresupuesto = (e) => {
        e.preventDefault();
        //en caso de que no sea un presupuesto valido
        if(!presupuesto || presupuesto < 0){
            setMensaje('No es un presupuesto válido')
            return
        }
        //en caso de que sea un presupuesto valido
        setMensaje('') 
        setIsValidPresupuesto(true)
        
    }

    return (
    <div className='contenedor-presupuesto contenedor sombra'>
        <form className='formulario' onSubmit={handlePresupuesto}>
        <div className='campo'>
            <label>Definir Presupuesto</label>
            <input type="number" className='nuevo-presupuesto' placeholder='Añade tu presupuesto' value={presupuesto}
            onChange={e => setPresupuesto(Number(e.target.value))}
            />
            <input type="submit" value="Añadir" />
            {mensaje && <Mensaje tipo='error'>{mensaje}</Mensaje>}
        </div>
        </form>
    </div>
    )
}

export default NuevoPresupuesto
