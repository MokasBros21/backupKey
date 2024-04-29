import React, { useRef, useState, useEffect, useCallback } from "react";
import axios from 'axios'

import "./Marker.scss";
import classnames from "classnames";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Divider from '@mui/material/Divider';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import ListIcon from '@mui/icons-material/List';
import AppsIcon from '@mui/icons-material/Apps';

import ListItemIcon from '@mui/material/ListItemIcon';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import AddCommentIcon from '@mui/icons-material/AddComment';
import { blue, green, red } from "@mui/material/colors";

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';

import TextField from '@mui/material/TextField';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


const style = {
    position: 'absolute',
    top: '12%',
    left: '6%',
    width: 250,
    bgcolor: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    p: 2,
    textAlign:'center'
  };

  const style2 = {
    position: 'absolute',
    top: '20%',
    left: '30%',
    width: 800,
    height: 300,
    bgcolor: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    p: 1,
    border: "2px solid black",
    overflow: 'auto',
    borderRadius: '16px'
  };

const Marker = ({ onClick, children, data }) => {

    const _onClick = () => {
        onClick(data);
    };

    
    const [me, setMe] = useState([])

    useEffect(() =>{
        const my = (JSON.parse(localStorage.getItem("key")))
        setMe(my);
        //console.log(JSON.parse(localStorage.getItem("key")))
    }, [])

    
    const ref = useRef();
    const [text, setText] = useState("");
    const [coments, setcoments] = useState([])
    const [open, setOpen] = React.useState(false);
    const [AbrirTime, setAbrirTime] = React.useState(false);
    const [datacoments, setdatacoments] = useState([])

    const traerDatos = () =>{
        setdatacoments([]);
        axios.get('http://localhost:8081/3')
        .then(res =>  {
            //console.log(res.data);
                res.data.map(element => {
                    setdatacoments((array) => {
                        return [...array,{
                            Usuario: element.Usuario,
                            Comentario: element.Comentario,
                            fecha: element.fecha,
                            diferencia: diferencia(element.fecha)
                        }];
                    })
                });
            })
        .catch(err => console.log(err))
    }

    const OpenTime = () => {
        traerDatos();
        //diferencia();
        setAbrirTime(true);
    }

    const handleChange = (event) => {
        const value = event.target.value;
        setText(value);
      }

    const diferencia = (stringfecha) => {
        const today = new Date();
        const datafecha = new Date(stringfecha);

        const pruebas = datafecha.getMinutes();
        const pruebash = datafecha.getHours();
        const mintotal = ((pruebash * 60)+pruebas);

        const date = today.getDate();
        const hour = today.getHours();
        const minutes = today.getMinutes();
        const mintotal2 = ((hour * 60)+minutes);

        //var dif = (mintotal2 - mintotal)
        var diaEnSeg = 1000;
        var mensajefinal = "";

        var dif = ((today.getTime() - datafecha.getTime())/diaEnSeg)/60

        if (dif<60) {
            mensajefinal = "Hace: " + dif.toFixed(0) + "min"
        }else if(dif=>60 && dif<1440)
        {
            dif=dif/60
            mensajefinal = "Hace: " + dif.toFixed(0) + "hrs"
        }else if(dif=>1440){
            dif=dif/1440
            mensajefinal = "Hace: " + dif.toFixed(0) + "día(s)"
        }

        return mensajefinal
    }

    const addItem = () => {
        //alert(me.nombre);
        //const valuea = document.getElementById("outlined-basic").value
        axios.post('http://localhost:8081/4', null, 
                {params: {
                      comment: text,
                      user: me.nombre
                  }})
        .catch(err => console.log(err))
        setText("");
        traerDatos();
        ref.current.focus();
    }

    const CerrarTime = () => {
        setAbrirTime(false)
        //handleClose()
    }

    const handleOpen = () => {
        onClick(data)
        setOpen(true)
    };
    const handleClose = () => setOpen(false)

    return (
        <>
        {/*
        <Modal
            open={open}
            onClose={handleClose}
        >
           <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6">
                    <ListItemIcon style={{marginRight:-25}}>
                        <TipsAndUpdatesIcon/>
                    </ListItemIcon>
                        Id: {data.idIlumina}
                </Typography>
                <Divider style={{marginBottom:10}}/>
                <Typography id="modal-modal-description" variant="h6" style={{marginBottom:5}}>
                <ListItemIcon style={{marginRight:-25}}>
                        <ListIcon fontSize="small"/>
                </ListItemIcon>
                Datos
                </Typography>
                <Typography id="modal-modal-description" variant="h7">
                    <b>Latitud:</b> {data.latitud}
                    <p style={{marginBottom:-1}}/>
                    <b>Longitud:</b> {data.longitud}
                </Typography>
                <Divider style={{marginBottom:10}}/>
                <Typography id="modal-modal-title" variant="h6">
                    <ListItemIcon style={{marginRight:-26}}>
                        <AppsIcon fontSize="small"/>
                    </ListItemIcon >
                        Acciones
                </Typography>
                <Button style={{backgroundColor:green.A400, color:"whitesmoke"}}>
                    <NoteAddIcon fontSize="small" style={{marginRight:5}}/>
                    <b>Crear</b>
                </Button>
                <Button 
                    style={{backgroundColor:blue.A400, color:"whitesmoke", marginLeft:10}}
                    onClick={OpenTime}>
                <AddCommentIcon fontSize="small" style={{marginRight:5}}/>
                    <b>Comentar</b>
                </Button>
            </Box>
        </Modal>        

        <Modal
            open={AbrirTime}
            onClose={CerrarTime}
        >
            <div style={{ width: 200, height: 100 }}>
            <Box component="div" sx={style2}>
            <TextField id="outlined-basic" variant="outlined" placeholder="Comentario" value = {text}
            sx={{width:650, padding:1}} color="success" onChange={handleChange} 
            inputRef={ref}  autoFocus/>
            <Button variant="outlined" color="success" onClick={addItem}
            sx={{marginTop:1, height:52}}>
            <AddCircleOutlineIcon sx={{marginRight:1}}/>
                Crear</Button>
            <Timeline style={{marginLeft:-700}}>
            {datacoments.map((Comentario, index) => (
                <TimelineItem>
                <TimelineSeparator>
                    <TimelineDot variant="outlined" color="primary"/>
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>          
                    <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
                        <div style={{textAlign:"left"}}>
                    <AccountCircleIcon sx={{marginBottom:-0.5, marginRight:1, color:blue[600]}}/>
                    <Typography variant="h6" component="span">
                        {Comentario.Usuario}
                    </Typography>
                    <Typography>{Comentario.Comentario}</Typography>
                    </div>
                    <div style={{textAlign:"right"}}>
                    <Typography>{Comentario.fecha}</Typography>
                    <Typography>{Comentario.diferencia}</Typography>
                    </div>
                    </div>
                </TimelineContent>
                </TimelineItem>
            ))}
            </Timeline>
            </Box>
           </div>
        </Modal>
            */}
        <button onClick={handleOpen} className={classnames("Marker")}>
            </button>
        </>

            
    );
}

export default Marker;