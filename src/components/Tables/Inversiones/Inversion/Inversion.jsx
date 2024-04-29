import { Box, Button, Divider, IconButton, InputLabel, MenuItem, Select, Skeleton, TextField } from '@mui/material';
//Iconos
import LightIcon from '@mui/icons-material/Light';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PriceChangeIcon from '@mui/icons-material/PriceChange';

//Botones de Acción
import PreviewIcon from '@mui/icons-material/Preview';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import EditNoteIcon from '@mui/icons-material/EditNote';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ConstructionIcon from '@mui/icons-material/Construction';

import './Inversion.scss'
import { Url } from '../../../../constants/global';

import { useEffect, useState } from 'react';

import axios from 'axios';
import LoaderIndicator from '../../../../layout/LoaderIndicator/LoaderIndicator';
import Swal from 'sweetalert2';

const Inversion = ({idInversion, rechargeTable, cerrarPanel, openPanel, llenarReporte, llenarLuminaria, 
    indexTable}) => {
    
    const token = localStorage.getItem('token');

    const [isCharging, setisCharging] = useState(false)
    const [disabled, setdisabled] = useState(true)

    const [dataInversion, setdataInversion] = useState([])
    const [dataActividades, setdataActividades] = useState([])
    const [dataImagenesReporte, setdataImagenesReporte] = useState([])
    const [dataImagenesLuminaria, setdataImagenesLuminaria] = useState(null)
    const [pdlid, setpdlid] = useState(null)

    const traerInversion = async (idInversionParam) => {
        setisCharging(true)
        await axios.get(Url + "inversiones/" + idInversionParam, {
            headers:{
                Authorization : token
            }
        })
        .then(res => {
            setisCharging(false)
            setdataInversion(res.data)

            if (res.data.reporte !== null) {
                setdataImagenesReporte(res.data.reporte.imagenes)
            }else{
                setdataImagenesReporte(null)
            }

            if (res.data.luminaria.imagenes.length !== 0) {
                setdataImagenesLuminaria(res.data.luminaria.imagenes)
            }else{
                setdataImagenesLuminaria(null)
            }

            llenarReporte(res.data.reporte)
            llenarLuminaria(res.data.luminaria)
            setpdlid(res.data.luminaria.pdl_id)
        })
        .catch(err => {
            setisCharging(false)
            console.log(err)
        })

        await axios.get(Url + "inversiones/"+ idInversionParam +"/actividades", {
            headers:{
                Authorization : token
            }
        })
        .then(res => {
            setdataActividades(res.data)
        })
        .catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        traerInversion(idInversion)
        setdisabled(true)
    },[idInversion])

    //Menú de botones
    const actualizarestado = (estadonuevo) => {
        const updateEstado = {
            "estado" : estadonuevo
        }

        axios.put(Url + "inversiones/" + dataInversion.id, updateEstado, {
            headers:{
                Authorization : token
            }
        })
        .then(res => {
            rechargeTable()
            openPanel(res.data.id, res.data.estado, indexTable)
            traerInversion(res.data.id)
        })
        .catch(err => {
            console.log(err)
        })
    }

    const eliminarInversion = () => {
        Swal.fire({
            title: "Está seguro de eliminar ésta Inversión?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#2ECC71",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirmar",
          }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(Url + "inversiones/" + dataInversion.id, {
                    headers:{
                        Authorization : token
                    }
                })
                .then(res => {
                    Swal.fire({
                        icon: "success",
                        title: "Eliminado con éxito",
                        timer: 1500
                    });
                    rechargeTable()
                    cerrarPanel()
                })
                .catch(err => {
                    console.log(err)
                    Swal.fire({
                        title: err.response.data.message,
                        icon: "error"
                    })
                })
            }
          });
    }

    //Métodos cambio
    const handleChangeInversion = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        
        setdataInversion(values => ({...values, [name]: value}))
    }

    const saveChanges = () => {
        delete dataInversion.luminaria
        delete dataInversion.reporte

        axios.put(Url + "inversiones/" + dataInversion.id, dataInversion, {
            headers:{
                Authorization : token
            }
        })
        .then(res => {
            rechargeTable()
            openPanel(res.data.id, res.data.estado, indexTable)
            setdisabled(true)
        })
        .catch(err => {
            console.log(err)
        })
    }

    const styleField = {
        width:"80%",
        mr: 0.6,
    };

    const styleLabel = {
        width:"23%",
        textAlign: "left",
        ml: 1,
        whiteSpace:"normal",
    };

    return (
        <div>
            <div style={{marginBottom: 5, display:"flex", justifyContent:"center", alignItems:"center"}}>

            {pdlid ? 
            <>
                {dataInversion.estado === "EN OBSERVACIÓN" &&
                    <div style={{marginLeft:5}}>
                        <IconButton sx={{border:"1px solid"}} color='success'
                        onClick={() => actualizarestado("ACEPTADO")}>
                            <ThumbUpAltOutlinedIcon color="success" fontSize='small'/>
                        </IconButton>
                        <br/>
                        <InputLabel sx={{whiteSpace:"normal", color:"#27AE60"}}>Aceptado</InputLabel>
                    </div>
                }

                {dataInversion.estado === "REGISTRADO" &&
                    <div style={{marginLeft:5, marginRight:5}}>
                        <IconButton sx={{border:"1px solid #F1C40F"}} color='warning'
                        onClick={() => actualizarestado("EN OBSERVACIÓN")}>
                            <PreviewIcon sx={{color:"#EFC314"}} fontSize='small'/>
                        </IconButton>
                        <br/>
                        <InputLabel sx={{whiteSpace:"normal", color:"#D4AC0D", ml:0.1}}>
                            Observación</InputLabel>
                    </div>
                }

                {dataInversion.estado !== "ACEPTADO" &&
                    <div style={{marginLeft:5, marginRight:5}}>
                        <IconButton sx={{border:"1px solid"}} color='secondary'
                        onClick={() => setdisabled(!disabled)}>
                            <EditNoteIcon color="secondary" fontSize='small'/>
                        </IconButton>
                        <br/>
                        <InputLabel sx={{whiteSpace:"normal", color:"#8E44AD", ml:0.3}}>Editar</InputLabel>
                    </div>
                }

                <div style={{marginLeft:5, marginRight:5}}>
                    <IconButton sx={{border:"1px solid #d32f2f"}} color='error'
                    onClick={eliminarInversion}
                    >
                        <DeleteForeverIcon sx={{color:"#d32f2f"}} fontSize='small'/>
                    </IconButton>
                    <br/>
                    <InputLabel sx={{whiteSpace:"normal", color:"#d32f2f", ml:0.5}}>Eliminar</InputLabel>
                </div>

            </>
            :
            <Skeleton animation="wave" sx={{width:350, height:60}}/>
            }
            </div>
            <Divider sx={{mb: 0.5}}/>

            {!disabled &&
                <div style={{width:"97%", textAlign:"right"}}>
                    <Button color="success" sx={{border: "1px solid", my:1}} size='small'
                    onClick={saveChanges}>
                        GUARDAR
                    </Button>
                </div>
            }


            <Box className="BoxInfoInversion">
                <LightIcon />
                <InputLabel sx={styleLabel}>PDL: </InputLabel>
                {pdlid ?
                    <TextField value={pdlid} disabled variant='standard' sx={styleField}/>
                    :
                    <Skeleton sx={{...styleField, height:30}} animation="wave"/>
                }
            </Box>

            <Box className="BoxInfoInversion">
                <CalendarMonthIcon />
                <InputLabel sx={styleLabel}>Fecha Creación: </InputLabel>
                {dataInversion.created_at ?
                    <TextField value={dataInversion.created_at} disabled variant='standard' sx={styleField}/>
                    :
                    <Skeleton sx={{...styleField, height:30}} animation="wave"/>
                }
            </Box>

            <Box className="BoxInfoInversion">
                <PriceChangeIcon />
                <InputLabel sx={styleLabel}>Tipo: </InputLabel>
                {dataInversion.created_at ?
                    <Select
                      id="select-tipo"
                      name='tipo'
                      onClose={() => {
                        setTimeout(() => {
                        document.activeElement.blur();
                        }, 0);
                    }}
                      value={dataInversion.tipo || " "}
                      onChange={handleChangeInversion}
                      sx={{...styleField, fontSize:12.5, textAlign:"left"}}
                      variant='standard'
                      disabled={disabled}
                    >
                      <MenuItem value={" "} disabled>--SELECCIONE--</MenuItem>
                      <MenuItem value={"MODERNIZACIÓN"}>MODERNIZACIÓN</MenuItem>
                      <MenuItem value={"COMPLEMENTACIÓN"}>COMPLEMENTACIÓN</MenuItem>
                      <MenuItem value={"AMPLIACIÓN"}>AMPLIACIÓN</MenuItem>
                      <MenuItem value={"REUBICACIÓN"}>REUBICACIÓN</MenuItem>
                    </Select>
                    :
                    <Skeleton sx={{...styleField, height:30}} animation="wave"/>
                }
            </Box>

            {dataActividades.length !== 0 &&
            <div style={{marginTop:10}}>
                {dataActividades.map((actividad, index) => (
                    <Box className="BoxInfoReporte" key={index} sx={{border:"solid 1px #16A085", mr:1}}>
                        <EngineeringIcon sx={{ mr:0.3, ml:1 }} />
                        <InputLabel sx={styleLabel}>Actividad: <br/> {actividad.categoria}</InputLabel>
                        <Box sx={{display:"flex", flexDirection:"column", width:"80%"}}>
                            <TextField multiline variant="standard" name="actividad" 
                            value={actividad.actividad.nombre} disabled sx={{mr:1}}/>
                            <Box>
                                {actividad.materiales.map((material, index2) =>(
                                    <div style={{display:"flex"}} key={index2}>
                                        <ConstructionIcon sx={{ marginRight: 0.6 }} />
                                        <InputLabel sx={{mr:2}}>Material: </InputLabel>
                                        <TextField variant="standard" name="material" multiline
                                            value={material.nombre} disabled sx={{width:280}}/>
                                        <br/>
                                    </div>
                                ))}
                            </Box>       
                        </Box>
                    </Box>
                ))}
            </div>
            }
            <br/>
            {dataInversion.reporte !== null ?
                <div style={{border:"1px solid #16A085"}}>
                    {dataImagenesReporte.map((imagenreporte, index) => (
                        <div key={index}>
                            <Box sx={{ display: "flex", alignItems: "center", p:0.5}}>
                                <div style={{width:"50%"}}>
                                    <label>{imagenreporte.campo.nombre}:</label>
                                </div>
                                <div style={{width:"50%"}}>
                                <a href={imagenreporte.imagen} target="_blank" rel="noreferrer" style={{ marginTop: 5 }}>
                                    <img src={imagenreporte.imagen} height={80} alt={"Fotográfico"} />
                                </a>
                                </div>
                            </Box>
                            <Divider sx={{mt:-0.5}}/>
                        </div>
                    ))}
                </div>
                :
                <>
                {dataImagenesLuminaria !== null ?
                    <div style={{border:"1px solid #16A085"}}>
                        {dataImagenesLuminaria.map((imagenluminaria, index) => (
                            <div key={index}>
                                {imagenluminaria.comentario === "Inversión antes" &&
                                    <>
                                    <Box sx={{ display: "flex", alignItems: "center", p:0.5}}>
                                        <div style={{width:"50%"}}>
                                            <label>{imagenluminaria.comentario}:</label>
                                        </div>
                                        <div style={{width:"50%"}}>
                                            <a href={imagenluminaria.imagen} target="_blank" rel="noreferrer" style={{ marginTop: 5 }}>
                                                <img src={imagenluminaria.imagen} height={80} alt={"Fotográfico"} />
                                            </a>
                                        </div>
                                    </Box>
                                    <Divider sx={{mt:-0.5}}/>
                                    </>
                                }
                                {imagenluminaria.comentario === "Inversión durante" &&
                                    <>
                                    <Box sx={{ display: "flex", alignItems: "center", p:0.5}}>
                                        <div style={{width:"50%"}}>
                                            <label>{imagenluminaria.comentario}:</label>
                                        </div>
                                        <div style={{width:"50%"}}>
                                            <a href={imagenluminaria.imagen} target="_blank" rel="noreferrer" style={{ marginTop: 5 }}>
                                                <img src={imagenluminaria.imagen} height={80} alt={"Fotográfico"} />
                                            </a>
                                        </div>
                                    </Box>
                                    <Divider sx={{mt:-0.5}}/>
                                    </>
                                }
                                {imagenluminaria.comentario === "Inversión después" &&
                                    <>
                                    <Box sx={{ display: "flex", alignItems: "center", p:0.5}}>
                                        <div style={{width:"50%"}}>
                                            <label>{imagenluminaria.comentario}:</label>
                                        </div>
                                        <div style={{width:"50%"}}>
                                            <a href={imagenluminaria.imagen} target="_blank" rel="noreferrer" style={{ marginTop: 5 }}>
                                                <img src={imagenluminaria.imagen} height={80} alt={"Fotográfico"} />
                                            </a>
                                        </div>
                                    </Box>
                                    <Divider sx={{mt:-0.5}}/>
                                    </>
                                }
                            </div>
                        ))}
                    </div>
                    :
                    "Sin Fotos"
                }
                </>
            }

            {isCharging && <LoaderIndicator/>}
        </div>
    );
}

export default Inversion;