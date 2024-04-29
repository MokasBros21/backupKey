import React, { useState, useEffect } from "react";
import axios from 'axios'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';

import BoltIcon from '@mui/icons-material/Bolt';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import MemoryIcon from '@mui/icons-material/Memory';
import NetworkPingIcon from '@mui/icons-material/NetworkPing';
import CableIcon from '@mui/icons-material/Cable';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PlusOneIcon from '@mui/icons-material/PlusOne';
import BackspaceIcon from '@mui/icons-material/Backspace';
import HighlightIcon from '@mui/icons-material/Highlight';
import LightIcon from '@mui/icons-material/Light';
import {  faRoad } from '@fortawesome/free-solid-svg-icons'
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ChromeReaderModeIcon from '@mui/icons-material/ChromeReaderMode';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { Url } from "../../constants/global";
import './Brazo.scss';
import { Checkbox, Chip, IconButton, InputAdornment } from "@mui/material";
import { Clear } from "@mui/icons-material";

const Brazo = (idLuminaria) => {

    const [dataBrazos, setdataBrazos] = useState([])
    const [active, setactive] = React.useState(false);
    const [habilitar, sethabilitar] = useState(true);
    const [totalinicial, settotalinicial] = useState(0)

    const [banderaobligatorio, setbanderaobligatorio] = useState(false)

    const MySwal = withReactContent(Swal);

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user_datos'));

    const traerBrazos = async (idLuminaria) =>{
        await axios.get(Url + 'luminarias/'+idLuminaria+'/brazos' ,{
            headers:{
                Authorization: token
                }
            })
            .then(res => {
                setdataBrazos(res.data.data)
                settotalinicial(res.data.data.length)
            })
            .catch(err => console.log(err))
    }

    const validarobligatorios = () => {
        var bandera = true

        for (let index = totalinicial; index < dataBrazos.length; index++) {
            const tecnologia_element = dataBrazos[index].tecnologia;
            const potencia_watts_element = dataBrazos[index].potencia_watts;

            if (bandera) {
                if (tecnologia_element !== "" && potencia_watts_element > 0) {
                    bandera = true
                }else{
                    bandera = false
                }          
            }

        }
        
        setbanderaobligatorio(!bandera)
        return bandera
    }

    useEffect(() =>{
        if (idLuminaria !== null) {
            traerBrazos(idLuminaria.idLuminaria)
        }
    },[])

    const enviarDatosBrazos = () => {
        if (dataBrazos.length > totalinicial) {
                if (validarobligatorios()) {
                MySwal.fire({
                    confirmButtonColor: '#28B463',
                    title: "Está seguro de crear " + (dataBrazos.length - totalinicial) + " nuevo(s) brazos?",
                    icon: "question",
                    showDenyButton: true,
                    denyButtonText: "Cancelar"
                    })
                .then((result) => {
                    if (result.isConfirmed) {
                        for (let index = totalinicial; index < dataBrazos.length; index++) {
                            axios.post(Url + 'luminarias/'+idLuminaria.idLuminaria+'/brazos', dataBrazos[index], {
                                headers:{
                                    Authorization: token
                                }
                            })
                            .then(res => {
                                traerBrazos(idLuminaria.idLuminaria)
                                setactive(false)
                                sethabilitar(true)
                            })
                            .catch(err => console.log(err))
                        }
                        settotalinicial(dataBrazos.length)
                        //Swal.fire("Se ha(n) creado correctamente", "", "success");
                        }
                    })
                } else {
                    MySwal.fire({
                        title: "Faltan datos obligatorios",
                        icon: "error"
                      });
                }
            }
        else {
            dataBrazos.map(async (brazo, index) => (
                await axios.put(Url + 'luminarias/'+brazo.luminaria+'/brazos/'+brazo.id, brazo ,{
                    headers: {
                        Authorization : token,
                    }
                  })
                .then(res =>  {
                    //console.log(res.data)
                    dataBrazos[index] = res.data
                    setactive(false)
                    sethabilitar(true)
                  })
                .catch(err => console.log(err))
            ))
        }
    }

    const ValoresBrazo = (index, event) => {
        const name = event.target.name;
        const value = name === "inversion" ? event.target.checked : event.target.value
      
        setdataBrazos(prevData => {
          const newData = [...prevData];
          newData[index] = { ...newData[index], [name] : value};
          return newData;
        });
      };

    const agregarbrazo = async () => {
        //console.log(dataBrazos)
        setactive(true);
        sethabilitar(false);

        setdataBrazos(prevState => [
            ...prevState,
            {
                "id":0,
                "estado":"REGULAR",
                "tecnologia":"",
                "potencia_watts":"0",
                "inversion":false,
            }
          ]);
        
        //console.log(dataBrazos)
    }

    const deletebrazo = async (id_Brazo, index_Brazo) => {
        if (id_Brazo !== 0) {
            Swal.fire({
                confirmButtonColor: '#28B463',
                title: "¿Está seguro de eliminar el brazo?",
                icon: "question",
                showDenyButton: true,
                denyButtonText: "Cancelar"
                })
            .then((result) => {
                if (result.isConfirmed) {
                    axios.delete(Url + 'luminarias/'+idLuminaria.idLuminaria+'/brazos/'+id_Brazo, {
                        headers:{
                            Authorization: token
                        }
                    })
                    .then(res => {
                        setdataBrazos(prevState => prevState.slice(0, -1));
                        traerBrazos(idLuminaria.idLuminaria)
                    })
                    .catch(err => console.log(err))
                    settotalinicial(dataBrazos.length)
                }
            })
        } else {
            setdataBrazos(prevState => {
                return [...prevState.slice(0, index_Brazo), ...prevState.slice(index_Brazo + 1)];
            })
        }
    }

    const LabelBrazo = {
        //fontSize: '15px',
        ml: 1,
        width: '40%',
        whiteSpace: 'normal'
    }

    const styleTextfield = {
        fontsize: 40,
        width: '60%',
    }

    return(
            <div>
                {dataBrazos.length !== 0 ?
                    <div>
                        <div style={{textAlign:"right", display:"flex", justifyContent:"space-between",
                            alignItems:"center", marginBottom:"3%", marginTop:"-4%"}}>
                            {![7,11].includes(user.rol) &&
                                <div style={{display:"flex", alignItems:"center"}}>
                                    <Typography sx={{marginTop:'1.5%'}}>Habilitar Edición:</Typography>
                                    <Switch
                                        checked={active}
                                        onChange={() => { 
                                            setactive(!active);
                                            sethabilitar(!habilitar);
                                        }}
                                        color="success"
                                    />
                                </div>
                            }
                            {!habilitar &&
                                <div style={{ textAlign: "right" }}>
                                    <Button variant="outlined" color="success"
                                    sx={{ marginTop: 1 }}
                                    onClick={enviarDatosBrazos}
                                    >
                                    {dataBrazos.length > totalinicial ?
                                        "CREAR BRAZO(S)"
                                        :
                                        "ACTUALIZAR DATOS"
                                    }
                                    </Button>
                                </div>
                            }
                            {![7,11].includes(user.rol) &&
                                <div style={{display:"flex", justifyContent:"center", flexDirection:"column"}}>
                                    <Button variant="outlined" color="primary" endIcon={<PlusOneIcon/>}
                                    onClick={agregarbrazo} sx={{ marginTop: 1 }} size="small">
                                        Agregar Brazo
                                    </Button>
                                </div>
                            }
                        </div>
                        {dataBrazos.map((Brazo, index) => (
                            <div key={index} style={{textAlign:"left"}}>
                                {/*
                                <Box className="BoxInfoBrazo">
                                    <ElectricalServicesIcon sx={{marginRight:0.5}}/>
                                    <InputLabel sx={LabelBrazo}> Longitud (cm): </InputLabel>
                                    <TextField variant="standard" name="largo"
                                        value={Brazo.largo||"0"} sx={styleTextfield}
                                        disabled={habilitar} onChange={(event) => ValoresBrazo(index, event)}
                                        //onChange={ValoresBrazo}
                                        />
                                </Box>
                                */}
                                <Box className="BoxInfoBrazo">
                                    <CableIcon sx={{marginRight:0.5}}/>
                                    <InputLabel sx={LabelBrazo}>Estado: </InputLabel>
                                    <TextField variant="standard" name="estado"
                                        value={Brazo.estado||""} sx={styleTextfield}
                                        disabled={habilitar} onChange={(event) => ValoresBrazo(index, event)}
                                        //onChange={ValoresBrazo}
                                        />
                                </Box>   
                                    {/*<Box className="BoxInfoBrazo">
                                        <CalendarMonthIcon icon={faRoad} size="xl" style={{marginRight:2}}/>
                                        <InputLabel sx={LabelBrazo}>Fecha Instalación: </InputLabel>
                                        <TextField variant="standard" name="fecha_instalacion"
                                        type="date" value={Brazo.fecha_instalacion} sx={styleTextfield}
                                        disabled={habilitar} 
                                        //onChange={ValoresBrazo}
                                        />
                                    </Box>      
                                    */}       
                                <Box className="BoxInfoBrazo">
                                    <MemoryIcon sx={{marginRight:0.5}}/>
                                    <InputLabel sx={LabelBrazo} error={banderaobligatorio}>Tecnologia Foco: </InputLabel>
                                    <TextField variant="standard" name="tecnologia"
                                        value={Brazo.tecnologia||""} sx={styleTextfield}
                                        disabled={habilitar} onChange={(event) => ValoresBrazo(index, event)}
                                        //error={index > (totalinicial-1) ? banderaobligatorio : undefined}
                                        error={banderaobligatorio}
                                        />
                                </Box>
                                <Box className="BoxInfoBrazo">
                                    <BoltIcon sx={{marginRight:0.5}}/>
                                    <InputLabel sx={LabelBrazo} error={banderaobligatorio}>Potencia Watts: </InputLabel>
                                    <TextField variant="standard" name="potencia_watts"
                                        value={Brazo.potencia_watts||""} sx={styleTextfield}
                                        disabled={habilitar} onChange={(event) => ValoresBrazo(index, event)}
                                        error={banderaobligatorio}
                                        InputProps={{
                                            //readOnly: true,
                                            endAdornment: <InputAdornment position="end">WATTS</InputAdornment>,
                                        }}
                                        />
                                </Box>
                                {/*
                                <Box className="BoxInfoBrazo">
                                    <NetworkPingIcon sx={{marginRight:0.5}}/>
                                    <InputLabel sx={LabelBrazo}>Carcasa: </InputLabel>
                                    <TextField variant="standard" name="carcasa"
                                        value={Brazo.carcasa||""} sx={styleTextfield}
                                        disabled={habilitar} onChange={(event) => ValoresBrazo(index, event)}
                                        //onChange={ValoresBrazo}
                                        />
                                </Box>
                                <Box className="BoxInfoBrazo">
                                    <HighlightIcon sx={{marginRight:0.5}}/>
                                    <InputLabel sx={LabelBrazo}>Tipo Brazo: </InputLabel>
                                    <TextField variant="standard" name="tipo"
                                        value={Brazo.tipo||""} sx={styleTextfield}
                                        disabled={habilitar} onChange={(event) => ValoresBrazo(index, event)}
                                        //onChange={ValoresBrazo}
                                        />
                                </Box>
                                <Box className="BoxInfoBrazo">
                                    <LightIcon sx={{marginRight:0.5}}/>
                                    <InputLabel sx={LabelBrazo}>Tipo Luminaria: </InputLabel>
                                    <TextField variant="standard" name="tipo_luminaria"
                                        value={Brazo.tipo_luminaria||""} sx={styleTextfield}
                                        disabled={habilitar} onChange={(event) => ValoresBrazo(index, event)}
                                        //onChange={ValoresBrazo}
                                        />
                                </Box>
                                <Box className="BoxInfoBrazo">
                                    <CalendarMonthIcon icon={faRoad} size="xl" style={{marginRight:2}}/>
                                    <InputLabel sx={LabelBrazo}>Fecha Instalación Fotocelda: </InputLabel>
                                    <TextField variant="standard" name="fecha_instalacion_fotocelda" sx={styleTextfield}
                                        type="date" value={Brazo.fecha_instalacion_fotocelda||""} 
                                        disabled={habilitar} onChange={(event) => ValoresBrazo(index, event)}
                                        //onChange={ValoresBrazo}
                                        />
                                </Box>
                                */}
                                <Box className="BoxInfoBrazo">
                                    <ChromeReaderModeIcon sx={{marginRight:0.5}}/>
                                    <InputLabel sx={LabelBrazo}>Modelo: </InputLabel>
                                    <TextField variant="standard" name="modelo" sx={styleTextfield}
                                        value={Brazo.modelo||""} 
                                        disabled={habilitar} onChange={(event) => ValoresBrazo(index, event)}
                                        //onChange={ValoresBrazo}
                                        />
                                </Box>
                                <Box className="BoxInfoBrazo">
                                    <LocalOfferIcon sx={{marginRight:0.5}}/>
                                    <InputLabel sx={LabelBrazo}>Marca: </InputLabel>
                                    <TextField variant="standard" name="marca" sx={styleTextfield}
                                        value={Brazo.marca||""} 
                                        disabled={habilitar} onChange={(event) => ValoresBrazo(index, event)}
                                        //onChange={ValoresBrazo}
                                        />
                                </Box>
                                <Divider sx={{my:1}} />
                                <Box className="BoxInfoBrazo">
                                    <CalendarMonthIcon icon={faRoad} size="xl" style={{marginRight:2}}/>
                                    <InputLabel sx={LabelBrazo}>Fecha Intervención Mantenimiento: </InputLabel>
                                    <TextField variant="standard" name="fecha_intervencion_modernzacion" sx={styleTextfield}
                                        type="date" value={Brazo.fecha_intervencion_modernzacion||""} 
                                        disabled={habilitar} onChange={(event) => ValoresBrazo(index, event)}
                                        //onChange={ValoresBrazo}
                                        />
                                </Box>
                                <Box className="BoxInfoBrazo">
                                    <CalendarMonthIcon icon={faRoad} size="xl" style={{marginRight:2}}/>
                                    <InputLabel sx={LabelBrazo}>Fecha Intervención Inversión: </InputLabel>
                                    <TextField variant="standard" name="fecha_intervencion_inversion" sx={styleTextfield}
                                        type="date" value={Brazo.fecha_intervencion_inversion||""} 
                                        disabled={habilitar} onChange={(event) => ValoresBrazo(index, event)}
                                        //onChange={ValoresBrazo}
                                        />
                                </Box>
                                {Brazo.id === 0 &&
                                    <>
                                    <Box className="BoxInfoBrazo" sx={{ml:-2}}>
                                        <Checkbox
                                                name="inversion"
                                                sx={{ml:1, mr:-1}}
                                                icon={<RequestQuoteOutlinedIcon />}
                                                checkedIcon={<RequestQuoteIcon />}
                                                checked={Brazo.inversion}
                                                onChange={(event) => ValoresBrazo(index, event)}
                                                disabled={habilitar} />
                                        <InputLabel sx={LabelBrazo}>Inversión </InputLabel>
                                    </Box>
                                    </>
                                }
                                <div style={{display:"flex", alignItems:"center", marginTop:5}}>
                                    <IconButton size='small' color='error' onClick={() => deletebrazo(Brazo.id, index)}
                                    sx={{border:"1px solid", mr:0.5}}>
                                        <Clear color='error' fontSize='small'/>
                                    </IconButton>
                                    <label>Eliminar Brazo</label>
                                </div>
                                <Divider sx={{ my: 1.5}} />
                            </div>
                        ))}
                    </div>
                    :
                    <>
                    <div style={{ display: "flex", justifyContent: "right", marginBottom:10}}>
                        <Button variant="outlined" color="primary" endIcon={<PlusOneIcon />}
                            onClick={agregarbrazo} size="small">
                            Agregar Brazo
                        </Button>
                    </div>
                    
                    <p>Sin Registro de Brazos</p>
                    </>
                }
            </div>
    );
}
export default Brazo;