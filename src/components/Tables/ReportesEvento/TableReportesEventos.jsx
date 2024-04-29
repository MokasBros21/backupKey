//import * as React from 'react';
import axios from 'axios'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import React, { useEffect, useState, useRef } from "react";
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExplicitIcon from '@mui/icons-material/Explicit';

import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import "./TableReportesEventos.scss";
import Table0 from '../../../assets/Table0.jpg'

import classNames from "classnames";
import { Box, MenuItem, Select } from '@mui/material';

import { Url } from '../../../constants/global';
import { useNavigate } from "react-router-dom";
import LoaderIndicator from '../../../layout/LoaderIndicator/LoaderIndicator';

const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: "20%",
        //width: 250,
      },
    },
  };

const TableReportes = () => {
    const Navigate = useNavigate();

    const [rangofechas, setrangofechas] = useState([
        {
        startDate: new Date(),
        endDate: addDays(new Date(), 1),
        key: 'selection'
        }
    ]);

    const [data, SetData] = useState([])
    const [users, setUsers] = useState([])
    
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user_datos'));
    const id_proyect = localStorage.getItem('id_proyecto')

    const refTextPDL = useRef(null);
    const refTextFolio = useRef(null);
    const refTextNombre = useRef(null);

    const [disabled, setdisabled] = useState(false)
    const [anchorEl, setAnchorEl] = React.useState(null);

    const [showFilterFolio, setshowFilterFolio] = useState(false)
    const [showFilterPDL, setShowFilterPDL] = useState(false)
    const [showFilterTipo, setshowFilterTipo] = useState(false)
    const [showFilterCanal, setShowFilterCanal] = useState(false)
    const [showFilterFalla, setShowFilterFalla] = useState(false)
    const [showFilterNombre, setShowFilterNombre] = useState(false)
    const [showFilterFecha, setshowFilterFecha] = useState(false)
    const [showDownload, setshowDownload] = useState(false)

    const [canales, setCanales] = useState([])
    const [fallas, setFallas] = useState([])
    
    const [banderaFolio, setbanderaFolio] = useState(true)
    const [banderaPDL, setbanderaPDL] = useState(true)
    const [banderaTipo, setbanderaTipo] = useState(true)
    const [banderaCanal, setbanderaCanal] = useState(true)
    const [banderaFalla, setbanderaFalla] = useState(true)
    const [nombreBuscado, setNombreBuscado] = useState("")
    const [banderaFecha, setbanderaFecha] = useState(true)

    let [foliobuscado, setfoliobuscado] = useState("")
    let [pdlbuscado, setpdlbuscado] = useState("")
    let [selecttipo, setselecttipo] = useState("")
    let [selectcanal, setselectcanal] = React.useState("");
    let [selectfalla, setselectfalla] = React.useState("")
    let [usuariobuscado, setusuariobuscado] = useState("")
    let [fechasfiltro, setfechasfiltro] = useState ({
        fechaIncio : "",
        fechaFin : ""
    })  

    const urlfil = useRef('')
    const [firstpageUrl, setfirstpageUrl] = useState("")
    const [prevpageUrl, setprevpageUrl] = useState("")
    const [nextpageUrl, setnextpageUrl] = useState("")
    const [lastpageUrl, setlaspageUrl] = useState("")
    const [totalRegistros, settotalRegistros] = useState(0)
    const [rangoregistros, setrangoregistros] = useState("")

    const [ isCharging, setisCharging ] = useState(false);

    const cargarReportesFiltrados = () => {

        var urlfiltrosactivos = Url + 'reporte_eventos?proyecto='+id_proyect+'&canal='+selectcanal
                                +'&usuario='+usuariobuscado+'&falla='+selectfalla+'&duplicado='+selecttipo
                                +'&desde='+fechasfiltro.fechaIncio+'&hasta='+fechasfiltro.fechaFin+"&pdl="
                                +pdlbuscado+"&killkizeo="+foliobuscado

        urlfil.current = urlfiltrosactivos

        axios.get(urlfiltrosactivos, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            SetData(res.data.data);
            settotalRegistros(res.data.total)
            setrangoregistros(res.data.from + "-" + res.data.to)
            setfirstpageUrl(res.data.first_page_url)
            setprevpageUrl(res.data.prev_page_url)
            setnextpageUrl(res.data.next_page_url)
            setlaspageUrl(res.data.last_page_url)
          })
        .catch(err => console.log(err))
    }

    const traerCanales = () => {
        axios.get(Url + 'canales', {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            setCanales(res.data);
        })
        .catch(err => console.log(err))
    }

    const traerFallas = () => {
        axios.get(Url + 'fallas?tipo=luminaria', {
            headers:{
                Authorization : token
            }
        })
        .then(res => {
            setFallas(res.data)
        })
        .catch(err => console.log(err))
    }

    useEffect(() =>{
        if(!([3,4,11].includes(user.rol)) && token){
            Navigate("/unauthorized")
        }else{
            setisCharging(true)

            const UrlInicial = Url + 'reporte_eventos?proyecto='+id_proyect

            urlfil.current = UrlInicial

            axios.get(UrlInicial, {
                headers: {
                    Authorization : token,
                }
            })
            .then(res =>  {
                SetData(res.data.data);
                settotalRegistros(res.data.total)
                setrangoregistros(res.data.from + "-" + res.data.to)
                setfirstpageUrl(res.data.first_page_url)
                setprevpageUrl(res.data.prev_page_url)
                setnextpageUrl(res.data.next_page_url)
                setlaspageUrl(res.data.last_page_url)
                traerCanales()
                traerFallas()
                setisCharging(false)
            })
            .catch(err => {
                setisCharging(false)
                console.log(err)})

            axios.get(Url + 'users?roles=11,9&proyecto='+id_proyect, {
                headers: {
                    Authorization : token,
                }
            })
            .then(res =>  {
                setUsers(res.data)
            })
            .catch(err => console.log(err))
        }
    }, [])


    //Filtro Folio
    const abrirPopFolio = (event) => {
        setAnchorEl(event.currentTarget);
        setshowFilterFolio(true);

        setTimeout(() => {
            refTextFolio.current.focus();
          }, 0);
    }

    const cerrarPopFolio = () => {
        setshowFilterFolio(false);
    }

    const handleChangeFolio = (event) => {
        setfoliobuscado(event.target.value)
    }

    const onKeyDownHandlerFolio = (event) => {
    
        if (event.key === "Enter") {
            if(foliobuscado === ""){
                cargarReportesFiltrados();
            }else{
                
                var urlfiltroFolio = Url + 'reporte_eventos?proyecto='+id_proyect+'&canal='+selectcanal+'&usuario='+usuariobuscado
                +'&falla='+selectfalla+'&duplicado='+selecttipo+'&desde='+fechasfiltro.fechaIncio+
                '&hasta='+fechasfiltro.fechaFin+"&pdl="+pdlbuscado+"&killkizeo="+foliobuscado

                urlfil.current = urlfiltroFolio

                axios.get(urlfiltroFolio, {
                    headers: {
                        Authorization : token,
                    }
                })
                .then(res =>  {
                    SetData(res.data.data);
                    settotalRegistros(res.data.total)
                    setrangoregistros(res.data.from + "-" + res.data.to)
                    setfirstpageUrl(res.data.first_page_url)
                    setprevpageUrl(res.data.prev_page_url)
                    setnextpageUrl(res.data.next_page_url)
                    setlaspageUrl(res.data.last_page_url)
                    setbanderaFolio(false)
                    if(res.data.data.length !== 0){
                        cerrarPopFolio();
                    }
                  })
                .catch(err => console.log(err))
            }
        }
    }

    const limpiarFiltroFolio = () => {
        setbanderaFolio(true)
        setfoliobuscado("")
        foliobuscado=""
        
        cargarReportesFiltrados();
    }

    //Filtro PDL
    const abrirPopPDL = (event) => {
        setAnchorEl(event.currentTarget);
        setShowFilterPDL(true);

        setTimeout(() => {
            refTextPDL.current.focus();
          }, 0);
    }

    const cerrarPopPDL = () => {
        setShowFilterPDL(false);
    }

    const handleChangePDL = (event) => {
        setpdlbuscado(event.target.value)
    }

    const onKeyDownHandlerPDL = (event) => {
        let $PDL = document.getElementById("PDL");
    
        if (event.key === "Enter") {
            if($PDL.value === ""){
                cargarReportesFiltrados();
            }else{
                
                var urlfiltroPDL = Url + 'reporte_eventos?proyecto='+id_proyect+'&canal='+selectcanal+'&usuario='+usuariobuscado
                +'&falla='+selectfalla+'&duplicado='+selecttipo+'&desde='+fechasfiltro.fechaIncio+
                '&hasta='+fechasfiltro.fechaFin+"&pdl="+pdlbuscado+"&killkizeo="+foliobuscado

                urlfil.current = urlfiltroPDL

                axios.get(urlfiltroPDL, {
                    headers: {
                        Authorization : token,
                    }
                })
                .then(res =>  {
                    SetData(res.data.data);
                    settotalRegistros(res.data.total)
                    setrangoregistros(res.data.from + "-" + res.data.to)
                    setfirstpageUrl(res.data.first_page_url)
                    setprevpageUrl(res.data.prev_page_url)
                    setnextpageUrl(res.data.next_page_url)
                    setlaspageUrl(res.data.last_page_url)
                    setbanderaPDL(false)
                    if(res.data.data.length !== 0){
                        cerrarPopPDL();
                    }
                  })
                .catch(err => console.log(err))
            }
        }
    }

    const limpiarFiltroPDL = () => {
        setbanderaPDL(true)
        setpdlbuscado("")
        pdlbuscado=""
        
        cargarReportesFiltrados();
    }

    //Filtro Tipo
    const abrirPopTipoReporte = (event) => {
        setAnchorEl(event.currentTarget);
        setselecttipo("-1")
        setshowFilterTipo(true);
    }

    const cerrarPopTipoReporte = () => {
        setshowFilterTipo(false);
    }

    const handleChangeSelectTipo = (event) => {
        setselecttipo(event.target.value)
        selecttipo=(event.target.value)
        console.log(selecttipo)
        setbanderaTipo(false)
        cerrarPopTipoReporte()
        
        var urlactivaTipo = Url + 'reporte_eventos?proyecto='+id_proyect+'&canal='+selectcanal+'&usuario='+usuariobuscado
                            +'&falla='+selectfalla+'&duplicado='+selecttipo+'&desde='+fechasfiltro.fechaIncio+
                            '&hasta='+fechasfiltro.fechaFin+"&pdl="+pdlbuscado+"&killkizeo="+foliobuscado

        urlfil.current = urlactivaTipo

        axios.get(urlactivaTipo, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            SetData(res.data.data);
            settotalRegistros(res.data.total)
            setrangoregistros(res.data.from + "-" + res.data.to)
            setbanderaTipo(false)
            setfirstpageUrl(res.data.first_page_url)
            setprevpageUrl(res.data.prev_page_url)
            setnextpageUrl(res.data.next_page_url)
            setlaspageUrl(res.data.last_page_url)
            if(res.data.data.length !== 0){
                cerrarPopTipoReporte();
            }
          })
        .catch(err => console.log(err))
    }

    const limpiarFiltroTipoReporte = () => {
        setbanderaTipo(true)
        setselecttipo("")
        selecttipo=""
        
        cargarReportesFiltrados();
    }

    //Filtro Canal
    const abrirPopCanal = (event) => {
        setAnchorEl(event.currentTarget);
        setselectcanal(0)
        setShowFilterCanal(true);
    }

    const cerrarPopCanal = () => {
        setShowFilterCanal(false);
    }

    const handleChangeSelectCanal = (event) => {
        setselectcanal(event.target.value)
        selectcanal=event.target.value

        var urlactivaCanal = Url + 'reporte_eventos?proyecto='+id_proyect+'&canal='+selectcanal+'&usuario='+usuariobuscado
                            +'&falla='+selectfalla+'&duplicado='+selecttipo+'&desde='+fechasfiltro.fechaIncio+
                            '&hasta='+fechasfiltro.fechaFin+"&pdl="+pdlbuscado+"&killkizeo="+foliobuscado

        urlfil.current = urlactivaCanal

        axios.get(urlactivaCanal, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            SetData(res.data.data);
            settotalRegistros(res.data.total)
            setrangoregistros(res.data.from + "-" + res.data.to)
            setbanderaCanal(false)
            setfirstpageUrl(res.data.first_page_url)
            setprevpageUrl(res.data.prev_page_url)
            setnextpageUrl(res.data.next_page_url)
            setlaspageUrl(res.data.last_page_url)
            if(res.data.data.length !== 0){
                cerrarPopCanal();
            }
          })
        .catch(err => console.log(err))
    }

    const limpiarFiltroCanal = () => {
        setbanderaCanal(true)
        selectcanal=""
        setselectcanal("")
        cargarReportesFiltrados();
    }

    //Filtro Falla
    const abrirPopFalla = (event) => {
        setAnchorEl(event.currentTarget);
        setselectfalla(0)
        setShowFilterFalla(true);
    }

    const cerrarPopFalla = () => {
        setShowFilterFalla(false);
    }

    const handleChangeSelectFalla = (event) => {
        setselectfalla(event.target.value)
        selectfalla=event.target.value

        var urlactivaFalla = Url + 'reporte_eventos?proyecto='+id_proyect+'&canal='+selectcanal+'&usuario='+usuariobuscado
                            +'&falla='+selectfalla+'&duplicado='+selecttipo+'&desde='+fechasfiltro.fechaIncio+
                            '&hasta='+fechasfiltro.fechaFin+"&pdl="+pdlbuscado+"&killkizeo="+foliobuscado

        urlfil.current = urlactivaFalla

        axios.get(urlactivaFalla, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            SetData(res.data.data);
            settotalRegistros(res.data.total)
            setrangoregistros(res.data.from + "-" + res.data.to)
            setbanderaFalla(false)
            setfirstpageUrl(res.data.first_page_url)
            setprevpageUrl(res.data.prev_page_url)
            setnextpageUrl(res.data.next_page_url)
            setlaspageUrl(res.data.last_page_url)
            if(res.data.data.length !== 0){
                cerrarPopFalla();
            }
          })
        .catch(err => console.log(err))
    }

    const limpiarFiltroFalla = () => {
        setbanderaFalla(true)
        selectfalla=""
        setselectfalla("")
        cargarReportesFiltrados();
    }

    //Filtro Nombre
    const abrirPopNombre = (event) => {
        setAnchorEl(event.currentTarget);
        setShowFilterNombre(true);

        setTimeout(() => {
            refTextNombre.current.focus();
          }, 0);
    }

    const cerrarPopNombre = () => {
        setShowFilterNombre(false);
    }

    const handleChange = (valor) => {
        if(valor === null){
            setNombreBuscado("")
            usuariobuscado=""
            cargarReportesFiltrados();
        }else{
            setNombreBuscado(valor.id||"")

            setusuariobuscado(valor.id)
            usuariobuscado = valor.id

            var urlactivaNombre = Url + 'reporte_eventos?proyecto='+id_proyect+'&canal='+selectcanal+'&usuario='+usuariobuscado
                                +'&falla='+selectfalla+'&duplicado='+selecttipo+'&desde='+fechasfiltro.fechaIncio+
                                '&hasta='+fechasfiltro.fechaFin+"&pdl="+pdlbuscado+"&killkizeo="+foliobuscado

            urlfil.current = urlactivaNombre

            axios.get(urlactivaNombre, {
                headers: {
                    Authorization : token,
                }
            })
            .then(res =>  {
                SetData(res.data.data);
                settotalRegistros(res.data.total)
                setrangoregistros(res.data.from + "-" + res.data.to)
                setfirstpageUrl(res.data.first_page_url)
                setprevpageUrl(res.data.prev_page_url)
                setnextpageUrl(res.data.next_page_url)
                setlaspageUrl(res.data.last_page_url)
                if(res.data.data.length !== 0){
                    cerrarPopNombre();
                }
              })
            .catch(err => console.log(err))
        }
    }

    const limpiarflitroNombre = () => {
        setNombreBuscado("")
        setusuariobuscado("")
        usuariobuscado = ""
        cargarReportesFiltrados();
    }

    //Filtro Fecha
    const abrirPopFecha = (event) => {
        setAnchorEl(event.currentTarget);
        setshowFilterFecha(true)
    }

    const cerrarPopFecha = () => {
        setshowFilterFecha(false);
    }

    const revisarfecha0 = (fecha) => {
        if (fecha < 10) {
            return "0"+fecha
        }
        return fecha
    }

    const filtrarFecha = () => {
        const desde = (rangofechas[0].startDate.getFullYear() + "-" + revisarfecha0(rangofechas[0].startDate.getMonth() + 1)
                        + "-" + revisarfecha0(rangofechas[0].startDate.getDate()))

        const hasta = (rangofechas[0].endDate.getFullYear() + "-" + revisarfecha0(rangofechas[0].endDate.getMonth() + 1)
        + "-" + revisarfecha0(rangofechas[0].endDate.getDate()))

        setfechasfiltro({
            ...fechasfiltro,
            fechaIncio : desde,
            fechaFin : hasta
            });

        fechasfiltro.fechaIncio = desde
        fechasfiltro.fechaFin = hasta

        var urlactivaFecha = Url + 'reporte_eventos?proyecto='+id_proyect+'&canal='+selectcanal+'&usuario='+usuariobuscado
                            +'&falla='+selectfalla+'&duplicado='+selecttipo+'&desde='+fechasfiltro.fechaIncio+
                            '&hasta='+fechasfiltro.fechaFin+"&pdl="+pdlbuscado+"&killkizeo="+foliobuscado

        urlfil.current = urlactivaFecha

        axios.get(urlactivaFecha, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            SetData(res.data.data);
            settotalRegistros(res.data.total)
            setrangoregistros(res.data.from + "-" + res.data.to)
            setbanderaFecha(false)
            setfirstpageUrl(res.data.first_page_url)
            setprevpageUrl(res.data.prev_page_url)
            setnextpageUrl(res.data.next_page_url)
            setlaspageUrl(res.data.last_page_url)
            if(res.data.data.length !== 0){
                cerrarPopFecha();
            }
          })
        .catch(err => console.log(err))
    }

    //Option Download
    const abrirPopDownload = (event) => {
        setAnchorEl(event.currentTarget);
        setshowDownload(true)
    }

    const cerrarPopDownload = () => {
        setshowDownload(false)
    }

    const limpiarFiltroFecha = () => {
        setfechasfiltro({
            ...fechasfiltro,
            fechaIncio : "",
            fechaFin : ""
            });

        fechasfiltro.fechaIncio = ""
        fechasfiltro.fechaFin = "" 

        setbanderaFecha(true)
        cargarReportesFiltrados()
    }

    const downloadExcel = async () => {
    
        const index = urlfil.current.indexOf("?")
        const fin = urlfil.current.length

        const cadenaextraida = urlfil.current.slice(index, fin)

        var UrlExcel = Url + "reporte_eventos/excel/download" + cadenaextraida

        console.log(UrlExcel)
        
        setisCharging(true)
        const response = await axios.get(UrlExcel , {
            headers: {
                Authorization: token
            },
            responseType: 'blob'
        });

        // Crea una URL para el Blob
        const url = window.URL.createObjectURL(response.data);

        setisCharging(false)
        // Abre una nueva ventana con la URL
        window.open(url, "_blank");

        cerrarPopDownload()
    }

    //Extras
    const tiporreporte = (duplicado) => {
        if (duplicado === '0') {
            return "EFECTIVO"
        } else {
            return "ADJUNTO"
        }
    }

    //Paginado
    const firstpage = () => {
        setisCharging(true)
        axios.get(firstpageUrl, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            setisCharging(false)
            SetData(res.data.data);
            settotalRegistros(res.data.total)
            setrangoregistros(res.data.from + "-" + res.data.to)
            setfirstpageUrl(res.data.first_page_url)
            setprevpageUrl(res.data.prev_page_url)
            setnextpageUrl(res.data.next_page_url)
            setlaspageUrl(res.data.last_page_url)
        })
        .catch(err => {
            setisCharging(false)
            console.log(err)})
    }

    const prevpage = () => {
        setisCharging(true)
        axios.get(prevpageUrl, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            setisCharging(false)
            SetData(res.data.data);
            settotalRegistros(res.data.total)
            setrangoregistros(res.data.from + "-" + res.data.to)
            setfirstpageUrl(res.data.first_page_url)
            setprevpageUrl(res.data.prev_page_url)
            setnextpageUrl(res.data.next_page_url)
            setlaspageUrl(res.data.last_page_url)
        })
        .catch(err => {
            setisCharging(false)
            console.log(err)}) 
    }

    const nextpage = () => {
        setisCharging(true)
        axios.get(nextpageUrl, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            setisCharging(false)
            SetData(res.data.data);
            settotalRegistros(res.data.total)
            setrangoregistros(res.data.from + "-" + res.data.to)
            setfirstpageUrl(res.data.first_page_url)
            setprevpageUrl(res.data.prev_page_url)
            setnextpageUrl(res.data.next_page_url)
            setlaspageUrl(res.data.last_page_url)
        })
        .catch(err => {
            setisCharging(false)
            console.log(err)})
    }

    const lastpage = () => {
        setisCharging(true)
        axios.get(lastpageUrl, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            setisCharging(false)
            SetData(res.data.data);
            settotalRegistros(res.data.total)
            setrangoregistros(res.data.from + "-" + res.data.to)
            setfirstpageUrl(res.data.first_page_url)
            setprevpageUrl(res.data.prev_page_url)
            setnextpageUrl(res.data.next_page_url)
            setlaspageUrl(res.data.last_page_url)
        })
        .catch(err => {
            setisCharging(false)
            console.log(err)})
    }

    const styleCell = {
        color: 'white',
        textAlign: "center",
        backgroundColor: "#237f65",
    }

    const styleWihtR = {
        color: '#808B96',
        textAlign: 'center',
    }

    const styleWithoutR = {
        color: 'black',
        textAlign: 'center',
    }

    //if([3,11].includes(user.rol)){
    return (
        <div className={classNames("TableReportesEventos")}>
            <TableContainer>
                <Table stickyHeader size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={styleCell}>Folio de Seguimiento</TableCell>
                            <TableCell sx={styleCell}>
                            <div style={{ display: 'flex', justifyContent:'center', alignItems:'center'}}>
                                        Reporte
                                {banderaFolio ?
                                    <IconButton onClick={abrirPopFolio} sx={{color:'white'}}>
                                        <FilterAltIcon/>
                                    </IconButton>   
                                    :
                                    <IconButton onClick={limpiarFiltroFolio} sx={{color:'white'}}>
                                        <FilterAltOffIcon/>
                                    </IconButton>
                                    }     
                                        <Popover
                                        open={showFilterFolio}
                                        anchorEl={anchorEl}
                                        onClose={cerrarPopFolio}
                                        anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                        }}
                                        >
                                        <Box p={1} component="div" sx={{width:100}}>
                                            <TextField id="PDL" sx={{width:'100%'}} variant="standard" 
                                            onChange={handleChangeFolio} inputRef={refTextFolio}
                                            onKeyDownCapture={onKeyDownHandlerFolio} autoComplete='off'
                                            />
                                        </Box>
                                    </Popover>      
                            </div>
                            </TableCell>
                            <TableCell sx={styleCell}>
                            <div style={{ display: 'flex', justifyContent:'center', alignItems:'center'}}>
                                        PDL
                                {banderaPDL ?
                                    <IconButton onClick={abrirPopPDL} sx={{color:'white'}}>
                                        <FilterAltIcon/>
                                    </IconButton>   
                                    :
                                    <IconButton onClick={limpiarFiltroPDL} sx={{color:'white'}}>
                                        <FilterAltOffIcon/>
                                    </IconButton>
                                    }     
                                        <Popover
                                        open={showFilterPDL}
                                        anchorEl={anchorEl}
                                        onClose={cerrarPopPDL}
                                        anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                        }}
                                        >
                                        <Box p={1} component="div" sx={{width:100}}>
                                            <TextField id="PDL" sx={{width:'100%'}} variant="standard" 
                                            onChange={handleChangePDL} inputRef={refTextPDL}
                                            onKeyDownCapture={onKeyDownHandlerPDL} autoComplete='off'
                                            />
                                        </Box>
                                    </Popover>      
                            </div>
                            </TableCell>
                            <TableCell sx={styleCell}>
                            <div style={{ display: 'flex', justifyContent:'center', alignItems:'center'}}>
                                    Tipo Reporte  
                                {banderaTipo ?
                                    <IconButton onClick={abrirPopTipoReporte} sx={{color:'white'}}>
                                        <FilterAltIcon/>
                                    </IconButton>
                                    :
                                    <IconButton sx={{color:'white'}} onClick={limpiarFiltroTipoReporte}>
                                        <FilterAltOffIcon/>
                                    </IconButton>
                                    }
                                    <Popover
                                        open={showFilterTipo}
                                        anchorEl={anchorEl}
                                        onClose={cerrarPopTipoReporte}
                                        anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                        }}
                                        >
                                        <Box p={1} component="div">
                                            <Select
                                                onClose={() => {
                                                    setTimeout(() => {
                                                    document.activeElement.blur();
                                                    }, 0);
                                                }}
                                                id="select-tipo-reporte"
                                                value={selecttipo}
                                                onChange={handleChangeSelectTipo}
                                                //MenuProps={MenuProps}
                                                variant="standard">
                                                <MenuItem value={"-1"} disabled>Seleccione</MenuItem>
                                                <MenuItem value={"0"}>EFECTIVO</MenuItem>
                                                <MenuItem value={"1"}>ADJUNTO</MenuItem>
                                            </Select>
                                        </Box>
                                    </Popover> 
                                </div>
                            </TableCell>
                            <TableCell sx={styleCell}>
                                <div style={{ display: 'flex', justifyContent:'center', alignItems:'center'}}>
                                    Canal  
                                {banderaCanal ?
                                    <IconButton onClick={abrirPopCanal} sx={{color:'white'}}>
                                        <FilterAltIcon/>
                                    </IconButton>
                                    :
                                    <IconButton sx={{color:'white'}} onClick={limpiarFiltroCanal}>
                                        <FilterAltOffIcon/>
                                    </IconButton>
                                    }
                                    <Popover
                                        open={showFilterCanal}
                                        anchorEl={anchorEl}
                                        onClose={cerrarPopCanal}
                                        anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                        }}
                                        >
                                        <Box p={1} component="div">
                                            <Select
                                                onClose={() => {
                                                    setTimeout(() => {
                                                    document.activeElement.blur();
                                                    }, 0);
                                                }}
                                                id="select-canal"
                                                value={selectcanal}
                                                onChange={handleChangeSelectCanal}
                                                MenuProps={MenuProps}
                                                variant="standard">
                                                <MenuItem value={0} disabled>Seleccione</MenuItem>
                                                {canales.map((canal, index) => (
                                                    <MenuItem key={index} value={canal.id}>{canal.nombre}</MenuItem>
                                                ))}
                                            </Select>
                                        </Box>
                                    </Popover> 
                                </div>
                            </TableCell>
                            <TableCell sx={styleCell}>
                                <div style={{ display: 'flex', justifyContent:'center', alignItems:'center'}}>
                                    Falla  
                                {banderaFalla ?
                                    <IconButton onClick={abrirPopFalla} sx={{color:'white'}}>
                                        <FilterAltIcon/>
                                    </IconButton>
                                    :
                                    <IconButton sx={{color:'white'}} onClick={limpiarFiltroFalla}>
                                        <FilterAltOffIcon/>
                                    </IconButton>
                                    }
                                    <Popover
                                        open={showFilterFalla}
                                        anchorEl={anchorEl}
                                        onClose={cerrarPopFalla}
                                        anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                        }}
                                        >
                                        <Box p={1} component="div">
                                            <Select
                                                onClose={() => {
                                                    setTimeout(() => {
                                                    document.activeElement.blur();
                                                    }, 0);
                                                }}
                                                id="select-falla"
                                                value={selectfalla}
                                                onChange={handleChangeSelectFalla}
                                                MenuProps={MenuProps}
                                                variant="standard">
                                                <MenuItem value={0} disabled>Seleccione</MenuItem>
                                                {fallas.map((falla, index) => (
                                                    <MenuItem key={index} value={falla.id}>{falla.nombre}</MenuItem>
                                                ))}
                                            </Select>
                                        </Box>
                                    </Popover> 
                                </div>
                            </TableCell>
                            <TableCell sx={styleCell}>
                                <div style={{ display: 'flex', justifyContent:'center', alignItems:'center'}}>
                                    Usuario
                                    {nombreBuscado === (null||"") ?
                                    <IconButton onClick={abrirPopNombre} sx={{color:'white'}}>
                                        <FilterAltIcon/>
                                    </IconButton>
                                    :
                                    <IconButton sx={{color:'white'}} onClick={limpiarflitroNombre}>
                                        <FilterAltOffIcon/>
                                    </IconButton>
                                    }
                                    <Popover
                                        open={showFilterNombre}
                                        anchorEl={anchorEl}
                                        onClose={cerrarPopNombre}
                                        anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                        }}
                                        >
                                        <Box p={1} component="div" height={200}>
                                            <Autocomplete
                                            disablePortal
                                            id="combo-box-demo"
                                            onChange={(event, value) => handleChange(value)}
                                            options={users}
                                            getOptionLabel={(option) => option.nombre_completo}
                                            sx={{ width: 200 }}
                                            renderInput={(params) => <TextField {...params} 
                                                                        inputRef={refTextNombre}
                                                                        id="nombreBuscado"
                                                                        value={nombreBuscado}
                                                                        variant="standard"/>}
                                            />
                                        </Box>
                                    </Popover>
                                </div>
                            </TableCell>
                            <TableCell sx={styleCell}>
                            <div style={{ display: 'flex', justifyContent:'center', alignItems:'center'}}>
                                    Fecha Registro
                                    {banderaFecha ?
                                    <IconButton onClick={abrirPopFecha} sx={{color:'white'}}>
                                        <FilterAltIcon/>
                                    </IconButton>
                                    :
                                    <IconButton sx={{color:'white'}} onClick={limpiarFiltroFecha}>
                                        <FilterAltOffIcon/>
                                    </IconButton>
                                    }
                                    <Popover
                                        open={showFilterFecha}
                                        anchorEl={anchorEl}
                                        onClose={cerrarPopFecha}
                                        anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                        }}
                                        >
                                        <Box p={1} component="div">
                                            <DateRangePicker
                                                onChange={item => setrangofechas([item.selection])}
                                                showSelectionPreview={true}
                                                months={1}
                                                ranges={rangofechas}
                                                direction="horizontal"
                                                />;
                                            <Button onClick={filtrarFecha}>OK</Button>
                                        </Box>
                                    </Popover>
                                </div>
                            </TableCell>
                            <TableCell sx={styleCell}>
                                <IconButton sx={{ml:-4, color:'white'}} onClick={abrirPopDownload}>
                                    <MoreVertIcon />
                                </IconButton>

                                <Popover
                                        id="Descarga"
                                        open={showDownload}
                                        anchorEl={anchorEl}
                                        onClose={cerrarPopDownload}
                                        sx={{
                                            "& .MuiPaper-root": {
                                                boxShadow: '-5px 6px 5px 5px rgba(0,0,0,0.25);'
                                              }
                                        }}
                                        anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                        }}
                                    >
                                        <Box sx={{p:1, width:"100%", display:"flex", justifyContent:"center"}}>
                                            <Button  variant="outlined" size="small"
                                                onClick={downloadExcel}
                                                color="success" endIcon={<ExplicitIcon/>}>
                                                GENERAR EXCEL
                                            </Button>
                                        </Box>
                                </Popover>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    {totalRegistros >= 1 &&
                    <TableBody >
                        {data.map((reporteevento, index) => (
                            <TableRow key={index}>
                                <TableCell sx={reporteevento.reporte!==null ? styleWihtR:styleWithoutR}>{reporteevento.id}</TableCell>
                                <TableCell sx={reporteevento.reporte!==null ? styleWihtR:styleWithoutR}>
                                    {reporteevento.reporte !== null ?
                                        reporteevento.reporte.killkizeo||"---"
                                        :
                                        "---"
                                    }
                                </TableCell>
                                <TableCell sx={reporteevento.reporte!==null ? styleWihtR:styleWithoutR}>
                                    {reporteevento.reporte !== null ?
                                        reporteevento.reporte.luminaria.pdl_id
                                        :
                                        "--"
                                    }
                                </TableCell>
                                <TableCell sx={reporteevento.reporte!==null ? styleWihtR:styleWithoutR}>
                                    {tiporreporte(reporteevento.duplicado)}</TableCell>
                                <TableCell sx={reporteevento.reporte!==null ? styleWihtR:styleWithoutR}>
                                    {reporteevento.canal.nombre||"--"}</TableCell>
                                <TableCell sx={reporteevento.reporte!==null ? styleWihtR:styleWithoutR}>
                                    {reporteevento.falla.nombre||"---"}</TableCell>
                                <TableCell sx={reporteevento.reporte!==null ? styleWihtR:styleWithoutR}>
                                    {reporteevento.usuario.nombre} {reporteevento.usuario.ap_paterno} {reporteevento.usuario.ap_materno}
                                </TableCell>
                                <TableCell sx={reporteevento.reporte!==null ? styleWihtR:styleWithoutR} style={{width:200}}>
                                    {reporteevento.created_at}</TableCell>
                                <TableCell sx={{width:0}}></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    }
                </Table>
            </TableContainer>
            {totalRegistros === 0 &&
                <div style={{display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column"}}>
                    <img src={Table0} alt="Searching..." height={300} width={400} style={{marginTop:"5%"}}/>
                    <h3 style={{marginTop:"-4%", color:"#dce4f7"}}>Sin Registros</h3>
                </div>
            }
            <div style={{marginBottom:"2.5%"}}/>
                <>
                    <footer className={classNames("footerTableReportesEvento")}>
                        Total de Registros: {totalRegistros}
                    <div>
                        {totalRegistros > 50 && <>De: {rangoregistros}</>}

                        <IconButton size="small" onClick={firstpage} 
                            disabled={totalRegistros===0 || totalRegistros===1 || prevpageUrl===null}>
                            <FirstPageIcon/>
                        </IconButton>

                        <IconButton size="small" onClick={prevpage} 
                                disabled={totalRegistros===0|| totalRegistros===1 || prevpageUrl===null}>
                            <KeyboardArrowLeftIcon/>
                        </IconButton>

                        <IconButton size="small" onClick={nextpage} 
                                disabled={totalRegistros===0 || totalRegistros===1 || nextpageUrl===null}>
                            <KeyboardArrowRightIcon/>
                        </IconButton>

                        <IconButton size="small" onClick={lastpage} 
                                disabled={totalRegistros===0 || totalRegistros===1 || nextpageUrl===null}>
                            <LastPageIcon/>
                        </IconButton>
                    </div>
                    </footer>
                </>
        { isCharging && <LoaderIndicator /> }
        </div>
    );
    //}
    //else{
    //    return Navigate("/unauthorized")
    //}
}

export default TableReportes;         