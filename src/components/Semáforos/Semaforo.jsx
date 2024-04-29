import { useEffect, useState } from "react";
import './Semaforo.scss';

import { Chip, Skeleton, InputLabel, TextField } from "@mui/material";
import { Add, AlignHorizontalCenter, AlignVerticalCenter, Ballot, Traffic } from "@mui/icons-material";

const Semáforo = ({dataSemaforo_prop}) => {

    const [dataSemaforo, setdataSemaforo] = useState([])
    const [disabled, setdisabled] = useState(true)

    useEffect(()=> {
        //console.log(Semaforo.ID_Semaforo)
        buscarSemaforo(dataSemaforo_prop)
    },[dataSemaforo_prop.ID_Semaforo])

    const buscarSemaforo = (semaforo) => {
        setdataSemaforo(semaforo)
    }

    const BoxDatoNormal = ({icono, titulo, dato}) => {
        return (
            <div className="BoxInfoSemaforo">
                {icono}
                <InputLabel sx={{width:"20%", textAlign:"left"}}>{titulo}</InputLabel>
                <TextField value={dato} variant="standard" sx={{width:"70%", ml:1}} disabled={disabled}
                multiline/>
            </div>
        );
    }

    return (
        <div>
            <BoxDatoNormal icono={<Traffic sx={{mr:1}}/>} 
            titulo={"Etiqueta: "} dato={dataSemaforo.etiqueta}/>

            <BoxDatoNormal icono={<AlignHorizontalCenter sx={{mr:1}}/>} 
            titulo={"Latitud: "} dato={dataSemaforo.latitud}/>

            <BoxDatoNormal icono={<AlignVerticalCenter sx={{mr:1}}/>} 
            titulo={"Longitud: "} dato={dataSemaforo.longitud}/>

            <BoxDatoNormal icono={<Add sx={{mr:1}}/>} 
            titulo={"Intersección: "} dato={dataSemaforo.nombre_interseccion}/>

            <BoxDatoNormal icono={<Ballot sx={{mr:1}}/>} 
            titulo={"Controlador: "} dato={dataSemaforo.nombre_controlador}/>
        </div>
    );

    }
export default Semáforo;