import './Home.scss';
import React, {  useState, useEffect  } from 'react'
import { useNavigate} from "react-router-dom"

import { Button } from '@mui/material';

import { Url } from '../constants/global'
import axios from 'axios'

import Puebla from "../assets/Puebla.png"
import Playa from "../assets/PLAYA DEL CARMEN.png"
import Ensenada from "../assets/ENSENADA.png"
import Cholula from "../assets/CHOLULAS.png"
import Periferico from "../assets/PERIFERICO.png"
import generic from "../assets/icon_prj_kc3-removebg-preview.png"

const Home = () => {
    const token = localStorage.getItem('token');

    const Navigate = useNavigate();    
    const user = JSON.parse(localStorage.getItem('user_datos'));

    useEffect(() =>{
        if(token === null){
            Navigate("/")
        }
    },[])

    const enviarMap = (proyecto_prop) =>{
        localStorage.setItem('id_proyecto', proyecto_prop.id);
        localStorage.setItem('nombre_proyect', proyecto_prop.nombre);

        axios.get(Url + 'proyectos/' + proyecto_prop.id, {
            headers: {
                Authorization : token,
            }
          })
        .then(res =>  {
            const proyect_latlng = {
                "lat" : res.data.latitud,
                "lng" : res.data.longitud
            }
            localStorage.setItem('proyect_latlng', JSON.stringify(proyect_latlng));
          })
        .catch(err => console.log(err))

        switch (user.rol) {
            case 7:
                Navigate("/tablaReportes")
            break;

            case 11:
                    Navigate("/creacionreporte")
                break;

            case 13:
                    Navigate("/recorridos")
                break;
        
            default:
                    Navigate("/dashboard")
                break;
        }
    }

    const styleMenu = {
        width: 150,
        height: 150,
        border: "1.5px solid #52dab3",
        borderRadius: 5,
        zIndex:1, 
        backgroundColor:"#0b1522",
    }

    const changeImage = (proyecto) => {
        switch (proyecto) {
            case "Puebla":
                return Puebla;

            case "Ensenada":
                return Ensenada;

            case "Playa del Carmen":
                return Playa;

            case "San Andres Cholula":
                return Cholula;

            case "Periférico":
                return Periferico;

            case "San Pedro Cholula":
                return Cholula;
        
            default:
                return generic
        }
    }
	
    if(token) {
        return (
            <div className="Home">
                <h1 style={{color:"white"}}>BIENVENIDO
                <br/>
                {user.nombre}</h1>
                <h3 style={{color:"white"}}>Seleccione el proyecto con el que desea trabajar</h3>
                <div style={{margin:"3%", marginTop:"3%", display:"flex", justifyContent:"space-evenly",
                            //width:"100%"
                            }}>
                    {user.proyectos.map((proyecto, index) => (
                        <Button sx={styleMenu} onClick={() => enviarMap(proyecto)} key={index}>
                            <div>
                                <img src={changeImage(proyecto.nombre)} alt='estado' width={80}/>
                                <br/>
                                <b>{proyecto.nombre}</b>
                            </div>
                        </Button>
                    ))}
                    {/*
                    <Button sx={styleMenu} onClick={() => Navigate("/luminarias")}>
                        <div>
                            <img src={Puebla} alt='Puebla' width={80}/>
                            <br/>
                            <b>PUEBLA</b>
                        </div>
                    </Button>
                    */}
                </div>
            </div>
        );
    }else{
        return Navigate("/login")
    }
}

export default Home;