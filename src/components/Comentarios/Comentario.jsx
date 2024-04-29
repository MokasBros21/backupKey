import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TextField from '@mui/material/TextField';

import React, { useRef, useState, useEffect} from "react";
import axios from 'axios'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
const Comentarios = ({ruta, showAdd}) => {
    
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user_datos'));
    const [datoscomentarios, setdatoscomentarios] = useState([])
    const [textComentario, settextComentario] = useState("")
    const refText = useRef(null);

    const [showComentsSistema, setshowComentSistema] = useState(true);

    const diferencia = (stringfecha) => {
        const today = new Date();
        const datafecha = new Date(stringfecha);

        var diaEnSeg = 1000;
        var mensajefinal = "";

        var dif = ((today.getTime() - datafecha.getTime())/diaEnSeg)/60

        if (dif<60) {
            if(dif.toFixed(0) <= 0){
                mensajefinal = "Hace un momento"
            }else{
                mensajefinal = "Hace: " + dif.toFixed(0) + "min";
            }
        }else if((dif=>60) && (dif<1440))
        {
            dif=dif/60
            mensajefinal = "Hace: " + dif.toFixed(0) + "hrs";

        }else if(dif=>1440){
            dif=dif/1440

            if(dif.toFixed(0) <= 1){
                mensajefinal = "Ayer"
                //mensajefinal = "Hace: " + dif.toFixed(0) + "día(s)";
            }else{
                mensajefinal = ""
            }
        }

        return mensajefinal
    }

    const cargarDatos = async () => {
        await axios.get(ruta, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            setdatoscomentarios(res.data)
        })

        .catch(err => console.log(err))

    }

    useEffect(() => {
        cargarDatos()
    },[])

    const handleChangeComentario = (event) => {
        const value = event.target.value;
        settextComentario(value);
      }

    const addComentario = () =>{
        axios.post(ruta,
        {
            comentario:textComentario
        }, {
            headers: {
                Authorization : token,
            }
        })
        .then(res => {
            cargarDatos()
        })
        .catch(err => console.log(err))
        settextComentario("");
        refText.current.focus();
    }

    return ( 
        <div>
            <Box component="div">
                {(showAdd && ![7].includes(user.rol)) &&
                <>
                    <TextField id="outlined-basic" variant="outlined" placeholder="Comentario" value = {textComentario}
                    sx={{width:360, padding:1, marginLeft:-1}} color="success" onChange={handleChangeComentario}
                    autoFocus={true} inputRef={refText}/>
                    <Button variant="outlined" color="success" onClick={addComentario}
                        sx={{marginTop:1, height:52}}>
                        <AddCircleOutlineIcon sx={{marginRight:1}}/>
                            Crear
                    </Button>
                </>}

                    <Box component="div" 
                    sx={{display:"flex", alignItems:"center", justifyContent:"center", my:1}}
                    >
                        <Checkbox onClick={() => setshowComentSistema(!showComentsSistema)}/>
                        <label style={{marginTop:2}}> {showComentsSistema ? "Mostrar " : "Quitar "} 
                            Comentarios del Sistema </label>
                    </Box>

                    <Timeline      
                    sx={{
                        [`& .${timelineItemClasses.root}:before`]: {
                        flex: 0,
                        padding: 0,
                        },
                    }}
                    style={{ marginLeft: showAdd ? 20 : 0 }}
                    >
                        {datoscomentarios
                        .filter(Comentario => showComentsSistema ? Comentario.nombre !== "KeycityBot" : true)
                        .map((Comentario, index) => (
                        <TimelineItem key={index}>
                            <TimelineSeparator>
                                <TimelineDot variant="outlined" color="primary"/>
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>          
                                <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
                                    <div style={{textAlign:"left", width:'80%'}}>
                                        <AccountCircleIcon sx={{marginBottom:-0.5, marginRight:1, color:blue[600]}}/>
                                        <Typography variant="h6" component="span">
                                            {Comentario.nombre + " " + 
                                            //Comentario.ap_paterno
                                            (Comentario.ap_paterno === null ? "" : Comentario.ap_paterno)
                                            }
                                        </Typography>
                                        <Typography>{Comentario.comentario||""}</Typography>
                                    </div>
                                    <div style={{textAlign:"right", width:'30%'}}>
                                        <Typography>
                                        {diferencia(Comentario.created_at) === "" ?
                                            Comentario.created_at : diferencia(Comentario.created_at)
                                        }
                                        </Typography>
                                    </div>
                                </div>
                            </TimelineContent>
                        </TimelineItem>
                            ))}
                    </Timeline>
            </Box>
        </div>
    );
}

export default Comentarios;