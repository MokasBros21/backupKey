import React, {  useState } from 'react'
import axios from 'axios'
import "./LogIn.scss"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content';
import LoaderIndicator from '../layout/LoaderIndicator/LoaderIndicator';

import logo from '../assets/Marca_Key.png'

import { useNavigate} from "react-router-dom";
import { Url } from '../constants/global'

const LogIn = () => {

    const [inputs, setInputs] = useState({});
    const [ isLogging, setIsLogging ] = useState(false);

    const Navigate = useNavigate();
    const MySwal = withReactContent(Swal);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
    }

    const hacerme = async (token) =>{

        await axios.get(Url + 'me', {
            headers: {
                Authorization : token,
            }
          })
        .then(res =>  {
            let usuario_id = (res.data.data.id);
            let nombre = (res.data.data.nombre + " " + res.data.data.ap_paterno);
            let rol = (res.data.data.roles[0].id);
            let rol_nombre = (res.data.data.roles[0].nombre);
            let proyectos = res.data.data.proyectos

            if (![2,6,9,10].includes(rol)) {
                const user_dates = {
                    "id"        : usuario_id,
                    "rol"       : rol,
                    "nombre"    : nombre,
                    "rol_name"  : rol_nombre,
                    "proyectos" : proyectos
                }
                localStorage.setItem('user_datos', JSON.stringify(user_dates));

                Navigate("/home");
            } else {
                Swal.fire({
                    title: "Sin Acceso",
                    text: "Favor de contactar al administrador",
                    icon: "error"
                })
            }
          })
        .catch(err => console.log(err))
    }

    const doLogin = async () => {
        let url = Url + "login";
        setIsLogging(true);
        await axios.post(
            url,
            inputs ,
            {
                headers: {
                    'Content-Type': 'text/json',
                }
            }
        ).then(res =>  {
            let token = res.data.token_type + " " + res.data.token;
            setIsLogging(false);
            localStorage.setItem('token', token);
            hacerme(token)
        })
        .catch(function (error) {
            console.log(error);
            setIsLogging(false);
            if(error.response.status === 401 ) {
                MySwal.fire({
                    title: <strong>Acceso incorrecto</strong>,
                    html: <i>Credenciales incorrectas. Por favor verifique usuario y contraseña</i>,
                    icon: 'error'
                });
            }
            else {
                MySwal.fire({
                    title: <strong>Acceso incorrecto</strong>,
                    html: <i>Ocurrió un error en el servidor; por favor verifique con el administrador.</i>,
                    icon: 'error'
                });
            }
        });
    }

    const onKeyDownHandler = (event) => {
    
        if (event.key === "Enter") {
            doLogin()
        }
    }
    
    return (
        <div className="container">
            <div className="top"></div>
            <div className="bottom"></div>
            <div className="center">
                <div className="columns">
                    <img src={logo} alt="TrafficLight" width={200} style={{paddingBottom:"30px"}}/>
                </div>

                <form>
                    <h2 className="h2Login">Inicio de Sesión</h2> 
                    <input id="username" name="email" type="email" placeholder="ejemplo@trafficlight.mx"
                    value={inputs.email || ""} onChange={handleChange} />
                    <input id="password" name="password" type="password" placeholder="Contraseña"
                    value={inputs.password || ""} onChange={handleChange} onKeyDownCapture={onKeyDownHandler}/>
                    
                    <div className="centrar">
                        <button className="ui positive button" type="button" disabled={isLogging} onClick={doLogin}>
                            Ingresar
                        </button>
                    </div>
                </form>
            
            </div>
            { isLogging && <LoaderIndicator /> }
       </div>
    );
}

export default LogIn;
    
