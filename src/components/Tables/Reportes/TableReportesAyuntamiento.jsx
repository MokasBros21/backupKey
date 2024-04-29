//React
import React, { useEffect, useState, useRef } from "react";
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';
import { useNavigate } from "react-router-dom";

import axios from 'axios'

//Material UI
import { Box, MenuItem, Select, Switch } from '@mui/material';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';

import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

//Icons Material UI
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

import FilterAltIcon from '@mui/icons-material/FilterAlt';

//Componentes y elementos propios
import classNames from "classnames";
import './TableReportes.scss'
import Table0 from '../../../assets/Table0.jpg'

import { Url } from '../../../constants/global';
import LoaderIndicator from '../../../layout/LoaderIndicator/LoaderIndicator';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileWord } from "@fortawesome/free-solid-svg-icons";
import { CropOriginal, PictureAsPdf } from "@mui/icons-material";

    const MenuProps = {
        PaperProps: {
        style: {
            maxHeight: "20%",
            width: 250,
        },
        },
    };

    const MenuPropsStatus = {
        PaperProps: {
        style: {
            maxHeight: "20%",
        },
        },
    };

const TableReportesAyuntamiento = () => {

    const [valueTabMore, setvalueTabMore] = React.useState('1');

    const [rangofechasR, setrangofechasR] = useState([
        {
        startDate: new Date(),
        endDate: addDays(new Date(), 1),
        key: 'selection'
        }
    ]);

    const Navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user_datos'));
    const id_proyect = localStorage.getItem('id_proyecto')

    const [data, SetData] = useState([])

    const refTextKillKizeo = useRef(null);
    const refTextOficioRep = useRef(null);
    const refTextTicketRep = useRef(null);
    const refTextPDL = useRef(null);
    const refTextColonia = useRef(null)

    const [disabled, setdisabled] = useState(false)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isCharging, setisCharging ] = useState(false);

    const [openPanel, setopenPanel] = useState(false)

    const [showFilterId, setshowFilterKillKizeo] = useState(false)
    const [showFilterOficio, setShowFilterOficio] = useState(false)
    const [showFilterTicket, setshowFilterTicket] = useState(false)
    const [showFilterPDL, setShowFilterPDL] = useState(false)
    const [showFilterColonia, setshowFilterColonia] = useState(false)
    const [showFilterEstatus, setShowFilterEstatus] = useState(false)
    const [showFilterCanal, setShowFilterCanal] = useState(false)
    const [showFilterFalla, setShowFilterFalla] = useState(false)
    const [showFilterOrigenA, setshowFilterOrigenA] = useState(false)
    const [showFilterFechaR, setShowFilterFechaR] = useState(false)

    const [showColumns, setshowColumns]  = useState(false)
    const [stateFiltros, setStateFiltros] = React.useState({
        Canal: true,
        Oficio: false,
        NumTicket: false
      });

    const [canales, setCanales] = useState([])
    const [fallas, setFallas] = useState([])

    const [banderaFolio, setbanderaFolio] = useState(true)
    const [banderaOficio, setbanderaOficio] = useState(true)
    const [banderaTicket, setbanderaTicket] = useState(true)
    const [banderaPDL, setbanderaPDL] = useState(true)
    const [banderaColonia, setbanderaColonia] = useState(true)
    const [banderaEstatus, setbanderaEstatus] = useState(true)
    const [banderaCanal, setbanderaCanal] = useState(true)
    const [banderaFalla, setbanderaFalla] = useState(true)
    const [banderaOrigenA, setbanderaOrigenA] = useState(true)
    const [banderaFechaR, setbanderaFechaR] = useState(true)

    const [totalRegistros, settotalRegistros] = useState(0)
    const [rangoRegistros, setrangoRegistros] = useState("")
    const [firstpageUrl, setfirstpageUrl] = useState("")
    const [prevpageUrl, setprevpageUrl] = useState("")
    const [nextpageUrl, setnextpageUrl] = useState("")
    const [lastpageUrl, setlaspageUrl] = useState("")

    let [selectcanal, setselectcanal] = React.useState("");
    let [estatus, setestatus] = useState("TERMINADO,CANCELADO")
    let [colonia, setcolonia] = useState("")
    let [pdlbuscado, setpdlbuscado] = useState("")
    let [falla, setfalla] = useState("")
    let [origenA, setorigenA] = useState("")
    let [fechadesdeR, setfechadesdeR] = useState("")
    let [fechahastaR, setfechastaR] = useState("")
    let [tipofechaR, settipoFechaR] = useState('')

    const urlfil = useRef('')

    //Métodos Pre-carga
    const traerCanales = () =>{
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

    const traerFallas = () =>{
        axios.get(Url + 'fallas?tipo=luminaria', {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            setFallas(res.data);
        })
        .catch(err => console.log(err))
    }

    const changeDate = (fechaoriginal) => {
        if (fechaoriginal !== null) {
            const fecha = new Date(fechaoriginal);

            // Obtener día, mes y año
            const dia = fecha.getDate();
            const mes = fecha.getMonth() + 1;
            const año = fecha.getFullYear();
    
            // Formatear la fecha en el formato deseado
            const fechaFormateada = `${dia}/${mes}/${año}`;
    
            return fechaFormateada
        }
        else{
            return null
        }
    }

    const cargarsiempre = () => {

        axios.get(urlfil.current, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            SetData(res.data.data);
            settotalRegistros(res.data.total)
            setrangoRegistros(res.data.from+"-"+res.data.to)
            setfirstpageUrl(res.data.first_page_url)
            setprevpageUrl(res.data.prev_page_url)
            setnextpageUrl(res.data.next_page_url)
            setlaspageUrl(res.data.last_page_url)
          })
        .catch(err => console.log(err))
    }

    useEffect(() =>{
        if(token === null){
            Navigate("/")
        }else{
            if (localStorage.getItem('prefiltrado') !== null) {
                const prefiltrados = JSON.parse(localStorage.getItem('prefiltrado'));
                setStateFiltros(prefiltrados)
            }

            var urlinicio = ""

            urlinicio = Url + 'reportes?proyecto='+id_proyect+'&estados='+estatus

            urlfil.current = urlinicio

            setisCharging(true)
            axios.get(urlinicio, {
                headers: {
                    Authorization : token,
                }
            })
            .then(res =>  {
                setisCharging(false)
                traerCanales()
                traerFallas()
                SetData(res.data.data);
                settotalRegistros(res.data.total)
                setrangoRegistros(res.data.from+"-"+res.data.to)
                setfirstpageUrl(res.data.first_page_url)
                setprevpageUrl(res.data.prev_page_url)
                setnextpageUrl(res.data.next_page_url)
                setlaspageUrl(res.data.last_page_url)
            })
            .catch(err => {
                setisCharging(false)
                console.log(err)
                err.response.status === 401 && Navigate("/login")
                })
        }

        const intervalId = setInterval(() => {
            cargarsiempre()
          }, 10000);
          
          return () => clearInterval(intervalId);
    }, [])

    //Métodos de acciones durante uso
    const cargarReportesFiltros = () => {
        var urlfiltrada = Url + 'reportes?proyecto='+id_proyect+'&pdl='
                        +pdlbuscado+'&estados='+estatus+'&canal='+selectcanal+
                        '&colonia='+colonia+'&falla='+falla+'&origen_averia='+origenA+
                        '&fecha='+tipofechaR+'&desde='+fechadesdeR+'&hasta='+fechahastaR

        urlfil.current = urlfiltrada
         
        axios.get(urlfiltrada, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            SetData(res.data.data);
            settotalRegistros(res.data.total)
            setrangoRegistros(res.data.from+"-"+res.data.to)
            setfirstpageUrl(res.data.first_page_url)
            setprevpageUrl(res.data.prev_page_url)
            setnextpageUrl(res.data.next_page_url)
            setlaspageUrl(res.data.last_page_url)
          })
        .catch(err => console.log(err))
    }

    //Flitros
    //Filtro KillKizeo
    const abrirPopKillKizeo = (event) => {
        setAnchorEl(event.currentTarget);
        setshowFilterKillKizeo(true);

        setTimeout(() => {
            refTextKillKizeo.current.focus();
          }, 0);
    }

    const cerrarPopKillKizeo = () => {
        setshowFilterKillKizeo(false);
    }

    const onKeyDownHandlerKillKizeo = (event) => {
        let $KillKizeo = document.getElementById("KillKizeo");
    
        if (event.key === "Enter") {
            if($KillKizeo.value === ""){
                cargarReportesFiltros();
            }else{
                var urlkillkizeo = ""
                if (user.rol === 5) {
                    urlkillkizeo =  Url + 'reportes?proyecto='+id_proyect+'&supervisor=' + user.id
                                 +'&killkizeo='+ $KillKizeo.value
                 }else{
                    urlkillkizeo =  Url + 'reportes?proyecto='+id_proyect+'&killkizeo='
                                 + $KillKizeo.value
                 }

                urlfil.current = urlkillkizeo

                axios.get(urlkillkizeo, {
                    headers: {
                        Authorization : token,
                    }
                })
                .then(res =>  {
                    SetData(res.data.data);
                    settotalRegistros(res.data.total)
                    setbanderaFolio(false)
                    setdisabled(true)
                    cerrarPopKillKizeo()
                  })
                .catch(err => {
                    settotalRegistros(0)
                    console.log(err)
                })
            }
        }
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

        let $PDL = document.getElementById("PDLRep");
    
        if (event.key === "Enter") {
            if($PDL.value === ""){
                cargarReportesFiltros();
            }else{
                var urlactivaPDL = Url + 'reportes?proyecto='+id_proyect+'&pdl='
                                +pdlbuscado+'&estados='+estatus+'&canal='+selectcanal+
                                '&colonia='+colonia+'&falla='+falla+'&origen_averia='+origenA+
                                '&fecha='+tipofechaR+'&desde='+fechadesdeR+'&hasta='+fechahastaR

                urlfil.current = urlactivaPDL

                axios.get(urlactivaPDL, {
                    headers: {
                        Authorization : token,
                    }
                })
                .then(res =>  {
                    SetData(res.data.data);
                    settotalRegistros(res.data.total)
                    setrangoRegistros(res.data.from+"-"+res.data.to)
                    setbanderaPDL(false)
                    if(res.data.data.length !== 0){
                        cerrarPopPDL();
                    }
                  })
                .catch(err => console.log(err))
            }
        }
    }

    //Filtro Colonia
    const abrirPopColonia = (event) => {
        setAnchorEl(event.currentTarget);
        setshowFilterColonia(true);

        setTimeout(() => {
            refTextColonia.current.focus();
          }, 0);
    }

    const cerrarPopColonia = () => {
        setshowFilterColonia(false);
    }

    const handleChangeColonia = (event) => {
        setcolonia(event.target.value)
    }

    const onKeyDownHandlerColonia = (event) => {
    
        if (event.key === "Enter") {
            if(colonia === ""){
                cargarReportesFiltros();
            }else{
                var urlactivaColonia = Url + 'reportes?proyecto='+id_proyect+'&pdl='
                                +pdlbuscado+'&estados='+estatus+'&canal='+selectcanal+
                                '&colonia='+colonia+'&falla='+falla+'&origen_averia='+origenA+
                                '&fecha='+tipofechaR+'&desde='+fechadesdeR+'&hasta='+fechahastaR

                urlfil.current = urlactivaColonia

                axios.get(urlactivaColonia, {
                    headers: {
                        Authorization : token,
                    }
                })
                .then(res =>  {
                    SetData(res.data.data);
                    settotalRegistros(res.data.total)
                    setrangoRegistros(res.data.from+"-"+res.data.to)
                    setbanderaColonia(false)
                    setfirstpageUrl(res.data.first_page_url)
                    setprevpageUrl(res.data.prev_page_url)
                    setnextpageUrl(res.data.next_page_url)
                    setlaspageUrl(res.data.last_page_url)
                    if(res.data.data.length !== 0){
                        cerrarPopColonia();
                    }
                  })
                .catch(err => console.log(err))
            }
        }
    }

    //Filtro Estatus
    const abrirPopEstatus = (event) => {
        setAnchorEl(event.currentTarget);
        setestatus(0)
        setShowFilterEstatus(true);
    }

    const cerrarPopEstatus = () => {
        setShowFilterEstatus(false);
    }

    const handleChangeSelectEstatus = (event) => {
        setestatus(event.target.value)
        estatus=event.target.value

        var urlactivaEstatus = Url + 'reportes?proyecto='+id_proyect+'&pdl='
                            +pdlbuscado+'&estados='+estatus+'&canal='+selectcanal+
                            '&colonia='+colonia+'&falla='+falla+'&origen_averia='+origenA+
                            '&fecha='+tipofechaR+'&desde='+fechadesdeR+'&hasta='+fechahastaR

        urlfil.current = urlactivaEstatus

        axios.get(urlactivaEstatus, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            SetData(res.data.data);
            settotalRegistros(res.data.total)
            setrangoRegistros(res.data.from+"-"+res.data.to)
            setbanderaEstatus(false)
            setfirstpageUrl(res.data.first_page_url)
            setprevpageUrl(res.data.prev_page_url)
            setnextpageUrl(res.data.next_page_url)
            setlaspageUrl(res.data.last_page_url)
            if(res.data.data.length !== 0){
                cerrarPopEstatus();
            }
          })
        .catch(err => console.log(err))
    }

    const limpiarFiltroEstatus = () => {
        setbanderaEstatus(true)
        estatus="TERMINADO,CANCELADO"
        setestatus("TERMINADO,CANCELADO")
        cargarReportesFiltros();
    }

    const revisarfecha0 = (fecha) => {
        if (fecha < 10) {
            return "0"+fecha
        }
        return fecha
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

        var urlactivaCanal = Url + 'reportes?proyecto='+id_proyect+'&pdl='
                                +pdlbuscado+'&estados='+estatus+'&canal='+selectcanal+
                                '&colonia='+colonia+'&falla='+falla+'&origen_averia='+origenA+
                                '&fecha='+tipofechaR+'&desde='+fechadesdeR+'&hasta='+fechahastaR

        urlfil.current = urlactivaCanal

        axios.get(urlactivaCanal, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            SetData(res.data.data);
            settotalRegistros(res.data.total)
            setrangoRegistros(res.data.from+"-"+res.data.to)
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
        cargarReportesFiltros();
    }

    //Filtro Falla
    const abrirPopFalla = (event) => {
        setAnchorEl(event.currentTarget);
        setfalla(0)
        setShowFilterFalla(true);
    }

    const cerrarPopFalla = () => {
        setShowFilterFalla(false);
    }

    const handleChangeSelectFalla = (event) => {
        setfalla(event.target.value)
        falla=event.target.value

        var urlactivaFalla = Url + 'reportes?proyecto='+id_proyect+'&pdl='
                                +pdlbuscado+'&estados='+estatus+'&canal='+selectcanal+
                                '&colonia='+colonia+'&falla='+falla+'&origen_averia='+origenA+
                                '&fecha='+tipofechaR+'&desde='+fechadesdeR+'&hasta='+fechahastaR

        urlfil.current = urlactivaFalla

        axios.get(urlactivaFalla, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            SetData(res.data.data);
            settotalRegistros(res.data.total)
            setrangoRegistros(res.data.from+"-"+res.data.to)
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
        falla=""
        setfalla("")
        cargarReportesFiltros();
    }

    //Filtro Estatus
    const abrirPopOrigenA = (event) => {
        setAnchorEl(event.currentTarget);
        setorigenA(0)
        setshowFilterOrigenA(true);
    }

    const cerrarPopOrigenA = () => {
        setshowFilterOrigenA(false);
    }

    const handleChangeSelectOrigenA = (event) => {
        setorigenA(event.target.value)
        origenA=event.target.value

        var urlactivaOrigenA = Url + 'reportes?proyecto='+id_proyect+'&pdl='
                            +pdlbuscado+'&estados='+estatus+'&canal='+selectcanal+
                            '&colonia='+colonia+'&falla='+falla+'&origen_averia='+origenA+
                            '&fecha='+tipofechaR+'&desde='+fechadesdeR+'&hasta='+fechahastaR

        urlfil.current = urlactivaOrigenA

        axios.get(urlactivaOrigenA, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            SetData(res.data.data);
            settotalRegistros(res.data.total)
            setrangoRegistros(res.data.from+"-"+res.data.to)
            setbanderaOrigenA(false)
            setfirstpageUrl(res.data.first_page_url)
            setprevpageUrl(res.data.prev_page_url)
            setnextpageUrl(res.data.next_page_url)
            setlaspageUrl(res.data.last_page_url)
            if(res.data.data.length !== 0){
                cerrarPopOrigenA();
            }
          })
        .catch(err => console.log(err))
    }

    const limpiarFiltroOrigenA = () => {
        setbanderaOrigenA(true)
        origenA=""
        setorigenA("")
        cargarReportesFiltros();
    }

    //Filtro Fecha Resolución
    const abrirPopFechaR = (event) => {
        setAnchorEl(event.currentTarget);
        setShowFilterFechaR(true);
    }

    const cerrarPopFechaR = () => {
        setShowFilterFechaR(false);
    }

    const filtrarFechaResolucion = () => {
        const desde = (rangofechasR[0].startDate.getFullYear() + "-" + revisarfecha0(rangofechasR[0].startDate.getMonth() + 1)
                        + "-" + revisarfecha0(rangofechasR[0].startDate.getDate()))

        const hasta = (rangofechasR[0].endDate.getFullYear() + "-" + revisarfecha0(rangofechasR[0].endDate.getMonth() + 1)
        + "-" + revisarfecha0(rangofechasR[0].endDate.getDate()))

        fechadesdeR = desde
        fechahastaR = hasta
        tipofechaR = "fecha_resolucion"

        setfechadesdeR(desde)
        setfechastaR(hasta)
        settipoFechaR("fecha_resolucion")

        var urlfechaResolucion = Url + 'reportes?proyecto='+id_proyect+'&pdl='
                                    +pdlbuscado+'&estados='+estatus+'&canal='+selectcanal+
                                    '&colonia='+colonia+'&falla='+falla+'&origen_averia='+origenA+
                                    '&fecha='+tipofechaR+'&desde='+fechadesdeR+'&hasta='+fechahastaR

        urlfil.current = urlfechaResolucion

        axios.get(urlfechaResolucion, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            SetData(res.data.data);
            settotalRegistros(res.data.total)
            setrangoRegistros(res.data.from+"-"+res.data.to)
            setbanderaFechaR(false)
            setfirstpageUrl(res.data.first_page_url)
            setprevpageUrl(res.data.prev_page_url)
            setnextpageUrl(res.data.next_page_url)
            setlaspageUrl(res.data.last_page_url)
            if(res.data.data.length !== 0){
                cerrarPopFechaR();
            }
          })
        .catch(err => console.log(err))
    }

    const limpiarFiltroFechaR = () => {
        fechadesdeR = ""
        fechahastaR = ""
        tipofechaR = ""

        setfechadesdeR("")
        setfechastaR("")
        settipoFechaR("")

        setbanderaFechaR(true)
        cargarReportesFiltros();
    }

    //Filtro Oficio
    const abrirPopOficio = (event) => {
        setAnchorEl(event.currentTarget);
        setShowFilterOficio(true);

        setTimeout(() => {
            refTextOficioRep.current.focus();
          }, 0);
    }

    const cerrarPopOficio = () => {
        setShowFilterOficio(false);
    }

    const onKeyDownHandlerOficio = (event) => {
        let $OficioReporte = document.getElementById("OficioRep");
    
        if (event.key === "Enter") {
            if($OficioReporte.value === ""){
                cargarReportesFiltros();
            }else{

                axios.get(Url + 'reportes/oficio/'+ $OficioReporte.value, {
                    headers: {
                        Authorization : token,
                    }
                })
                .then(res =>  {
                    const data = [
                        res.data
                    ]
                    SetData(data);
                    settotalRegistros(1)
                    setbanderaOficio(false)
                    setdisabled(true)
                    cerrarPopOficio()
                  })
                .catch(err => {
                    settotalRegistros(0)
                    console.log(err)
                })
            }
        }
    }

    //Filtro Num_Ticket
    const abrirPopTicket = (event) => {
        setAnchorEl(event.currentTarget);
        setshowFilterTicket(true);

        setTimeout(() => {
            refTextTicketRep.current.focus();
          }, 0);
    }

    const cerrarPopTicket = () => {
        setshowFilterTicket(false);
    }

    const onKeyDownHandlerTicket = (event) => {
        let $TicketReporte = document.getElementById("TicketRep");
    
        if (event.key === "Enter") {
            if($TicketReporte.value === ""){
                cargarReportesFiltros();
            }else{
                var urlactiva = ""
                if (user.rol === 5) {
                   urlactiva =  Url + 'reportes?proyecto='+id_proyect+'&supervisor=' + user.id
                                +'&num_ticket='+ $TicketReporte.value
                }else{
                    urlactiva =  Url + 'reportes?proyecto='+id_proyect+'&num_ticket='
                                + $TicketReporte.value
                }

                urlfil.current = urlactiva

                axios.get(urlactiva, {
                    headers: {
                        Authorization : token,
                    }
                })
                .then(res =>  {
                    SetData(res.data.data);
                    settotalRegistros(1)
                    setbanderaTicket(false)
                    setdisabled(true)
                    cerrarPopTicket()
                  })
                .catch(err => {
                    settotalRegistros(0)
                    console.log(err)
                })
            }
        }
    }

    //Download Word
    const downloadWord = async (killkizeo_prop, estado_prop, idreporte_prop) => {
        
        //setisCharging(true)

        if (estado_prop === "TERMINADO") {

            const UrlKillKizeo = Url + "reportes/word/create?proyecto="+id_proyect+"&killkizeo=" + killkizeo_prop
            const response =  await axios.get(UrlKillKizeo , {
                headers: {
                    Authorization : token,
                },
                responseType: 'blob'
            })
            .catch(err => {
                setisCharging(false)
                console.log(err)
            });
    
            const url = window.URL.createObjectURL(response.data);
    
            const link = document.createElement('a');
            link.href = url;
    
            link.download = 'reporte_'+killkizeo_prop+'.docx' // Cambia 'nombre_del_archivo.pdf' por el nombre que desees
    
            setisCharging(false)
    
            // Simula un clic en el enlace para descargar el archivo
            document.body.appendChild(link);
            link.click();
    
            // Elimina el enlace después de la descarga
            document.body.removeChild(link);
        } else {
            const UrlKillKizeo = Url + "reportes/pdf/download?proyecto="+id_proyect+'&fotografico=true'+
            "&killkizeo="+ killkizeo_prop

            const response =  await axios.get(UrlKillKizeo , {
                headers: {
                    Authorization : token,
                },
                responseType: 'blob'
            })
            .catch(err => {
                setisCharging(false)
                console.log(err)
            });
    
            const url = window.URL.createObjectURL(response.data);
    
            const link = document.createElement('a');
            link.href = url;
    
            link.download = 'reporte_'+killkizeo_prop+'.pdf' // Cambia 'nombre_del_archivo.pdf' por el nombre que desees
    
            setisCharging(false)
    
            // Simula un clic en el enlace para descargar el archivo
            document.body.appendChild(link);
            link.click();
    
            // Elimina el enlace después de la descarga
            document.body.removeChild(link);
        }
    }

    //Pops de Info extra
    const abrirPopColumnas = (event) => {
        setvalueTabMore("1")
        setAnchorEl(event.currentTarget);
        setshowColumns(true)
    }

    const cerrarPopColumnas = (event) => {
        setshowColumns(false)
    }

    //Paginado
    const firstpage = () => {
        setisCharging(true)
        urlfil.current = firstpageUrl

        axios.get(firstpageUrl, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            setisCharging(false)
            SetData(res.data.data);
            settotalRegistros(res.data.total)
            setrangoRegistros(res.data.from+"-"+res.data.to)
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
        urlfil.current = prevpageUrl

        axios.get(prevpageUrl, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            setisCharging(false)
            SetData(res.data.data);
            settotalRegistros(res.data.total)
            setrangoRegistros(res.data.from+"-"+res.data.to)
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
        urlfil.current = nextpageUrl

        axios.get(nextpageUrl, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            setisCharging(false)
            SetData(res.data.data);
            settotalRegistros(res.data.total)
            setrangoRegistros(res.data.from+"-"+res.data.to)
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
        urlfil.current = lastpageUrl

        axios.get(lastpageUrl, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            setisCharging(false)
            SetData(res.data.data);
            settotalRegistros(res.data.total)
            setrangoRegistros(res.data.from+"-"+res.data.to)
            setfirstpageUrl(res.data.first_page_url)
            setprevpageUrl(res.data.prev_page_url)
            setnextpageUrl(res.data.next_page_url)
            setlaspageUrl(res.data.last_page_url)
        })
        .catch(err => {
            setisCharging(false)
            console.log(err)})
    }

    //Aciones extras
    const handleChangeSwitchFiltros = (event) => {
        setStateFiltros((prevFiltros) => {
            const updatedFiltros = {
              ...prevFiltros,
              [event.target.name]: event.target.checked,
            };

            localStorage.setItem('prefiltrado', JSON.stringify(updatedFiltros));
        
            return updatedFiltros;
        });
    };

    const showall = () => {
        setStateFiltros((prevFiltros) => {
            const updatedFiltrosAll = {
              ...prevFiltros,
            Canal: true,
            Oficio: true,
            NumTicket: true
          };

          localStorage.setItem('prefiltrado', JSON.stringify(updatedFiltrosAll));

          return updatedFiltrosAll;
        });
    }

    const hideall = () => {
        setStateFiltros({
            Canal: false,
            Oficio: false,
            NumTicket: false
          });
    }

    //Styles
    const styleCell = {
        color: 'white',
        textAlign: "center",
        backgroundColor: "#237f65",
    }

    const styleCellRow = {
        color: 'black',
        textAlign: 'center',
    }

    const stylerow = (estatus) => {
        switch (estatus) {
    
            case "TERMINADO":
                const styleCellRowTerminado = {
                    color: 'white',
                    backgroundColor: "#28B463",
                }
                return styleCellRowTerminado;

            case "CANCELADO":
                const styleCellRowRechazado = {
                    color: 'black',
                    backgroundColor: "#D1D4D8",
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
        
    return (
        <div className={classNames("TableReportes")}>
            <TableContainer>
                <Table stickyHeader={!openPanel} size='small'                             
                        sx={{
                            "& .MuiTableRow-root:hover": {
                                backgroundColor: "#A2D9CE"
                                }
                            }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={styleCell}>
                                <div style={{ display: 'flex', justifyContent:'center', alignItems:'center'}}>
                                    Folio Reporte
                                        <div>
                                            {banderaFolio ?
                                                <IconButton onClick={abrirPopKillKizeo}
                                                disabled={disabled} 
                                                sx={openPanel ? {position:'inherit'}:{position:'relative', color:'white'}}>
                                                    <FilterAltIcon />
                                                </IconButton>
                                                :
                                                <IconButton sx={openPanel ? {position:'inherit'}:{position:'relative', color:'white'}}
                                                onClick={() => {setbanderaFolio(true)
                                                                cargarReportesFiltros()
                                                                setdisabled(false)}}
                                                >
                                                    <FilterAltOffIcon/>
                                                </IconButton>
                                            }
                                        </div>
                                        <Popover
                                            open={showFilterId}
                                            anchorEl={anchorEl}
                                            onClose={cerrarPopKillKizeo}
                                            sx={{width:260}}
                                            anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                            }}
                                            >
                                            <Box p={1} component="div">
                                                <TextField id="KillKizeo" sx={{width:'100%'}} variant="standard" 
                                                inputRef={refTextKillKizeo} autoComplete='off'
                                                onKeyDownCapture={onKeyDownHandlerKillKizeo}
                                                />
                                            </Box>
                                        </Popover>
                                </div>
                            </TableCell>
                            <TableCell sx={styleCell}>
                                <div style={{ display: 'flex', justifyContent:'center', alignItems:'center'}}>
                                    PDL  
                                        <div>
                                            {banderaPDL ?
                                                <IconButton onClick={abrirPopPDL} 
                                                disabled={disabled}
                                                sx={openPanel ? {position:'relative'}:{position:'relative', color:'white'}}>
                                                    <FilterAltIcon />
                                                </IconButton>
                                                :
                                                <IconButton sx={openPanel ? {position:'inherit'}:{position:'relative', color:'white'}}
                                                onClick={() => {setbanderaPDL(true)
                                                                pdlbuscado = ""
                                                                setpdlbuscado("")
                                                                cargarReportesFiltros()
                                                            }}
                                                >
                                                    <FilterAltOffIcon/>
                                                </IconButton>
                                            }
                                            <Popover
                                                open={showFilterPDL}
                                                id='filter_pdl'
                                                anchorEl={anchorEl}
                                                onClose={cerrarPopPDL}
                                                sx={{width:350}}
                                                anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                                }}
                                                >
                                                <Box p={1} component="div">
                                                    <TextField id="PDLRep" sx={{width:'100%'}} variant="standard" 
                                                    inputRef={refTextPDL} autoComplete='off'
                                                    onKeyDownCapture={onKeyDownHandlerPDL}
                                                    onChange={handleChangePDL}
                                                    />
                                                </Box>
                                            </Popover>
                                        </div> 
                                </div>
                            </TableCell>
                            <TableCell sx={styleCell}>
                                <div style={{ display: 'flex', justifyContent:'center', alignItems:'center'}}>
                                    Colonia 
                                        <div>
                                            {banderaColonia ?
                                                <IconButton onClick={abrirPopColonia} 
                                                disabled={disabled}
                                                sx={openPanel ? {position:'relative'}:{position:'relative', color:'white'}}>
                                                    <FilterAltIcon />
                                                </IconButton>
                                                :
                                                <IconButton sx={openPanel ? {position:'inherit'}:{position:'relative', color:'white'}}
                                                onClick={() => {setbanderaColonia(true)
                                                                colonia = ""
                                                                setcolonia("")
                                                                cargarReportesFiltros()
                                                            }}
                                                >
                                                    <FilterAltOffIcon/>
                                                </IconButton>
                                            }
                                            <Popover
                                                open={showFilterColonia}
                                                id='filter_pdl'
                                                anchorEl={anchorEl}
                                                onClose={cerrarPopColonia}
                                                sx={{width:650}}
                                                anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                                }}
                                                >
                                                <Box p={1} component="div">
                                                    <TextField sx={{width:'100%'}} variant="standard" 
                                                    inputRef={refTextColonia} autoComplete='off'
                                                    onKeyDownCapture={onKeyDownHandlerColonia}
                                                    onChange={handleChangeColonia}
                                                    />
                                                </Box>
                                            </Popover>
                                        </div> 
                                </div>
                            </TableCell>
                            <TableCell sx={styleCell}>                                
                            <div style={{ display: 'flex', justifyContent:'center', alignItems:'center'}}>
                                    Estatus
                                    {banderaEstatus ?
                                    <IconButton onClick={abrirPopEstatus} sx={{color:'white'}}
                                        disabled={disabled}>
                                        <FilterAltIcon/>
                                    </IconButton>
                                    :
                                    <IconButton sx={{color:'white'}}
                                                onClick={limpiarFiltroEstatus}>
                                        <FilterAltOffIcon/>
                                    </IconButton>
                                    }
                                    <Popover
                                        open={showFilterEstatus}
                                        anchorEl={anchorEl}
                                        onClose={cerrarPopEstatus}
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
                                                id="select-estado"
                                                value={estatus}
                                                onChange={handleChangeSelectEstatus}
                                                MenuProps={MenuPropsStatus}
                                                variant="standard">
                                                <MenuItem value={0} disabled>Seleccione</MenuItem>
                                                <MenuItem value={"TERMINADO"}>TERMINADO</MenuItem>
                                                <MenuItem value={"CANCELADO"}>CANCELADO</MenuItem>
                                            </Select>
                                        </Box>
                                    </Popover>
                                </div>
                            </TableCell>
                            <TableCell sx={{...styleCell, width:"10%"}}>Otros Reportes Resueltos</TableCell>
                            {stateFiltros.Canal &&
                            <TableCell sx={styleCell}>
                                <div style={{ display: 'flex', justifyContent:'center', alignItems:'center'}}>
                                Canal  
                                {banderaCanal ?
                                    <IconButton onClick={abrirPopCanal} sx={{color:'white'}}
                                        disabled={disabled}>
                                        <FilterAltIcon/>
                                    </IconButton>
                                    :
                                    <IconButton sx={{color:'white'}} disabled={disabled}
                                                onClick={limpiarFiltroCanal}
                                                >
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
                            }
                            <TableCell sx={styleCell}>
                                <div style={{ display: 'flex', justifyContent:'center', alignItems:'center'}}>
                                Falla
                                {banderaFalla ?
                                    <IconButton onClick={abrirPopFalla} sx={{color:'white'}}
                                        disabled={disabled}>
                                        <FilterAltIcon/>
                                    </IconButton>
                                    :
                                    <IconButton sx={{color:'white'}} disabled={disabled}
                                                onClick={limpiarFiltroFalla}
                                                >
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
                                                id="select-canal"
                                                value={falla}
                                                onChange={handleChangeSelectFalla}
                                                MenuProps={MenuProps}
                                                variant="standard">
                                                <MenuItem value={0} disabled>Seleccione</MenuItem>
                                                {fallas.map((fallam, index) => (
                                                    <MenuItem key={index} value={fallam.id}>{fallam.nombre}</MenuItem>
                                                ))}
                                            </Select>
                                        </Box>
                                    </Popover> 
                                </div>
                            </TableCell>
                            <TableCell sx={styleCell}>                                
                            <div style={{ display: 'flex', justifyContent:'center', alignItems:'center'}}>
                                    Origen de Averia
                                    {banderaOrigenA ?
                                    <IconButton onClick={abrirPopOrigenA} sx={{color:'white'}}
                                        disabled={disabled}>
                                        <FilterAltIcon/>
                                    </IconButton>
                                    :
                                    <IconButton sx={{color:'white'}}
                                                onClick={limpiarFiltroOrigenA}>
                                        <FilterAltOffIcon/>
                                    </IconButton>
                                    }
                                    <Popover
                                        open={showFilterOrigenA}
                                        anchorEl={anchorEl}
                                        onClose={cerrarPopOrigenA}
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
                                                id="select-estado"
                                                value={origenA}
                                                onChange={handleChangeSelectOrigenA}
                                                MenuProps={MenuPropsStatus}
                                                variant="standard">
                                                <MenuItem value={0} disabled>Seleccione</MenuItem>
                                                <MenuItem value={"ACCIDENTE AUTOMOVILÍSTICO"}>ACCIDENTE AUTOMOVILÍSTICO</MenuItem>
                                                <MenuItem value={"CAIDA DE TENSION"}>CAIDA DE TENSION</MenuItem>
                                                <MenuItem value={"CONEXIONES DEFICIENTES"}>CONEXIONES DEFICIENTES</MenuItem>
                                                <MenuItem value={"CORTOCIRCUITO"}>CORTOCIRCUITO</MenuItem>
                                                <MenuItem value={"DAÑOS POR TERCEROS"}>DAÑOS POR TERCEROS</MenuItem>
                                                <MenuItem value={"DEFECTO DE ALGÚN MATERIAL"}>DEFECTO DE ALGÚN MATERIAL</MenuItem>
                                                <MenuItem value={"DETERIORO DE ALGÚN MATERIAL"}>DETERIORO DE ALGÚN MATERIAL</MenuItem>
                                                <MenuItem value={"MALA FIJACIÓN"}>MALA FIJACIÓN</MenuItem>
                                                <MenuItem value={"PRESUNTO BANDALISMO"}>PRESUNTO BANDALISMO</MenuItem>
                                                <MenuItem value={"SOBRECARGAS DE CIRCUITO"}>SOBRECARGAS DE CIRCUITO</MenuItem>
                                                <MenuItem value={"OTROS"}>OTROS</MenuItem>
                                            </Select>
                                        </Box>
                                    </Popover>
                                </div>
                            </TableCell>
                            <TableCell sx={styleCell}>
                            <div style={{ display: 'flex', justifyContent:'center', alignItems:'center'}}>
                                    Fecha Resolucion
                                    {banderaFechaR ?
                                    <IconButton onClick={abrirPopFechaR} sx={{color:'white'}}
                                        disabled={disabled}>
                                        <FilterAltIcon/>
                                    </IconButton>
                                    :
                                    <IconButton sx={{color:'white'}}
                                                onClick={limpiarFiltroFechaR}>
                                        <FilterAltOffIcon/>
                                    </IconButton>
                                    }
                                    <Popover
                                        open={showFilterFechaR}
                                        anchorEl={anchorEl}
                                        onClose={cerrarPopFechaR}
                                        anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                        }}
                                        >
                                        <Box p={1} component="div">
                                            <DateRangePicker
                                                onChange={item => setrangofechasR([item.selection])}
                                                showSelectionPreview={true}
                                                months={1}
                                                ranges={rangofechasR}
                                                direction="horizontal"
                                                />;
                                            <Button onClick={filtrarFechaResolucion}>OK</Button>
                                        </Box>
                                    </Popover>
                                </div>
                            </TableCell>
                            {/*{(user.rol !== 5 && user.rol !==6) &&
                            }*/}
                            {stateFiltros.Oficio &&
                            <TableCell sx={styleCell}>
                                <div style={{ display: 'flex', justifyContent:'center', alignItems:'center'}}>
                                    Oficio 
                                        <div>
                                            {banderaOficio ?
                                                <IconButton onClick={abrirPopOficio} 
                                                disabled={true}
                                                sx={openPanel ? {position:'relative'}:{position:'relative', color:'white'}}>
                                                    <FilterAltIcon />
                                                </IconButton>
                                                :
                                                <IconButton sx={openPanel ? {position:'inherit'}:{position:'relative', color:'white'}}
                                                onClick={() => {setbanderaOficio(true)
                                                                cargarReportesFiltros()
                                                                setdisabled(false)}}
                                                >
                                                    <FilterAltOffIcon/>
                                                </IconButton>
                                            }
                                            <Popover
                                                open={showFilterOficio}
                                                id='filter_oficio'
                                                anchorEl={anchorEl}
                                                onClose={cerrarPopOficio}
                                                //sx={{width:350}}
                                                anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                                }}
                                                >
                                                <Box p={1} component="div">
                                                    <TextField id="OficioRep" sx={{width:'100%'}} variant="standard" 
                                                    inputRef={refTextOficioRep} autoComplete='off'
                                                    onKeyDownCapture={onKeyDownHandlerOficio}
                                                    />
                                                </Box>
                                            </Popover>
                                        </div>  
                                </div>
                            </TableCell>
                            }
                            {stateFiltros.NumTicket &&
                            <TableCell sx={styleCell}>
                                <div style={{ display: 'flex', justifyContent:'center', alignItems:'center'}}>
                                    No. Ticket 
                                        <div>
                                            {banderaTicket ?
                                                <IconButton onClick={abrirPopTicket} 
                                                disabled={disabled}
                                                sx={openPanel ? {position:'relative'}:{position:'relative', color:'white'}}>
                                                    <FilterAltIcon />
                                                </IconButton>
                                                :
                                                <IconButton sx={openPanel ? {position:'inherit'}:{position:'relative', color:'white'}}
                                                onClick={() => {setbanderaTicket(true)
                                                                cargarReportesFiltros()
                                                                setdisabled(false)}}
                                                >
                                                    <FilterAltOffIcon/>
                                                </IconButton>
                                            }
                                            <Popover
                                                open={showFilterTicket}
                                                id='filter_ticket'
                                                anchorEl={anchorEl}
                                                onClose={cerrarPopTicket}
                                                //sx={{width:1400}}
                                                anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                                }}
                                                >
                                                <Box p={1} component="div">
                                                    <TextField id="TicketRep" sx={{width:'100%'}} variant="standard" 
                                                    inputRef={refTextTicketRep} autoComplete='off'
                                                    onKeyDownCapture={onKeyDownHandlerTicket}
                                                    />
                                                </Box>
                                            </Popover>
                                        </div>  
                                </div>
                            </TableCell>
                            }
                            <TableCell sx={styleCell}>Descarga</TableCell>
                            <TableCell sx={styleCell}>
                                <IconButton sx={{ml:-4, color:"white"}} disabled={disabled}
                                            onClick={abrirPopColumnas}>
                                    <MoreVertIcon/>
                                </IconButton>

                                <Popover
                                        id="Filtros"
                                        open={showColumns}
                                        anchorEl={anchorEl}
                                        onClose={cerrarPopColumnas}
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
                                        <TabContext value={valueTabMore}>
                                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                            <TabList aria-label="lab API tabs example">
                                                <Tab label="Filtros" value="1" sx={{width:"100%"}} disabled/>
                                            </TabList>
                                            <TabPanel value="1" sx={{p:0}}>
                                                <Box sx={{p:1, width:"100%", maxHeight: 150, overflow:"auto"}}>
                                                    <div style={{display:"flex", alignItems:"center",
                                                        justifyContent:"space-between"}}>
                                                        <label style={{width:20, fontSize:13}}> Canal:</label>
                                                        <Switch onChange={handleChangeSwitchFiltros}
                                                        checked={stateFiltros.Canal} size='small'
                                                        name='Canal'/>
                                                    </div>
                                                    <div style={{display:"flex", alignItems:"center",
                                                        justifyContent:"space-between"}}>
                                                        <label style={{width:20, fontSize:13}}>Oficio:</label>
                                                        <Switch onChange={handleChangeSwitchFiltros}
                                                        checked={stateFiltros.Oficio} size='small'
                                                        name='Oficio'/>
                                                    </div>
                                                    <div style={{display:"flex", alignItems:"center",
                                                        justifyContent:"space-between"}}>
                                                        <label style={{width:"50%", fontSize:13}}>Num Ticket:</label>
                                                        <Switch onChange={handleChangeSwitchFiltros}
                                                        checked={stateFiltros.NumTicket} size='small'
                                                        name='NumTicket'/>
                                                    </div>
                                                    <div style={{display:"flex", justifyContent:"space-between"}}>
                                                        <Button onClick={showall}>TODOS</Button>
                                                        <Button onClick={hideall}>NINGUNO</Button> 
                                                    </div>                                           
                                                </Box>
                                            </TabPanel>
                                        </Box>
                                        </TabContext>
                                    </Popover>
                            </TableCell>
                            
                        </TableRow>
                    </TableHead>
                    {totalRegistros >= 1 &&
                    <TableBody >
                        {data.map((reporte, index) => (
                            <TableRow key={index}>
                                <TableCell sx={styleCellRow}>{reporte.killkizeo||reporte.id}</TableCell>
                                <TableCell sx={styleCellRow}>{reporte.luminaria.pdl_id}</TableCell>
                                <TableCell sx={{...styleCellRow, width:"15%"}}>{reporte.luminaria.colonia||"--"}</TableCell>
                                <TableCell sx={styleCellRow}>
                                    <Chip label={reporte.estado} 
                                    sx={[stylerow(reporte.estado), 
                                    {width:90, borderRadius:1.5, fontSize:"0.65rem", height:20, fontWeight:"bold",
                                    paddingTop:"1px"
                                    }]} 
                                    size="small" />
                                </TableCell>
                                <TableCell sx={{...styleCellRow, width:"12.5%", whiteSpace: "normal", wordBreak: "break-all"}}>
                                    {reporte.reportes_hijos || "N/A"}
                                </TableCell>
                                {stateFiltros.Canal &&
                                <TableCell sx={styleCellRow}>
                                    {reporte.reporte_eventos[0].canal.nombre}
                                </TableCell>
                                }
                                <TableCell sx={styleCellRow}>{reporte.reporte_eventos[0].falla.nombre||"--"}</TableCell>
                                <TableCell sx={{...styleCellRow, width:"10%"}}>{reporte.origen_averia||"N/A"}</TableCell>
                                <TableCell sx={styleCellRow}>{changeDate(reporte.fecha_resolucion)||"N/A"}</TableCell>
                                {stateFiltros.Oficio &&
                                <TableCell sx={styleCellRow}>
                                    {reporte.oficio_proyecto||"---"}
                                </TableCell>
                                }
                                {stateFiltros.NumTicket &&
                                <TableCell sx={styleCellRow}>
                                    {reporte.num_ticket||"---"}
                                </TableCell>
                                }
                                <TableCell sx={styleCellRow}>
                                    {reporte.estado === "TERMINADO" ?
                                        <>
                                        {reporte.reporte_padre === null ?
                                            <IconButton color="primary" sx={{border: "1px solid"}} size="small"
                                            onClick={() => downloadWord(reporte.killkizeo, reporte.estado, reporte.id)}>
                                                <FontAwesomeIcon icon={faFileWord} fontSize={"15px"}/>
                                            </IconButton>
                                            :
                                            "Se terminó con reporte: " + reporte.reporte_padre
                                        }
                                        </>
                                        :
                                            <IconButton color="error" sx={{border: "1px solid"}} size="small"
                                            onClick={() => downloadWord(reporte.killkizeo, reporte.estado, reporte.id)}>
                                                <PictureAsPdf fontSize={"15px"}/>
                                            </IconButton>
                                    }
                                </TableCell>
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
            
            {!openPanel &&
                <>
                <footer className={classNames("footerTableReportes")}>
                    Total de Registros: {totalRegistros}

                    <div>
                        {totalRegistros > 50 && <>De: {rangoRegistros}</>}

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
            }
        { isCharging && <LoaderIndicator /> }
        </div>
    );
}

export default TableReportesAyuntamiento;