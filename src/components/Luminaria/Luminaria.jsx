import React, { useEffect, useState } from "react";
import axios from 'axios'

//Iconos de la sección Información
import HeightIcon from '@mui/icons-material/Height';
import VillaIcon from '@mui/icons-material/Villa';
import InputAdornment from '@mui/material/InputAdornment';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import BuildIcon from '@mui/icons-material/Build';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CableIcon from '@mui/icons-material/Cable';
import Checkbox from '@mui/material/Checkbox';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import AlignVerticalBottomIcon from '@mui/icons-material/AlignVerticalBottom';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import VerifiedIcon from '@mui/icons-material/Verified';

//Nuevo Checks
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import HomeRepairServiceOutlinedIcon from '@mui/icons-material/HomeRepairServiceOutlined';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';
import FormatPaintOutlinedIcon from '@mui/icons-material/FormatPaintOutlined';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import AddLocationOutlinedIcon from '@mui/icons-material/AddLocationOutlined';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';

//Iconos del brazo
import BoltIcon from '@mui/icons-material/Bolt';
import MemoryIcon from '@mui/icons-material/Memory';

//Material UI
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from "@mui/material/IconButton";
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { Chip, Skeleton } from "@mui/material";
import Switch from '@mui/material/Switch';
import InputLabel from '@mui/material/InputLabel';
import { green, red } from "@mui/material/colors";

//Icono acciones
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddBoxIcon from '@mui/icons-material/AddBox';

//SweetAlert
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

//FontAwesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faRoad } from '@fortawesome/free-solid-svg-icons'

//Componentes internos
import './Luminaria.scss';
import { Url } from "../../constants/global";
import ModalNewReporte from "../Modals/ModalNewReport";
import classNames from "classnames";
import LoaderIndicator from "../../layout/LoaderIndicator/LoaderIndicator";

const Luminaria = ({dataLuminariaPanel, showAñadirReporte, showEditar, closePanel, 
    borrarMarkers, accion, cerrarModalNuevaLum, reloadInfoPanel}) => {
    
    //Constantes
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user_datos'));
    const condiciones = [
        {"condicion": "BUENO"},
        {"condicion": "REGULAR"},
        {"condicion": "MALO"}
    ]   
    const MySwal = withReactContent(Swal);

    const [showModalCrear, setshowModalCrear] = useState(false)

    //Para los datos de la luminaria
    //Selects
    const [calles, setcalles] = useState([])
    const [colonias, setcolonias] = useState([])
    const [comunidades, setcomunidades] = useState([])
    const [sub_electricas, setsub_electricas] = useState([])
    const [sectores2, setsectores] = useState([])
    const [tipoposte, settipoposte] = useState([])

    //Arrreglo de datos
    const [dataLuminaria, setdataLuminaria] = useState([])
    const [dataBrazoNuevo, setdataBrazoNuevo] = useState(
                                                {"potencia_watts":null,
                                                 "tecnologia":null}
                                                )
    const [datareportespdl, setdatareportespdl] = useState([])

    //checkEtiquetadoBoxs
    const [checkEtiquetado, setcheckEtiquetado] = useState(null);
    const [checkUrbanizado, setcheckUrbanizado] = useState(null);
    const [checkInversion, setcheckInversion] = useState(null);

    //Para valores true/false
    const [estadoSwitch, setestadoSwitch] = React.useState(false);
    const [deshabilitar, setdeshabilitar] = useState(true);
    const [isCharging, setisCharging ] = useState(false);
    const [chargingSelects, setchargingSelects] = useState(false)
    const [banderaobligatorio, setbanderaobligatorio] = useState(false)

    const [banderacalle, setbanderacalle] = useState(false)
    const [banderacolonia, setbanderacolonia] = useState(false)
    const [banderasubelectrica, setbanderasubelectrica] = useState(false)

    //Precarga
    const traerSelects = async (latitud, longitud) => {
        
        setisCharging(true)
        setchargingSelects(true)

        await axios.get(Url + "luminarias/catalogo?atributo=tipo_poste",{
            headers:{
                Authorization : token
            }
        })
        .then(res => {
            settipoposte(res.data)
        })
        .catch(err => {
            console.log(err)
        })

        await axios.get(Url + 'luminarias/catalogo?latitud='+latitud+'&longitud='+longitud+'&atributo=calle&radio=2000', {
            headers: {
                    Authorization : token,
                }
            })
          .then(res =>  {
                setcalles(res.data)
            })
          .catch(err => console.log(err))

        await axios.get(Url + 'luminarias/catalogo?latitud='+latitud+'&longitud='+longitud+'&atributo=colonia&radio=2000', {
            headers: {
                    Authorization : token,
                }
            })
          .then(res =>  {
                setcolonias(res.data)
            })
          .catch(err => console.log(err))

        await axios.get(Url + 'luminarias/catalogo?latitud='+latitud+'&longitud='+longitud+'&atributo=comunidad&radio=2000', {
            headers: {
                    Authorization : token,
                }
            })
          .then(res =>  {
                setcomunidades(res.data)
            })
          .catch(err => console.log(err))

        await axios.get(Url + 'luminarias/catalogo?latitud='+latitud+'&longitud='+longitud+'&atributo=subestacion_electrica&radio=2000', {
            headers: {
                    Authorization : token,
                }
            })
          .then(res =>  {
                setsub_electricas(res.data)
            })
          .catch(err => console.log(err))

        await axios.get(Url + 'luminarias/catalogo?latitud='+latitud+'&longitud='+longitud+'&atributo=sector&radio=2000', {
            headers: {
                    Authorization : token,
                }
            })
          .then(res =>  {
                setsectores(res.data)

                if(accion === "crear" && res.data.length !== 0) {
                    //var bandera = false
                    let index = 0

                    /*while (!bandera) {
                        if (res.data[index].sector !== null) {
                            bandera = true
                        }
                        index = index + 1
                    }
                    
                    if(res.data[index] === undefined){
                        index = index - 1
                    }*/
                    
                    setdataLuminaria(values => ({...values, ['sector']: res.data[index].sector}))
                }else if (accion === "crear" && res.data.length === 0){
                    setdataLuminaria(values => ({...values, ['sector']: "SIN SECTOR"}))
                }
            })
          .catch(err => console.log(err))

          setisCharging(false)
          setchargingSelects(false)
          
          if(accion === "crear") {
            onChangeSwitch()
          }
    }

    const traerdatos = async (datosSet) => {
        setdataLuminaria(datosSet)
        traerSelects(datosSet.latitud, datosSet.longitud)
        setcheckEtiquetado(datosSet.etiquetado)
        setcheckUrbanizado(datosSet.urbanizado)
        setcheckInversion(datosSet.inversion)
    }

    useEffect(() => {
        if (dataLuminariaPanel !== null) {
            if (dataLuminaria.id !== dataLuminariaPanel.id) {
                delete dataLuminariaPanel.imagenes
                traerdatos(dataLuminariaPanel)
                if(dataLuminariaPanel.reportes !== undefined){
                    setdatareportespdl(dataLuminariaPanel.reportes)
                }
                setestadoSwitch(false)
                setdeshabilitar(true)
            }
        }
    },[dataLuminariaPanel])

    //Actualización de campos en el State
    const handleChangeT = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        if (name === "calle" && value === "OTRO") {
            setbanderacalle(true)
        }

        if (name === "colonia" && value === "OTRO") {
            setbanderacolonia(true)
        }

        if (name === "subestacion_electrica" && value === "OTRO") {
            setbanderasubelectrica(true)
        }
        
        setdataLuminaria(values => ({...values, [name]: value}))
      }

    const handleChangeBrazo = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        
        setdataBrazoNuevo(values => ({...values, [name]: value}))
    }

    const handleChangeSector = (event) => {
        setdataLuminaria(values => ({...values, ['sector']: event.target.value}))
    }

    //Actualización de CheckBox en el State
    const onChangeC = (event) => {
        const tipocheckEtiquetado = (event.target.name)
        switch (tipocheckEtiquetado) {
            case "etiquetado":
                setcheckEtiquetado(!checkEtiquetado)
                setdataLuminaria(values => ({...values, ['etiquetado']: !checkEtiquetado})) 
                break;
            case "urbanizado":
                setcheckUrbanizado(!checkUrbanizado)
                setdataLuminaria(values => ({...values, ['urbanizado']: !checkUrbanizado})) 
                break;
            case "verificado":
                setdataLuminaria(values => ({...values, ['verificado']: 
                    dataLuminaria.verificado === "1" ? "0" : "1"}))
                break;
            case "inversion":
                setcheckInversion(!checkInversion)
                setdataLuminaria(values => ({...values, ['inversion']: !checkInversion})) 
                break;
            default:
                break;
        }
        
    }

    const newhandleCheck = (event) => {
        const nameCheck = event.target.name;
        const value = event.target.checked ? "1" : "0";
        
        setdataLuminaria(values => ({...values, [nameCheck]: value}))
    }

    //(Des)Habiliar Edición
    const onChangeSwitch = () => {
        if (accion === "crear") {
            setdataLuminaria(values => ({...values, ["proyecto"]: "1"}))
            setdataLuminaria(values => ({...values, ['etiquetado']: false})) 
            setdataLuminaria(values => ({...values, ['urbanizado']: false}))
            setdataLuminaria(values => ({...values, ['inversion']: false}))
            setdataLuminaria(values => ({...values, ['fecha_censo']: formatDate(new Date())}))
            setdataLuminaria(values => ({...values, ['fecha_instalacion']: formatDate(new Date())}))
            setdataLuminaria(values => ({...values, ['ultima_intervencion']: formatDate(new Date())}))

            if (user.rol === 3 || user.rol === 4) {
                setdataLuminaria(values => ({...values, ['verificado']: "1"}))
            }
        }

        if(accion === "actualizar" && estadoSwitch){
            setdataLuminaria(dataLuminariaPanel)
        }
        setbanderacalle(false)
        setbanderacolonia(false)
        setbanderasubelectrica(false)
        setestadoSwitch(!estadoSwitch);
        setdeshabilitar(!deshabilitar);
    } 

    //Update a BD
    const enviarDatos = () => {
        delete dataLuminaria.brazos
        delete dataLuminaria.reportes

        /*var finaldataLuminaria = dataLuminaria

        if (dataLuminariaPanel.verificado !== dataLuminaria.verificado) {
            finaldataLuminaria = {"verificado" : dataLuminaria.verificado}
        }

        console.log(finaldataLuminaria)*/

        //console.log(dataLuminaria)
        axios.put(Url + 'luminarias/'+dataLuminaria.id, dataLuminaria ,{
            headers: {
                Authorization : token,
            }
          })

        .then(res =>  {
            reloadInfoPanel(res.data)
            setdeshabilitar(!deshabilitar)
            setestadoSwitch(!estadoSwitch)
            setbanderacalle(false)
            setbanderacolonia(false)
            setbanderasubelectrica(false)
          })
        .catch(err => console.log(err))
    }

    //Create
    const crearLuminaria = async () => {
        if (accion === "crear" && obligatorios() === true) {
            MySwal.fire({
                icon: "error",
                title: "Vaya! Parece que te faltan campos obligatorios",
            })
            setbanderaobligatorio(true)
        }
        else{
            setbanderaobligatorio(false)

                //console.log(dataLuminaria)
                await axios.post(Url + 'luminarias', dataLuminaria, {
                    headers: {
                        Authorization: token,
                    }
                })
                .then(res => {
                    if (res.data.id !== null) {
                        
                        axios.post(Url + 'luminarias/'+res.data.id+'/brazos', dataBrazoNuevo, {
                            headers: {
                                Authorization: token,
                            }
                        })
                        .then(res => {
                                cerrarModalNuevaLum()

                                MySwal.fire({
                                    icon: "success",
                                    title: "Luminaria creada correctamente",
                                    showConfirmButton: false,
                                    timer: 2000
                                })
                        })
                        .catch(err => console.log(err))
                    }
                })
                .catch(err => {
                    Swal.fire({
                        title:err.response.data.message,
                        icon: "error",
                    })
                    console.log(err)
                })
            }
    }

    //Delete
    const DeleteLuminaria = (LuminariaEliminar, idLuminariaEliminar) => {
        MySwal.fire({
            title: <strong>Confirmación</strong>,
            confirmButtonColor: '#28B463',
            showDenyButton: true,
            showConfirmButton: true,
            reverseButtons: true,
            denyButtonText: 'CANCELAR',
            confirmButtonText: 'CONFIRMAR',
            html: <p>Estás seguro de eliminar el PDL: {LuminariaEliminar}?</p>,
            icon: 'question'
        })
        .then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                axios.delete(Url + 'luminarias/'+idLuminariaEliminar, {
                headers: {
                    Authorization : token,
                }
                })
                .then(res =>  {
                    MySwal.fire({
                        icon: 'success',
                        title: 'Realizado',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    closePanel()
                    borrarMarkers()
                    //cargareportes();
                })
                .catch(err => console.log(err))
            };
        })}

    //Extras
    const cerrarModalHijo = () => {
        setshowModalCrear(false)
    }

    const obligatorios = () => {
        if (dataLuminaria.pdl_id === undefined || dataLuminaria.pdl_id === "" || 
        dataLuminaria.latitud === undefined || dataLuminaria.latitud === "" ||
        dataLuminaria.longitud === undefined || dataLuminaria.longitud === "" ||
        dataLuminaria.sector === undefined || dataLuminaria.sector === "" ||
        dataBrazoNuevo.potencia_watts === "" || dataBrazoNuevo.tecnologia === "" ||
        dataBrazoNuevo.potencia_watts === null || dataBrazoNuevo.tecnologia === null) {
            return true
        }
        else{
            return false
        }
    }
    
    const styleLabel = {
        width: '28%',
        whiteSpace: 'normal'
    }

    const styleTextfield = {
        fontsize: 40,
        width: '72%',
    }

    const cambiar = (estatus) => {
        let nuevo = estatus

        if (estatus === "CREADO") {
            nuevo = "NUEVO"
        }else{
            nuevo = estatus
        }

        return nuevo
    }

    const stylerow = (estatus) => {
        switch (estatus) {
            case "CREADO":
                const styleCellRowCreado = {
                    color: 'white',
                    backgroundColor: "#2B88EB",
                }

                return styleCellRowCreado;
        
            case "ASIGNADO":
                const styleCellRowAsignado = {
                    color: 'white',
                    backgroundColor: "#D35400",
                }
                return styleCellRowAsignado;

            case "EN PROCESO":
                const styleCellRowProceso = {
                    color: 'black',
                    backgroundColor: "#F4D03F ",
                }
                return styleCellRowProceso;
        
            case "INCOMPLETO":
                const styleCellRowIncompleto = {
                    color: 'white',
                    backgroundColor: "#8E44AD",
                }
                return styleCellRowIncompleto;
    
            case "TERMINADO":
                const styleCellRowTerminado = {
                    color: 'white',
                    backgroundColor: "#28B463",
                }
                return styleCellRowTerminado;

            case "RECHAZADO":
                const styleCellRowRechazado = {
                    color: 'black',
                }
                return styleCellRowRechazado;

            default:
                const styleCellRowN = {
                    color: 'black',
                    textAlign: 'center'
                }
                return styleCellRowN;
        }
    }

    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }

    function formatDate(date) {
        return [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
        ].join('-');
    }

    return (         
            <>
            {(showAñadirReporte && ![7].includes(user.rol)) ?
            <div style={{display:"flex", alignItems:"flex-start", justifyContent:"center", marginTop:-5}}>
                <div style={{marginRight:'2%'}}>
                    <Box sx={{ height: 36, width: 36, color: 'success.main', border: 1, borderRadius: '50%',
                            ml:0.5}}>
                            <IconButton color="success"
                            onClick={() => setshowModalCrear(true)}
                            >
                            <AddBoxIcon fontSize="small" />
                        </IconButton>
                    </Box>
                    <p style={{ color: green[800], fontSize: '13px' }}>Agregar <br/> Reporte</p>
                </div>

                        
                {user.rol !== 11 &&
                    <div style={{ marginRight: '2%' }}>
                        <Box sx={{ height: 36, width: 36, color: 'error.main', border: 1, borderRadius: '50%', ml: '10%' }}>
                            <IconButton color="error" onClick={() => DeleteLuminaria(dataLuminaria.pdl_id, dataLuminaria.id)}>
                                <DeleteForeverIcon fontSize="small" />
                            </IconButton>
                        </Box><p style={{ color: red[900], fontSize: '13px' }}>Eliminar</p>
                    </div>
                }
            </div>
            :
            <div style={{marginBottom:-10}}></div>
            }

            {accion === "crear" &&
            <div style={{display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column", marginBottom:10}}>
                <div style={{justifyContent:"right", display:"flex", width:"100%", marginRight:-20}}>
                        <button className={classNames("mini circular ui button")} onClick={cerrarModalNuevaLum}
                            style={{width: 40, backgroundColor: "transparent"}}>
                        <span>X</span> 
                        </button>
                </div>
                <Divider sx={{width:"100%", mb:-2}}/>
                <h3>Crear Luminaria</h3>  
            </div>
            }
            <Divider/>
            {(showEditar && ![7, 11].includes(user.rol)) &&
            <div style={{ textAlign: "right", display: "flex", flexDirection: "row-reverse" }}>
                <Switch
                checked={estadoSwitch}
                onChange={onChangeSwitch}
                disabled={accion === "crear" && isCharging}
                color="success" />
                <Typography sx={{ marginTop: '1.5%' }}>Habilitar Edición:</Typography>
            </div>
            }
            <div style={{ textAlign: "left" }}>
                <Box className="BoxInfoLuminaria">
                    <EmojiObjectsIcon fontSize="small" sx={{ marginRight: 1.3, marginBottom: 0.3 }} />
                    <InputLabel sx={styleLabel} style={banderaobligatorio ? {color:"red"} : {color:"black"}} >PDL: </InputLabel>
                    <TextField sx={styleTextfield}variant="standard" name="pdl_id" value={dataLuminaria.pdl_id||""} 
                    disabled={deshabilitar} onChange={handleChangeT} error={banderaobligatorio}/>
                </Box>

                <Box className="BoxInfoLuminaria">
                    <AlignHorizontalLeftIcon fontSize="small" sx={{ marginRight: 1.3 }} />
                    <InputLabel sx={styleLabel} style={banderaobligatorio ? {color:"red"} : {color:"black"}}>Latitud: </InputLabel>
                    <TextField sx={styleTextfield}variant="standard" name="latitud" value={dataLuminaria.latitud||""} disabled={deshabilitar}
                        onChange={handleChangeT} error={banderaobligatorio}/>
                </Box>
                <Box className="BoxInfoLuminaria">
                    <AlignVerticalBottomIcon fontSize="small" sx={{ marginRight: 1.3 }} />
                    <InputLabel sx={styleLabel} style={banderaobligatorio ? {color:"red"} : {color:"black"}}>Longitud: </InputLabel>
                    <TextField sx={styleTextfield}variant="standard" name="longitud" value={dataLuminaria.longitud||""} disabled={deshabilitar}
                        onChange={handleChangeT} error={banderaobligatorio}/>
                </Box>

                <Box className="BoxInfoLuminaria">
                    <HeightIcon sx={{ marginRight: 1 }} />
                    <InputLabel sx={styleLabel} >Altura:</InputLabel>
                    <TextField sx={styleTextfield}variant="standard" name="altura" value={dataLuminaria.altura||"0"} disabled={deshabilitar}
                        onChange={handleChangeT}
                        InputProps={{
                            //readOnly: true,
                            endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                        }} />
                </Box>
                
                <Box className="BoxInfoLuminaria">
                    <BuildIcon fontSize="small" sx={{ marginRight: 1.3 }} />
                    <InputLabel sx={styleLabel} >Tipo Poste: </InputLabel>
                    {deshabilitar ?
                    <TextField sx={styleTextfield}variant="standard" name="tipo_poste" value={dataLuminaria.tipo_poste||""} disabled={deshabilitar}
                        onChange={handleChangeT} />
                    :
                    <>
                    {chargingSelects ? 
                        <Skeleton animation="wave" height={35} width={400} />
                        :
                        <FormControl size="small" sx={{...styleTextfield, mt:0.5}} disabled={false}>
                            <Select
                                onClose={() => {
                                    setTimeout(() => {
                                    document.activeElement.blur();
                                    }, 0);
                                }}
                                id="tipo_poste"
                                value={tipoposte.includes(dataLuminaria.tipo_poste) ? dataLuminaria.tipo_poste : " "}
                                onChange={handleChangeT}
                                name="tipo_poste"
                                variant="standard"
                                MenuProps={{sx:{maxHeight:"200px"}}}
                            >
                                <MenuItem value={" "} style={{fontSize:"small"}}>
                                    -SELECCIONE-
                                </MenuItem>
                                {tipoposte.map((poste, index) => (
                                    <MenuItem key={index} value={poste} style={{fontSize:"small"}}>
                                        {poste}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    }
                    </>
                    }
                </Box>

                <Box className="BoxInfoLuminaria">
                    <TroubleshootIcon sx={{ marginRight: 1 }} />
                    <InputLabel sx={styleLabel}>Condición: </InputLabel>
                    <FormControl size="small" 
                                sx={{...styleTextfield, mt:0.5}} disabled={deshabilitar}>
                                <Select
                                    onClose={() => {
                                        setTimeout(() => {
                                        document.activeElement.blur();
                                        }, 0);
                                    }}
                                    id="select-condicion"
                                    value={dataLuminaria.condicion||''}
                                    onChange={handleChangeT}
                                    name="condicion"
                                    variant="standard"
                                    >
                                    {condiciones.map((condicion, index) => (
                                        <MenuItem key={index} value={condicion.condicion} style={{fontSize:"small"}}>
                                            {condicion.condicion}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                </Box>
                {/*
                <Box className="BoxInfoLuminaria">
                    <CableIcon sx={{ marginRight: 1 }} />
                    <InputLabel sx={styleLabel} >Cable Eléctrico: </InputLabel>
                    <TextField sx={styleTextfield}variant="standard" name="tipo_cable_electrico" value={dataLuminaria.tipo_cable_electrico||""} disabled={deshabilitar}
                        onChange={handleChangeT} />
                </Box>
                <Box className="BoxInfoLuminaria">
                    <BusinessCenterIcon sx={{ marginRight: 1 }} />
                    <InputLabel sx={styleLabel} >Instalación Eléctrica: </InputLabel>
                    <TextField sx={styleTextfield}variant="standard" name="tipo_instalacion_electrica" value={dataLuminaria.tipo_instalacion_electrica||""} disabled={deshabilitar}
                        onChange={handleChangeT} />
                </Box>
                */}
                <Box className="BoxInfoLuminaria">
                    <FontAwesomeIcon icon={faRoad} size="xl" style={{ marginRight: 9 }} />
                    <InputLabel sx={styleLabel} >Calle: </InputLabel>
                    {(deshabilitar || banderacalle) ?
                        <TextField sx={styleTextfield} variant="standard" name="calle"
                        value={dataLuminaria.calle} disabled={deshabilitar} onChange={handleChangeT}/>
                    :
                    <>
                    {chargingSelects ? 
                        <Skeleton animation="wave" height={35} width={400} />
                        :
                        <FormControl size="small" sx={{...styleTextfield, mt:0.5}} disabled={deshabilitar}>
                            <Select
                                onClose={() => {
                                    setTimeout(() => {
                                    document.activeElement.blur();
                                    }, 0);
                                }}
                                id="select-condicion"
                                value={calles.some(calle => calle.calle === dataLuminaria.calle) ? dataLuminaria.calle : ''}
                                onChange={handleChangeT}
                                name="calle"
                                variant="standard"
                            >
                                {calles.map((calle, index) => (
                                    <MenuItem key={index} value={calle.calle} style={{fontSize:"small"}}>
                                        {calle.calle}
                                    </MenuItem>
                                ))}
                                <MenuItem value="OTRO" style={{fontSize:"small"}}>
                                    OTRO
                                </MenuItem>
                            </Select>
                        </FormControl>
                    }
                    </>
                    }

                </Box>
                <Box className="BoxInfoLuminaria">
                    <VillaIcon sx={{ marginRight: 1 }} />
                    <InputLabel sx={styleLabel} >Colonia: </InputLabel>
                    {(deshabilitar || banderacolonia) ?
                        <TextField sx={styleTextfield}variant="standard" name="colonia" 
                        value={dataLuminaria.colonia} disabled={deshabilitar} onChange={handleChangeT}/>
                        :
                        <>
                        {chargingSelects ? 
                            <Skeleton animation="wave" height={35} width={400} />
                            :
                            <FormControl size="small" sx={{...styleTextfield, mt:0.5}} disabled={deshabilitar}>
                                <Select
                                    onClose={() => {
                                        setTimeout(() => {
                                        document.activeElement.blur();
                                        }, 0);
                                    }}
                                    id="select-condicion"
                                    value={colonias.some(colonia => colonia.colonia === dataLuminaria.colonia) ? dataLuminaria.colonia : ''}
                                    onChange={handleChangeT}
                                    name="colonia"
                                    variant="standard"
                                >
                                    {colonias.map((colonia, index) => (
                                        <MenuItem key={index} value={colonia.colonia} style={{fontSize:"small"}}>
                                            {colonia.colonia}
                                        </MenuItem>
                                    ))}                               
                                    <MenuItem value="OTRO" style={{fontSize:"small"}}>
                                        OTRO
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        }
                        </>
                    }

                </Box>
                <Box className="BoxInfoLuminaria">
                    <Diversity3Icon sx={{ marginRight: 1 }} />
                    <InputLabel sx={styleLabel} >Comunidad: </InputLabel>
                    {deshabilitar ?
                        <TextField sx={styleTextfield}variant="standard" name="comunidad" 
                        value={dataLuminaria.comunidad||""} disabled/>
                        :
                        <>
                        {chargingSelects ? 
                            <Skeleton animation="wave" height={35} width={400} />
                            :
                            <FormControl size="small" sx={{...styleTextfield, mt:0.5}} disabled={false}>
                                <Select
                                    onClose={() => {
                                        setTimeout(() => {
                                        document.activeElement.blur();
                                        }, 0);
                                    }}
                                    id="select-comunidad"
                                    value={comunidades.some(comunidad => comunidad.comunidad === dataLuminaria.comunidad) ? dataLuminaria.comunidad : ''}
                                    onChange={handleChangeT}
                                    name="comunidad"
                                    variant="standard"
                                >
                                    {comunidades.map((comunidad, index) => (
                                        <MenuItem key={index} value={comunidad.comunidad} style={{fontSize:"small"}}>
                                            {comunidad.comunidad}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        }
                        </>
                    }
                </Box>
                <Box className="BoxInfoLuminaria">
                    <LocationCityIcon sx={{ marginRight: 1 }} />
                    <InputLabel sx={styleLabel} style={banderaobligatorio ? {color:"red"} : {color:"black"}}>Sector: </InputLabel>

                    {deshabilitar ?
                        <TextField sx={styleTextfield}variant="standard" name="sector" 
                        value={dataLuminaria.sector||""} disabled={deshabilitar} onChange={handleChangeT}/>
                        :
                        <>
                        {chargingSelects ? 
                            <Skeleton animation="wave" height={35} width={400} />
                            :
                            <FormControl size="small" 
                                    sx={{...styleTextfield, mt:0.5}} disabled={deshabilitar}>
                                    <Select
                                        onClose={() => {
                                            setTimeout(() => {
                                            document.activeElement.blur();
                                            }, 0);
                                        }}
                                        id="select-sector"
                                        name="sector"
                                        value={sectores2.some(sector => sector.sector === dataLuminaria.sector) ? dataLuminaria.sector : 'SIN SECTOR'}
                                        onChange={handleChangeT}
                                        variant="standard"
                                        error={banderaobligatorio}
                                        >
                                        {sectores2.length===0 && <MenuItem value={"SIN SECTOR"}>SIN SECTOR</MenuItem>}
                                        {sectores2.map((sector, index) => (
                                            <MenuItem key={index} value={sector.sector} style={{fontSize:"small"}}>
                                                {sector.sector}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                        }
                        </>
                    }
                </Box>
                <Box className="BoxInfoLuminaria">
                    <OfflineBoltIcon sx={{ marginRight: 1 }} />
                    <InputLabel sx={styleLabel} >Subestación Eléctrica: </InputLabel>
                    {(deshabilitar || banderasubelectrica) ?
                        <TextField sx={styleTextfield}variant="standard" name="subestacion_electrica" 
                        value={dataLuminaria.subestacion_electrica||""} disabled={deshabilitar} 
                        onChange={handleChangeT}/>
                        :
                        <>
                        {chargingSelects ? 
                            <Skeleton animation="wave" height={35} width={400} />
                            :
                            <FormControl size="small" sx={{...styleTextfield, mt:0.5}} disabled={false}>
                                <Select
                                    onClose={() => {
                                        setTimeout(() => {
                                        document.activeElement.blur();
                                        }, 0);
                                    }}
                                    id="select-subest_electrica"
                                    value={sub_electricas.some(subest_electrica => subest_electrica.subestacion_electrica === dataLuminaria.subestacion_electrica) ? dataLuminaria.subestacion_electrica : ''}
                                    onChange={handleChangeT}
                                    name="subestacion_electrica"
                                    variant="standard"
                                >
                                    {sub_electricas.map((subestacion_electrica, index) => (
                                        <MenuItem key={index} value={subestacion_electrica.subestacion_electrica} style={{fontSize:"small"}}>
                                            {subestacion_electrica.subestacion_electrica}
                                        </MenuItem>
                                    ))}                   
                                    <MenuItem value="OTRO" style={{fontSize:"small"}}>
                                        OTRO
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        }
                        </>
                    }
                </Box>
                <Box className="BoxInfoLuminaria">
                    <AccessTimeIcon sx={{mr:1}} />
                    <InputLabel sx={styleLabel} >Tiempo de Atención:</InputLabel>
                    <Select
                        onClose={() => {
                            setTimeout(() => {
                            document.activeElement.blur();
                            }, 0);
                        }}
                        id="select-sla_atencion"
                        value={dataLuminaria.sla_atencion || "72"}
                        onChange={handleChangeT}
                        name="sla_atencion"
                        variant="standard"
                        sx={{...styleTextfield, mt:0.5}} 
                        disabled={deshabilitar}
                    >
                        <MenuItem value={"12"}>12 hrs</MenuItem>
                        <MenuItem value={"24"}>24 hrs</MenuItem>
                        <MenuItem value={"48"}>48 hrs</MenuItem>
                        <MenuItem value={"72"}>72 hrs</MenuItem>
                    </Select>
                </Box>
                <Box className="BoxInfoLuminaria">
                    <CalendarMonthIcon sx={{ marginRight: 1 }} />
                    <InputLabel sx={styleLabel} >Fecha Instalación: </InputLabel>
                    <TextField
                        sx={styleTextfield}
                        variant="standard"
                        name="fecha_instalacion"
                        InputLabelProps={{ shrink: true, required: true }}
                        type="date"
                        value={dataLuminaria.fecha_instalacion||""}
                        onChange={handleChangeT}
                        disabled={deshabilitar} />
                </Box>
                {/*
                <Box className="BoxInfoLuminaria">
                    <CalendarMonthIcon sx={{ marginRight: 1 }} />
                    <InputLabel sx={styleLabel} >Fecha Censo: </InputLabel>
                    <TextField
                        sx={styleTextfield}
                        variant="standard"
                        name="fecha_censo"
                        InputLabelProps={{ shrink: true, required: true }}
                        type="date"
                        value={dataLuminaria.fecha_censo||""}
                        onChange={handleChangeT}
                        disabled={deshabilitar} />
                </Box>
                */}
                <Box className="BoxInfoLuminaria">
                    <CalendarMonthIcon sx={{ marginRight: 1 }} />
                    <InputLabel sx={styleLabel} >Última Intervención: </InputLabel>
                    <TextField
                        sx={styleTextfield}
                        variant="standard"
                        name="ultima_intervencion"
                        InputLabelProps={{ shrink: true, required: true }}
                        type="date"
                        value={dataLuminaria.ultima_intervencion||""}
                        onChange={handleChangeT}
                        disabled={deshabilitar} />
                </Box>
            </div>

            <Divider style={{ marginBottom: 6, marginTop: 10 }} />
            <Box sx={{ display: 'flex', alignItems: 'flex-start', marginTop: 1 }}>
                <InputLabel sx={{ marginTop: 1 }}>Etiquetado: </InputLabel>
                <Checkbox
                    name="etiquetado"
                    icon={<BookmarkBorderIcon />}
                    checkedIcon={<BookmarkIcon />}
                    checked={checkEtiquetado||false}
                    onChange={onChangeC}
                    disabled={deshabilitar} />

                <InputLabel sx={{ marginLeft: 4, marginTop: 1 }}>Urbanizado: </InputLabel>
                <Checkbox
                    name="urbanizado"
                    icon={<HomeWorkOutlinedIcon />}
                    checkedIcon={<HomeWorkIcon />}
                    checked={checkUrbanizado||false}
                    onChange={onChangeC}
                    disabled={deshabilitar} />

                <InputLabel sx={{ marginLeft: 4, marginTop: 1 }}>Verificado: </InputLabel>
                <Checkbox
                    name="verificado"
                    icon={<VerifiedOutlinedIcon />}
                    checkedIcon={<VerifiedIcon />}
                    checked={dataLuminaria.verificado==="1" ? true : false}
                    onChange={onChangeC}
                    disabled={deshabilitar} />

                {accion === "crear" &&
                    <>
                    <InputLabel sx={{ marginLeft: 4, marginTop: 1 }}>Inversion: </InputLabel>
                    <Checkbox
                        name="inversion"
                        icon={<RequestQuoteOutlinedIcon />}
                        checkedIcon={<RequestQuoteIcon />}
                        checked={checkInversion||false}
                        onChange={onChangeC}
                        disabled={deshabilitar} />
                    </>
                }
            </Box>

            <Divider style={{ marginBottom: 6, marginTop: 10 }} />
            <Box sx={{ display: 'flex', alignItems: 'flex-start', marginTop: 1, flexWrap:"wrap" }}>
                <div className="MiniBoxCheck">
                    <InputLabel sx={{ mr:-1 }}>Kit AMC: </InputLabel>
                    <Checkbox
                        name="es_kitamc"
                        icon={<HomeRepairServiceOutlinedIcon />}
                        checkedIcon={<HomeRepairServiceIcon />}
                        checked={dataLuminaria.es_kitamc === "1" ? true : false}
                        onChange={newhandleCheck}
                        disabled={deshabilitar} />
                </div>

                <div className="MiniBoxCheck">
                    <InputLabel sx={{ mr:-1 }}>Modernización: </InputLabel>
                    <Checkbox
                        name="es_modernizacion"
                        icon={<PrecisionManufacturingOutlinedIcon />}
                        checkedIcon={<PrecisionManufacturingIcon />}
                        checked={dataLuminaria.es_modernizacion === "1" ? true : false}
                        onChange={newhandleCheck}
                        disabled={deshabilitar} />
                </div>

                <div className="MiniBoxCheck">
                    <InputLabel sx={{ mr:-1 }}>Pintura: </InputLabel>
                    <Checkbox
                        name="es_pintura"
                        icon={<FormatPaintOutlinedIcon />}
                        checkedIcon={<FormatPaintIcon />}
                        checked={dataLuminaria.es_pintura === "1" ? true : false}
                        onChange={newhandleCheck}
                        disabled={deshabilitar} />
                </div>

                <div className="MiniBoxCheck">
                    <InputLabel sx={{ mr:-1 }}>Reubicación: </InputLabel>
                    <Checkbox
                        name="es_reubicacion"
                        icon={<AddLocationOutlinedIcon />}
                        checkedIcon={<AddLocationIcon />}
                        checked={dataLuminaria.es_reubicacion === "1" ? true : false}
                        onChange={newhandleCheck}
                        disabled={deshabilitar} />
                </div>

                <div className="MiniBoxCheck">
                    <InputLabel sx={{ mr:-1 }}>Ampliación: </InputLabel>
                    <Checkbox
                        name="es_ampliacion"
                        icon={<AddCircleOutlineIcon />}
                        checkedIcon={<AddCircleIcon />}
                        checked={dataLuminaria.es_ampliacion === "1" ? true : false}
                        onChange={newhandleCheck}
                        disabled={deshabilitar} />
                </div>

                <div className="MiniBoxCheck">
                    <InputLabel sx={{ mr:-1 }}>Complementación: </InputLabel>
                    <Checkbox
                        name="es_complementacion"
                        icon={<ChangeCircleOutlinedIcon />}
                        checkedIcon={<ChangeCircleIcon />}
                        checked={dataLuminaria.es_complementacion === "1" ? true : false}
                        onChange={newhandleCheck}
                        disabled={deshabilitar} />
                </div>

                <div className="MiniBoxCheck">
                    <InputLabel sx={{ mr:-1 }}>Regeneración: </InputLabel>
                    <Checkbox
                        name="es_regeneracion"
                        icon={<TipsAndUpdatesOutlinedIcon />}
                        checkedIcon={<TipsAndUpdatesIcon />}
                        checked={dataLuminaria.es_regeneracion === "1" ? true : false}
                        onChange={newhandleCheck}
                        disabled={deshabilitar} />
                </div>
            </Box>

            {accion !== "actualizar" &&
            <>
                <Divider/>
                <h3>Datos de Brazo</h3>
                <Box className="BoxInfoLuminaria">
                    <MemoryIcon sx={{marginRight:0.5}}/>
                    <InputLabel sx={styleLabel} style={banderaobligatorio ? {color:"red"} : {color:"black"}}>Tecnologia Foco: </InputLabel>
                    <TextField variant="standard" name="tecnologia"
                        value={dataBrazoNuevo.tecnologia||""} sx={styleTextfield}
                        disabled={deshabilitar} error={banderaobligatorio}
                        onChange={handleChangeBrazo}
                    />
                </Box>
                <Box className="BoxInfoLuminaria">
                    <BoltIcon sx={{marginRight:0.5}}/>
                    <InputLabel sx={styleLabel} style={banderaobligatorio ? {color:"red"} : {color:"black"}}>Potencia Watts: </InputLabel>
                    <TextField variant="standard" name="potencia_watts" type="number"
                        value={dataBrazoNuevo.potencia_watts||""} sx={styleTextfield}
                        disabled={deshabilitar} error={banderaobligatorio}
                        onChange={handleChangeBrazo}
                        InputProps={{
                            //readOnly: true,
                            endAdornment: <InputAdornment position="end">WATTS</InputAdornment>,
                        }}
                        />
                </Box>
            </>
            }

            {!deshabilitar &&
                <><Divider style={{marginTop: 10 }} />
                <div style={{ textAlign: "right" }}>
                    <Button variant="outlined" color="success"
                    sx={{ marginTop: 1 }}
                    onClick={accion === "actualizar" ? enviarDatos : crearLuminaria}
                    >
                    GUARDAR
                    </Button>
                </div></>
            }

            {datareportespdl.length > 0 &&
                <>
                <Divider sx={{mt: 1, mb:0.5}}>
                    <Chip label="Reportes" size="small" />
                </Divider>
                <InputLabel sx={{textAlign:"left", marginBottom:1}}>
                    <strong>Total de Reportes: {datareportespdl.length}</strong> 
                </InputLabel>
                {datareportespdl.map((reportepdl, index) => (
                    <div key={index} style={{marginBottom:5}}>
                        <div style={{display:"flex", justifyContent:"space-evenly", alignItems:"center"}}>
                            <Chip label={(index + 1) + "°"} size="small" sx={{mb:0.25}}/>
                            <InputLabel sx={{fontSize:13}}>Reporte: {reportepdl.killkizeo}</InputLabel>
                            <InputLabel>Estatus:
                                <Chip label={cambiar(reportepdl.estado)}
                                sx={[stylerow(reportepdl.estado),
                                { width: 90, borderRadius: 1.5, fontSize: "0.65rem", height: 20, 
                                fontWeight: "bold", ml:1 }]}
                                size="small"/>
                            </InputLabel>
                        </div>
                        <Divider/>
                    </div>
                    ))
                }
                </>
            }

            {showModalCrear && <ModalNewReporte setmostrar={cerrarModalHijo} dataluminariaextra={dataLuminaria}/>}

            
            { isCharging && <LoaderIndicator /> }

            </>
    );
}

export default Luminaria;