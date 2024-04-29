import React, { useState, useRef } from "react";
import classnames from "classnames";

import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

import icon from '../../assets/icon.png'
import { useNavigate} from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faRepeat } from '@fortawesome/free-solid-svg-icons'

import "./TopBar.scss";
import { useEffect } from "react";
import { Badge, IconButton } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import axios from "axios";
import { Url } from "../../constants/global";
import { Done, DoneOutlineOutlined } from "@mui/icons-material";
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

const TopBar = ({titulo}) => {
    
    const [isOpen, setIsOpen] = useState(true);
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user_datos'));
    const nombre_proyect = localStorage.getItem('nombre_proyect')
    const buttonRef = useRef(null);

    const Navigate = useNavigate();

    const [porcentaje, setporcentaje]  = useState(0)
    const [notificacion, setnotificacion] = useState(false)

    useEffect(() => {
        if (!notificacion) {
            const intervalword = setInterval(() => {
                if (localStorage.getItem('datos_descarga_word') !== null && !notificacion) {
                    verificarWordListo();
                }
            }, 15000);

            return () => {
                clearInterval(intervalword);
            };
        }
    }, [notificacion]);

    const verificarWordListo = async () => {
        let avance = 0

        const intervalDownload = setInterval(() => {
            if (avance >= 100) {    
                clearInterval(intervalDownload);
                setporcentaje(0)
                setnotificacion(true)
                return;
            }
        }, 5000);

        await axios.get(Url + "reportes/word/status", {
            headers:{
                Authorization : token
            }
        })
        .then(res => {
            avance = res.data.porcentaje
            setporcentaje(res.data.porcentaje)
        })
        .catch(err => {
            console.log(err)
            localStorage.removeItem('datos_descarga_word');
        })

    }

    const WordAbierto = async () => {
            // Construir la URL
            const UrlWord = Url+ "reportes/word/download?user="+user.id;

            const response =  await axios.get(UrlWord , {
                responseType: 'blob'
            });
            // Crea una URL para el Blob
            const url = window.URL.createObjectURL(response.data);
                
            // Crea un elemento <a> para simular un clic y descargar el archivo
            const link = document.createElement('a');
            link.href = url;

            // Establece el nombre del archivo que se descargará
            link.download = 'reportes.docx'; // Cambia 'nombre_del_archivo.pdf' por el nombre que desees

            // Simula un clic en el enlace para descargar el archivo
            document.body.appendChild(link);
            link.click();

            // Elimina el enlace después de la descarga
            document.body.removeChild(link);
            
            setnotificacion(false)
            localStorage.removeItem('datos_descarga_word');
    }

    const salir = () => {
        localStorage.clear();
        Navigate("/");
    }

    const tohome = () => {
        Navigate("/home")
    }

    if(token) {
        return (
        <>
            <div className="TopBar">

                <div style={{display:"flex", alignItems:"center"}}>
                    <img src={icon} 
                    width={100}
                    height={100}
                    //style={{marginTop:-23}}
                    alt="Key City"/>

                    <h2 style={{marginTop:-2, marginLeft:5, color:"white"}}>{titulo}</h2>
                </div>

                <div className="ButtonA">
                    <h3 style={{color:"white", marginTop:8, marginRight:10}}>{nombre_proyect} -</h3>

                    <h3 style={{marginTop:10, display:"flex", alignItems:"center"}}>
                        {user.nombre}<p style={{marginLeft:8, marginTop:2, fontSize:13}}>({user.rol_name})</p>
                    </h3>

                    {![8].includes(user.rol) &&
                    <>
                    {notificacion ? 
                        <IconButton onClick={WordAbierto} sx={{ml:1.5}}>
                            <Badge badgeContent={<PriorityHighIcon fontSize="10px"/>} color="error">
                                <DownloadIcon sx={{color:"#2E4053"}}/>
                            </Badge>
                        </IconButton>
                        :
                        <>
                        {porcentaje > 0 ?
                            <Badge badgeContent={porcentaje+"%"} color="error" 
                            sx={{'& .MuiBadge-badge': {fontSize: 10}}}
                            >
                                <DownloadIcon sx={{color:"#2E4053", ml:1.5}}/>
                            </Badge>
                            :
                            <DownloadIcon sx={{color:"#2E4053", ml:1.5}}/>
                        }
                        </>
                    }
                    &nbsp;&nbsp;

                    <PersonIcon sx={{color:"#2E4053", ml:1.5}}/>

                    {isOpen &&
                    <button className={classnames("mini circular ui button")}
                    style={{width: 60, height: 50, backgroundColor: 'rgba(52, 52, 52, 0.0)', 
                    marginRight: -15}} title="Cambiar de Proyecto" onClick={tohome}>
                        <FontAwesomeIcon icon={faRepeat} size="xl"/>
                    </button>}
                    </>
                    }

                    <button className={classnames("mini circular ui button")} onClick={salir}
                    style={{width: 60, height: 50, backgroundColor: 'rgba(52, 52, 52, 0.0)', marginRight: -15}}
                    title="Salir">
                        <LogoutIcon />
                    </button>
                </div>
            </div>
        </>
    );
    } else {
        Navigate("/login")
    }
}

export default TopBar;