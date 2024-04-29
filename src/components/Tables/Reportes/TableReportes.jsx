//React
import React, { useEffect, useState, useRef } from "react";
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';
import { useNavigate } from "react-router-dom";

import axios from 'axios'

//Material UI
import { Box, LinearProgress, MenuItem, Modal, Select, Switch } from '@mui/material';

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
import Tooltip from '@mui/material/Tooltip';
import { makeStyles } from "@material-ui/core";

import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

//Icons Material UI
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import WarningIcon from '@mui/icons-material/Warning';
import DiscFullIcon from '@mui/icons-material/DiscFull';
import GroupsIcon from '@mui/icons-material/Groups';

import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import ExplicitIcon from '@mui/icons-material/Explicit';

//Componentes y elementos propios
import classNames from "classnames";
import './TableReportes.scss'
import Table0 from '../../../assets/Table0.jpg'

import Panel from '../../Panel Lateral/Panel';
import Reporte from '../Reportes/Reportes/Reporte';
import Comentarios from "../../Comentarios/Comentario";
import Luminaria from "../../Luminaria/Luminaria"

import { Url } from '../../../constants/global';
import LoaderIndicator from '../../../layout/LoaderIndicator/LoaderIndicator';

import { green, orange, red, yellow } from '@mui/material/colors';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileWord } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

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

    const useStyles = makeStyles(theme => ({
        root: {
        "& .MuiPaper-root": {
            boxShadow: '10px 10px 5px -4px rgba(0,0,0,0.26)'
        }
        }
    }));

const TableReportes = () => {

    const [value, setValue] = React.useState('InfoReportes');
    const handleChange = (event, newValue) => {
        setValue(newValue);
      };

    const [valueTabMore, setvalueTabMore] = React.useState('1');

    const handleChangeTabMore = (event, newValue) => {
        setvalueTabMore(newValue);
    };
    
    const [rangofechas, setrangofechas] = useState([
        {
        startDate: new Date(),
        endDate: addDays(new Date(), 1),
        key: 'selection'
        }
    ]);

    const [rangofechasA, setrangofechasA] = useState([
        {
        startDate: new Date(),
        endDate: addDays(new Date(), 1),
        key: 'selection'
        }
    ]);

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
    const refTextColonia = useRef(null)
    const refTextPDL = useRef(null);

    const [disabled, setdisabled] = useState(false)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isCharging, setisCharging ] = useState(false);

    const [openPanel, setopenPanel] = useState(false)
    const [Reporteporid, setReporteporid] = useState([])

    const [showFilterId, setshowFilterKillKizeo] = useState(false)
    const [showFilterOficio, setShowFilterOficio] = useState(false)
    const [showFilterTicket, setshowFilterTicket] = useState(false)
    const [showFilterColonia, setshowFilterColonia] = useState(false)
    const [showFilterPDL, setShowFilterPDL] = useState(false)
    const [showFilterEstatus, setShowFilterEstatus] = useState(false)
    const [showFilterMotivo, setShowFilterMotivo] = useState(false)
    const [showFilterCuadrilla, setshowFilterCuadrilla] = useState(false)
    const [showFilterCanal, setShowFilterCanal] = useState(false)
    const [showFilterFalla, setShowFilterFalla] = useState(false)
    const [showFilterOrigenA, setshowFilterOrigenA] = useState(false)
    const [showFilterFechaC, setShowFilterFechaC] = useState(false)
    const [showFilterFechaA, setShowFilterFechaA] = useState(false)
    const [showFilterFechaR, setShowFilterFechaR] = useState(false)
    const [showcuadrilla, setshowcuadrilla] = useState(false)

    const [showColumns, setshowColumns]  = useState(false)

    const [stateFiltros, setStateFiltros] = React.useState({
        Colonia: false,
        Cuadrilla: true,
        Canal: true,
        Falla: false,
        OrigenA: false,
        FechaC: true,
        FechaAt: true,
        FechaR: true, 
        Oficio: false,
        NumTicket: false
      });

    const [canales, setCanales] = useState([])
    const [fallas, setFallas] = useState([])
    const [cuadrilla, setcuadrilla] = React.useState([])
    const [datacuadrilla, setdatacuadrilla] = useState(null)

    const [banderaFolio, setbanderaFolio] = useState(true)
    const [banderaOficio, setbanderaOficio] = useState(true)
    const [banderaTicket, setbanderaTicket] = useState(true)
    const [banderaColonia, setbanderaColonia] = useState(true)
    const [banderaPDL, setbanderaPDL] = useState(true)
    const [banderaEstatus, setbanderaEstatus] = useState(true)
    const [banderaMotivo, setbanderaMotivo] = useState(true)
    const [banderaCuadrilla, setbanderaCuadrilla] = useState(true)
    const [banderaCanal, setbanderaCanal] = useState(true)
    const [banderaFalla, setbanderaFalla] = useState(true)
    const [banderaOrigenA, setbanderaOrigenA] = useState(true)
    const [banderaFechaC, setbanderaFechaC] = useState(true)    
    const [banderaFechaA, setbanderaFechaA] = useState(true)
    const [banderaFechaR, setbanderaFechaR] = useState(true)

    const [totalRegistros, settotalRegistros] = useState(0)
    const [rangoRegistros, setrangoRegistros] = useState("")
    const [firstpageUrl, setfirstpageUrl] = useState("")
    const [prevpageUrl, setprevpageUrl] = useState("")
    const [nextpageUrl, setnextpageUrl] = useState("")
    const [lastpageUrl, setlaspageUrl] = useState("")

    let [selectcanal, setselectcanal] = React.useState("");
    let [estatus, setestatus] = useState("")
    let [selectmotivo, setselectmotivo] = useState("")
    let [colonia, setcolonia] = useState("")
    let [pdlbuscado, setpdlbuscado] = useState("")
    let [selectcuadrilla, setselectcuadrilla] = useState("")
    let [selectfalla, setselectfalla] = useState("")
    let [selectOrigenA, setselectOrigenA] = useState("")
    let [fechadesdeC, setfechadesdeC] = useState("")
    let [fechahastaC, setfechastaC] = useState("")
    let [fechadesdeA, setfechadesdeA] = useState("")
    let [fechahastaA, setfechastaA] = useState("")
    let [fechadesdeR, setfechadesdeR] = useState("")
    let [fechahastaR, setfechastaR] = useState("")
    let [tipofechaC, settipoFechaC] = useState('')
    let [tipofechaA, settipoFechaA] = useState('')
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

    const cambiar = (estatus) => {
        let nuevo = estatus

        if (estatus === "CREADO") {
            nuevo = "NUEVO"
        }else{
            nuevo = estatus
        }

        return nuevo
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

            var urlinicio = Url + 'reportes?proyecto='+id_proyect

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
          }, 30000);
          
          return () => clearInterval(intervalId);
    }, [])

    //Métodos de acciones durante uso
    const cargarReportesFiltros = () => {
        var urlfiltrada = Url + 'reportes?proyecto='+id_proyect+'&supervisor=&pdl='
                            +pdlbuscado+'&estados='+estatus+'&canal='+selectcanal+
                            '&colonia='+colonia+'&falla='+selectfalla+'&origen_averia='+selectOrigenA+
                            '&fecha='+(tipofechaC+","+tipofechaA+","+tipofechaR)
                            +'&desde='+(fechadesdeC+","+fechadesdeA+","+fechadesdeR)
                            +'&hasta='+(fechahastaC+","+fechahastaA+","+fechahastaR)
                            +'&responsables=' + selectcuadrilla+"&motivo_incompleto="+selectmotivo

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

    const abrirPanel = (reporte) => {
        setdisabled(true)
        setValue("InfoReportes")

        setReporteporid(reporte)
        setopenPanel(true);
    }

    const abrirPanelUrgente = async (reporte_id) => {
        setValue("InfoReportes")

        await axios.get(Url + "reportes/" + reporte_id, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            setReporteporid(res.data);
        })
        .catch(err => console.log(err))

        setopenPanel(true);
    }

    const cerrarPanel = () => {
        setopenPanel(false);
        setdisabled(false)
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
                var urlkillkizeo = Url + 'reportes?proyecto='+id_proyect+'&killkizeo='
                                    + $KillKizeo.value

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
                var urlactivaColonia = Url + 'reportes?proyecto='+id_proyect+'&supervisor=&pdl='
                                    +pdlbuscado+'&estados='+estatus+'&canal='+selectcanal+
                                    '&colonia='+colonia+'&falla='+selectfalla+'&origen_averia='+selectOrigenA+
                                    '&fecha='+(tipofechaC+","+tipofechaA+","+tipofechaR)
                                    +'&desde='+(fechadesdeC+","+fechadesdeA+","+fechadesdeR)
                                    +'&hasta='+(fechahastaC+","+fechahastaA+","+fechahastaR)
                                    +'&responsables=' + selectcuadrilla+"&motivo_incompleto="+selectmotivo

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
                    setfirstpageUrl(res.data.first_page_url)
                    setprevpageUrl(res.data.prev_page_url)
                    setnextpageUrl(res.data.next_page_url)
                    setlaspageUrl(res.data.last_page_url)
                    setbanderaColonia(false)
                    if(res.data.data.length !== 0){
                        cerrarPopColonia();
                    }
                  })
                .catch(err => console.log(err))
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
                var urlactivaPDL = Url + 'reportes?proyecto='+id_proyect+'&supervisor=&pdl='
                                    +pdlbuscado+'&estados='+estatus+'&canal='+selectcanal+
                                    '&colonia='+colonia+'&falla='+selectfalla+'&origen_averia='+selectOrigenA+
                                    '&fecha='+(tipofechaC+","+tipofechaA+","+tipofechaR)
                                    +'&desde='+(fechadesdeC+","+fechadesdeA+","+fechadesdeR)
                                    +'&hasta='+(fechahastaC+","+fechahastaA+","+fechahastaR)
                                    +'&responsables=' + selectcuadrilla+"&motivo_incompleto="+selectmotivo

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

        var urlactivaEstatus = Url + 'reportes?proyecto='+id_proyect+'&supervisor=&pdl='
                            +pdlbuscado+'&estados='+estatus+'&canal='+selectcanal+
                            '&colonia='+colonia+'&falla='+selectfalla+'&origen_averia='+selectOrigenA+
                            '&fecha='+(tipofechaC+","+tipofechaA+","+tipofechaR)
                            +'&desde='+(fechadesdeC+","+fechadesdeA+","+fechadesdeR)
                            +'&hasta='+(fechahastaC+","+fechahastaA+","+fechahastaR)
                            +'&responsables=' + selectcuadrilla+"&motivo_incompleto="+selectmotivo

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
        if (estatus === "INCOMPLETO") {
            setbanderaMotivo(true)
            selectmotivo=""
            setselectmotivo("")
        }

        setbanderaEstatus(true)
        estatus=""
        setestatus("")
        cargarReportesFiltros();
    }

    //Filtro Motivo
    const abrirPopMotivo = (event) => {
        setAnchorEl(event.currentTarget);
        setselectmotivo(0)
        setShowFilterMotivo(true);
    }

    const cerrarPopMotivo = () => {
        setShowFilterMotivo(false);
    }

    const handleChangeMotivo = (event) => {        
        setselectmotivo(event.target.value)
        selectmotivo=event.target.value

        var urlactivaMotivo = Url + 'reportes?proyecto='+id_proyect+'&supervisor=&pdl='
                            +pdlbuscado+'&estados='+estatus+'&canal='+selectcanal+
                            '&colonia='+colonia+'&falla='+selectfalla+'&origen_averia='+selectOrigenA+
                            '&fecha='+(tipofechaC+","+tipofechaA+","+tipofechaR)
                            +'&desde='+(fechadesdeC+","+fechadesdeA+","+fechadesdeR)
                            +'&hasta='+(fechahastaC+","+fechahastaA+","+fechahastaR)
                            +'&responsables=' + selectcuadrilla+"&motivo_incompleto="+selectmotivo

        urlfil.current = urlactivaMotivo

        axios.get(urlactivaMotivo, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            SetData(res.data.data);
            settotalRegistros(res.data.total)
            setrangoRegistros(res.data.from+"-"+res.data.to)
            setbanderaMotivo(false)
            setfirstpageUrl(res.data.first_page_url)
            setprevpageUrl(res.data.prev_page_url)
            setnextpageUrl(res.data.next_page_url)
            setlaspageUrl(res.data.last_page_url)
            if(res.data.data.length !== 0){
                cerrarPopMotivo();
            }
        })
        .catch(err => console.log(err))
    }

    const limpiarFiltroMotivo = () => {
        setbanderaMotivo(true)
        selectmotivo=""
        setselectmotivo("")
        cargarReportesFiltros();
    }

    //Filtro Cuadrilla
    const abrirPopCuadrillaFiltro = (event) => {
        setAnchorEl(event.currentTarget);
        setselectcuadrilla(0)

        var urlgerente = ""
        if (user.rol === 5) {
            urlgerente =  Url + 'users?proyecto='+id_proyect+'&roles=6&supervisor='+user.id
        }else{
            urlgerente =  Url + 'users?proyecto='+id_proyect+'&roles=6'
        }
        
        axios.get(urlgerente, {
            headers: {
                Authorization : token,
            }
            })
            .then(res =>  {
                setcuadrilla(res.data)
            })
            .catch(err => console.log(err))

        setshowFilterCuadrilla(true);
    }

    const cerrarPopCuadrillaFiltro = () => {
        setshowFilterCuadrilla(false);
    }

    const handleChangeSelectCuadrilla = (event) => {
        setselectcuadrilla(event.target.value)
        selectcuadrilla=event.target.value

        var urlactivaCuadrilla = Url + 'reportes?proyecto='+id_proyect+'&supervisor=&pdl='
                                +pdlbuscado+'&estados='+estatus+'&canal='+selectcanal+
                                '&colonia='+colonia+'&falla='+selectfalla+'&origen_averia='+selectOrigenA+
                                '&fecha='+(tipofechaC+","+tipofechaA+","+tipofechaR)
                                +'&desde='+(fechadesdeC+","+fechadesdeA+","+fechadesdeR)
                                +'&hasta='+(fechahastaC+","+fechahastaA+","+fechahastaR)
                                +'&responsables=' + selectcuadrilla+"&motivo_incompleto="+selectmotivo

        urlfil.current = urlactivaCuadrilla

        axios.get(urlactivaCuadrilla, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            SetData(res.data.data);
            settotalRegistros(res.data.total)
            setrangoRegistros(res.data.from+"-"+res.data.to)
            setbanderaCuadrilla(false)
            setfirstpageUrl(res.data.first_page_url)
            setprevpageUrl(res.data.prev_page_url)
            setnextpageUrl(res.data.next_page_url)
            setlaspageUrl(res.data.last_page_url)
            if(res.data.data.length !== 0){
                cerrarPopCuadrillaFiltro();
            }
          })
        .catch(err => console.log(err))
    }

    const limpiarFiltroCuadrilla = () => {
        setbanderaCuadrilla(true)
        selectcuadrilla=""
        setselectcuadrilla("")
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

        var urlactivaCanal = Url + 'reportes?proyecto='+id_proyect+'&supervisor=&pdl='
                            +pdlbuscado+'&estados='+estatus+'&canal='+selectcanal+
                            '&colonia='+colonia+'&falla='+selectfalla+'&origen_averia='+selectOrigenA+
                            '&fecha='+(tipofechaC+","+tipofechaA+","+tipofechaR)
                            +'&desde='+(fechadesdeC+","+fechadesdeA+","+fechadesdeR)
                            +'&hasta='+(fechahastaC+","+fechahastaA+","+fechahastaR)
                            +'&responsables=' + selectcuadrilla+"&motivo_incompleto="+selectmotivo

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
        setselectfalla(0)
        setShowFilterFalla(true);
    }

    const cerrarPopFalla = () => {
        setShowFilterFalla(false);
    }

    const handleChangeSelectFalla = (event) => {
        setselectfalla(event.target.value)
        selectfalla=event.target.value

        var urlactivaFalla = Url + 'reportes?proyecto='+id_proyect+'&supervisor=&pdl='
                            +pdlbuscado+'&estados='+estatus+'&canal='+selectcanal+
                            '&colonia='+colonia+'&falla='+selectfalla+'&origen_averia='+selectOrigenA+
                            '&fecha='+(tipofechaC+","+tipofechaA+","+tipofechaR)
                            +'&desde='+(fechadesdeC+","+fechadesdeA+","+fechadesdeR)
                            +'&hasta='+(fechahastaC+","+fechahastaA+","+fechahastaR)
                            +'&responsables=' + selectcuadrilla+"&motivo_incompleto="+selectmotivo

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
        selectfalla=""
        setselectfalla("")
        cargarReportesFiltros();
    }

    //Filtro Origen de Averia
    const abrirPopOrigenA = (event) => {
        setAnchorEl(event.currentTarget);
        setselectOrigenA(0)
        setshowFilterOrigenA(true);
    }

    const cerrarPopOrigenA = () => {
        setshowFilterOrigenA(false);
    }

    const handleChangeSelectOrigenA = (event) => {
        setselectOrigenA(event.target.value)
        selectOrigenA=event.target.value

        var urlactivaOrigenA = Url + 'reportes?proyecto='+id_proyect+'&supervisor=&pdl='
                            +pdlbuscado+'&estados='+estatus+'&canal='+selectcanal+
                            '&colonia='+colonia+'&falla='+selectfalla+'&origen_averia='+selectOrigenA+
                            '&fecha='+(tipofechaC+","+tipofechaA+","+tipofechaR)
                            +'&desde='+(fechadesdeC+","+fechadesdeA+","+fechadesdeR)
                            +'&hasta='+(fechahastaC+","+fechahastaA+","+fechahastaR)
                            +'&responsables=' + selectcuadrilla+"&motivo_incompleto="+selectmotivo

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
        selectOrigenA=""
        setselectOrigenA("")
        cargarReportesFiltros();
    }

    //Filtro Fecha Creación
    const abrirPopFechaC = (event) => {
        setAnchorEl(event.currentTarget);
        setShowFilterFechaC(true);
    }

    const cerrarPopFechaC = () => {
        setShowFilterFechaC(false);
    }

    const filtrarFechaCreacion = () => {
        const desde = (rangofechas[0].startDate.getFullYear() + "-" + revisarfecha0(rangofechas[0].startDate.getMonth() + 1)
                        + "-" + revisarfecha0(rangofechas[0].startDate.getDate()))

        const hasta = (rangofechas[0].endDate.getFullYear() + "-" + revisarfecha0(rangofechas[0].endDate.getMonth() + 1)
        + "-" + revisarfecha0(rangofechas[0].endDate.getDate()))

        fechadesdeC = desde
        fechahastaC = hasta
        tipofechaC = "created_at"

        setfechadesdeC(desde)
        setfechastaC(hasta)
        settipoFechaC("created_at")

        var urlfechaCreacion = Url + 'reportes?proyecto='+id_proyect+'&supervisor=&pdl='
                            +pdlbuscado+'&estados='+estatus+'&canal='+selectcanal+
                            '&colonia='+colonia+'&falla='+selectfalla+'&origen_averia='+selectOrigenA+
                            '&fecha='+(tipofechaC+","+tipofechaA+","+tipofechaR)
                            +'&desde='+(fechadesdeC+","+fechadesdeA+","+fechadesdeR)
                            +'&hasta='+(fechahastaC+","+fechahastaA+","+fechahastaR)
                            +'&responsables=' + selectcuadrilla+"&motivo_incompleto="+selectmotivo

        urlfil.current = urlfechaCreacion

        axios.get(urlfechaCreacion, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            SetData(res.data.data);
            settotalRegistros(res.data.total)
            setrangoRegistros(res.data.from+"-"+res.data.to)
            setbanderaFechaC(false)
            setfirstpageUrl(res.data.first_page_url)
            setprevpageUrl(res.data.prev_page_url)
            setnextpageUrl(res.data.next_page_url)
            setlaspageUrl(res.data.last_page_url)
            if(res.data.data.length !== 0){
                cerrarPopFechaC();
            }
          })
        .catch(err => console.log(err))
    }

    const limpiarFiltroFechaC = () => {
        fechadesdeC = ""
        fechahastaC = ""
        tipofechaC = ""

        setfechadesdeC("")
        setfechastaC("")
        settipoFechaC("")

        setbanderaFechaC(true)
        cargarReportesFiltros();
    }

    //Filtro Fecha Atención
    const abrirPopFechaA = (event) => {
        setAnchorEl(event.currentTarget);
        setShowFilterFechaA(true);
    }

    const cerrarPopFechaA = () => {
        setShowFilterFechaA(false);
    }

    const filtrarFechaAtencion = () => {
        const desde = (rangofechasA[0].startDate.getFullYear() + "-" + revisarfecha0(rangofechasA[0].startDate.getMonth() + 1)
                        + "-" + revisarfecha0(rangofechasA[0].startDate.getDate()))

        const hasta = (rangofechasA[0].endDate.getFullYear() + "-" + revisarfecha0(rangofechasA[0].endDate.getMonth() + 1)
        + "-" + revisarfecha0(rangofechasA[0].endDate.getDate()))

        fechadesdeA = desde
        fechahastaA = hasta
        tipofechaA = "fecha_atencion"

        setfechadesdeA(desde)
        setfechastaA(hasta)
        settipoFechaA("fecha_atencion")

        var urlfechaAtencion = Url + 'reportes?proyecto='+id_proyect+'&supervisor=&pdl='
                            +pdlbuscado+'&estados='+estatus+'&canal='+selectcanal+
                            '&colonia='+colonia+'&falla='+selectfalla+'&origen_averia='+selectOrigenA+
                            '&fecha='+(tipofechaC+","+tipofechaA+","+tipofechaR)
                            +'&desde='+(fechadesdeC+","+fechadesdeA+","+fechadesdeR)
                            +'&hasta='+(fechahastaC+","+fechahastaA+","+fechahastaR)
                            +'&responsables=' + selectcuadrilla+"&motivo_incompleto="+selectmotivo

        urlfil.current = urlfechaAtencion

        axios.get(urlfechaAtencion, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            SetData(res.data.data);
            settotalRegistros(res.data.total)
            setrangoRegistros(res.data.from+"-"+res.data.to)
            setbanderaFechaA(false)
            setfirstpageUrl(res.data.first_page_url)
            setprevpageUrl(res.data.prev_page_url)
            setnextpageUrl(res.data.next_page_url)
            setlaspageUrl(res.data.last_page_url)
            if(res.data.data.length !== 0){
                cerrarPopFechaA();
            }
          })
        .catch(err => console.log(err))
    }

    const limpiarFiltroFechaA = () => {
        fechadesdeA = ""
        fechahastaA = ""
        tipofechaA = ""

        setfechadesdeA("")
        setfechastaA("")
        settipoFechaA("")

        setbanderaFechaA(true)
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

        var urlfechaResolucion = Url + 'reportes?proyecto='+id_proyect+'&supervisor=&pdl='
                                +pdlbuscado+'&estados='+estatus+'&canal='+selectcanal+
                                '&colonia='+colonia+'&falla='+selectfalla+'&origen_averia='+selectOrigenA+
                                '&fecha='+(tipofechaC+","+tipofechaA+","+tipofechaR)
                                +'&desde='+(fechadesdeC+","+fechadesdeA+","+fechadesdeR)
                                +'&hasta='+(fechahastaC+","+fechahastaA+","+fechahastaR)
                                +'&responsables=' + selectcuadrilla+"&motivo_incompleto="+selectmotivo

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

    const onKeyDownHandlerOficio = async (event) => {
        let $OficioReporte = document.getElementById("OficioRep");
    
        if (event.key === "Enter") {
            if($OficioReporte.value === ""){
                cargarReportesFiltros();
            }else{
                const UrlOficio = Url + 'reportes?proyecto='+id_proyect+'&oficio='+ $OficioReporte.value

                urlfil.current = UrlOficio

                await axios.get(UrlOficio, {
                    headers: {
                        Authorization : token,
                    }
                })
                .then(res =>  {
                    SetData(res.data.data);
                    settotalRegistros(res.data.total)
                    setrangoRegistros(res.data.from+"-"+res.data.to)
                    setbanderaOficio(false)
                    setfirstpageUrl(res.data.first_page_url)
                    setprevpageUrl(res.data.prev_page_url)
                    setnextpageUrl(res.data.next_page_url)
                    setlaspageUrl(res.data.last_page_url)
                    if(res.data.data.length !== 0){
                        cerrarPopOficio();
                    }
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
                const urlTicket = Url + 'reportes?proyecto='+id_proyect+'&num_ticket='+ $TicketReporte.value

                urlfil.current = urlTicket

                axios.get(urlTicket, {
                    headers: {
                        Authorization : token,
                    }
                })
                .then(res =>  {
                    SetData(res.data.data);
                    settotalRegistros(res.data.total)
                    setrangoRegistros(res.data.from+"-"+res.data.to)
                    setbanderaTicket(false)
                    setfirstpageUrl(res.data.first_page_url)
                    setprevpageUrl(res.data.prev_page_url)
                    setnextpageUrl(res.data.next_page_url)
                    setlaspageUrl(res.data.last_page_url)
                    if(res.data.data.length !== 0){
                        cerrarPopTicket();
                    }
                  })
                .catch(err => {
                    settotalRegistros(0)
                    console.log(err)
                })
            }
        }
    }

    //Pops de Info extra
    const abrirPopCuadrilla = async (event, id_cuadrilla) => {
        setAnchorEl(event.currentTarget);
        await axios.get(Url + "cuadrillas/" + id_cuadrilla.id, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            setdatacuadrilla(res.data)
          })
        .catch(err => console.log(err))
        setshowcuadrilla(true);
    }

    const cerrarPopCuadrilla = () => {
        setshowcuadrilla(false)
    }

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
    const restarmin = (fecha) =>{
        if (fecha !== "00:00") {
            // Dividir la cadena de tiempo en horas y minutos
            var partes = fecha.split(":");
            var horas = parseInt(partes[0]);
            var minutos = parseInt(partes[1]);

            // Restar un minuto
            if (minutos > 0) {
                minutos--;
            } else {
                // Si los minutos son 0, restar una hora y establecer los minutos a 59
                horas--;
                minutos = 59;
            }

            // Formatear la nueva hora en el formato "HH:mm"
            var nuevaHoraString =
                ("0" + horas).slice(-2) + ":" + ("0" + minutos).slice(-2);

            return nuevaHoraString;
        }else{
            return fecha
        }
    }

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
            Cuadrilla: true,
            Canal: true,
            FechaC: true,
            FechaAt: true,
            FechaR: true, 
            Oficio: true,
            NumTicket: true
          };

          localStorage.setItem('prefiltrado', JSON.stringify(updatedFiltrosAll));
        
            return updatedFiltrosAll;
        });
    }

    const hideall = () => {
        setStateFiltros({
            Cuadrilla: false,
            Canal: false,
            FechaC: false,
            FechaAt: false,
            FechaR: false, 
            Oficio: false,
            NumTicket: false
          });
    }

    const downloadExcel = async () => {
    
        const index = urlfil.current.indexOf("?")
        const fin = urlfil.current.length

        const cadenaextraida = urlfil.current.slice(index, fin)

        var UrlExcel = Url + "reportes/excel/download" + cadenaextraida
        
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

        cerrarPopColumnas()
    }

    const downloadWord = async () => {
        setisCharging(true)
        cerrarPopColumnas()

        if (localStorage.getItem('datos_descarga_word') === null) {

        const UrlWord = 
        Url + "reportes/word/create?proyecto="+id_proyect+"&desde="+fechadesdeA+"&hasta="+fechahastaA+"&fecha=fecha_atencion"

        axios.get(UrlWord, {
            headers : {
                Authorization : token
            }
        })
        .catch(err => {
            console.log(err)
        })

        setTimeout(() => {
            setisCharging(false)
        
            if (localStorage.getItem('datos_descarga_word') === null) {
                const datos_download = {
                    "id__user"          : user.id,
                    "bandera_peticion"  : true
                }   
                localStorage.setItem('datos_descarga_word', JSON.stringify(datos_download));
        
                Swal.fire({
                    icon: "info",
                    title: "Solicitud Aceptada",
                    text: "En unos minutos se notificará cuándo el archivo esté listo"
                });
            } else {
                Swal.fire({
                    icon: "info",
                    title: "Descarga Pendiente",
                    text: "Ya se encuentra un proceso de descarga pendiente, espere finalizar su proceso"
                });
            }
        }, 5000);
    } else {
        setisCharging(false)

        Swal.fire({
            icon: "info",
            title: "Descarga Pendiente",
            text: "Ya se encuentra un proceso de descarga pendiente, espere finalizar su proceso"
        });
    }

        /*try {
            const response =  await axios.get(UrlWord , {
                headers: {
                    Authorization : token,
                },
                responseType: 'blob'
            });
    
            if (![1097,7148,7149].includes(response.data.size)) {
                // Crea una URL para el Blob
                const url = window.URL.createObjectURL(response.data);

                // Crea un elemento <a> para simular un clic y descargar el archivo
                const link = document.createElement('a');
                link.href = url;

                // Establece el nombre del archivo que se descargará
                link.download = 'reportes.docx'; // Cambia 'nombre_del_archivo.pdf' por el nombre que desees

                setisCharging(false)

                // Simula un clic en el enlace para descargar el archivo
                document.body.appendChild(link);
                link.click();

                // Elimina el enlace después de la descarga
                document.body.removeChild(link);

            } else  {
                setisCharging(false)

                Swal.fire({
                    icon: "info",
                    title: "Oops... <br/> Aún no existen registros",
                  });
            }
        } catch (error) {
            
            setisCharging(false)

            if (localStorage.getItem('datos_descarga_word') === null) {
                const datos_download = {
                    "id__user"          : user.id,
                    "bandera_peticion"  : true
                }   
                localStorage.setItem('datos_descarga_word', JSON.stringify(datos_download));

                Swal.fire({
                    icon: "info",
                    title: "Documento demasiado pesado",
                    text: "En unos minutos se notificará cuándo el archivo esté listo"
                });
                console.error('Error al descargar o convertir el archivo:', error);
            } else {
                Swal.fire({
                    icon: "info",
                    title: "Descarga Pendiente",
                    text: "Ya se encuentra un proceso de descarga pendiente, espere finalizar su proceso"
                });
                console.error('Error al descargar o convertir el archivo:', error);
            }
        }*/
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

    const colorcronometro = (tiempo) => {
        let horaEntero = parseInt(tiempo.replace(":", ""));

        if (horaEntero <= 7200 && horaEntero >= 4800 ) {
            return green[500]
        }
        if (horaEntero < 4800 && horaEntero >= 2400) {
            return yellow[700]
        }
        if (horaEntero < 2400 && horaEntero >= 1200) {
            return orange[800]
        }
        if (horaEntero < 1200) {
            return (red[500])
        }
    }

    const ReporteItem = ({ reporte }) => {
        const [slaAtencionRestante, setSlaAtencionRestante] = useState(reporte.sla_atencion_restante);
      
        /*useEffect(() => {
          const intervalId = setTimeout(() => {
            // Resta un minuto de slaAtencionRestante
            setSlaAtencionRestante(restarmin(slaAtencionRestante));
          }, 30000);
      
          // Limpia el intervalo cuando el componente se desmonta
          return () => clearInterval(intervalId);
        });*/
      
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent:"center" }}>
              <AccessTimeIcon 
              sx={{color:colorcronometro(slaAtencionRestante), mr:1}}
              />
              {!slaAtencionRestante.includes("-") ? 
                <strong style={{color:colorcronometro(slaAtencionRestante)}}>{slaAtencionRestante} hrs</strong>
                :
                <strong style={{color:"red"}}>{slaAtencionRestante} hrs</strong>
              }
            </div>
        );
      };

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

            case "CANCELADO":
                const styleCellRowRechazado = {
                    color: 'black',
                    backgroundColor: "#D1D4D8",
                }
                return styleCellRowRechazado;

            case "REINCIDENCIA":
                const styleCellRowReincidencia = {
                    color: 'white',
                    backgroundColor: "#FF2828",
                }
                return styleCellRowReincidencia;

            default:
                const styleCellRowN = {
                    color: 'black',
                    textAlign: 'center'
                }
                return styleCellRowN;
        }
    }

    const styleModalWord = {
        position: 'absolute',
        top: '35%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '70%',
        height: '25%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        p: 2,
        //overflow: 'auto'
    };
        
    return (
        <div className={classNames("TableReportes")}>
            {openPanel &&
                <Panel 
                dato={"Folio de Reporte: " + Reporteporid.killkizeo} 
                closePanel={cerrarPanel} 
                icono={<ReportGmailerrorredIcon/>}
                top={'50px'}
                width={'45%'}
                cronometro={!["TERMINADO","CANCELADO"].includes(Reporteporid.estado) &&
                <ReporteItem reporte={Reporteporid} />
                }
                chip={<Chip label={cambiar(Reporteporid.estado)} 
                sx={[stylerow(Reporteporid.estado), 
                {width:90, borderRadius:1.5, fontSize:"0.65rem", height:20, fontWeight:"bold"}]} 
                size="small" />}
                bool={Reporteporid.reincidencia===0 ? "" : 
                <Chip label={"REINCIDENCIA"} 
                sx={[stylerow("REINCIDENCIA"), 
                {width:90, borderRadius:1.5, fontSize:"0.65rem", height:20, fontWeight:"bold"}]} 
                size="small" />}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom:2}}>
                            <TabList onChange={handleChange}>   
                                <Tab label="Información" value="InfoReportes" sx={{width:'33%'}}/>
                                <Tab label="Historico" value="ComentariosReportes" sx={{width:'33%'}}/>
                                <Tab label="Activo" value="Activo" sx={{width:'33%'}}/>
                            </TabList>
                        </Box>
                        <TabPanel value="InfoReportes" sx={{padding:0}}>
                            <Reporte dataReporte={Reporteporid} cerrarPanel={cerrarPanel} cargareportes={cargarReportesFiltros}
                            showoptions={true} reloadpanel={abrirPanel} tablaReportes={true} />
                        </TabPanel>
                        <TabPanel value="ComentariosReportes" sx={{padding:0}}>
                            {user.rol !== 11 ?
                                <Comentarios
                                ruta={Url + "reportes/" + Reporteporid.id + "/comentarios"}
                                showAdd={true}/>
                                :
                                <Comentarios
                                ruta={Url + "reportes/" + Reporteporid.id + "/comentarios"}
                                showAdd={false}/>
                            }
                        </TabPanel>
                        <TabPanel value="Activo" sx={{padding:3}}>
                            <Luminaria dataLuminariaPanel={Reporteporid.luminaria} accion={"actualizar"} 
                            showEditar={false} showAñadirReporte={false}/>
                        </TabPanel>
                    </TabContext>
                </Panel>
            }
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
                                        {/*{(user.rol !== 5 && user.rol !==6) &&
                                        }*/}
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
                            {stateFiltros.Colonia &&
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
                            }
                            <TableCell sx={styleCell}>Incidencias</TableCell>
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
                                                <MenuItem value={"CREADO"}>NUEVO</MenuItem>
                                                <MenuItem value={"ASIGNADO"}>ASIGNADO</MenuItem>
                                                <MenuItem value={"EN PROCESO"}>EN PROCESO</MenuItem>
                                                <MenuItem value={"INCOMPLETO"}>INCOMPLETO</MenuItem>
                                                <MenuItem value={"TERMINADO"}>TERMINADO</MenuItem>
                                                <MenuItem value={"CANCELADO"}>CANCELADO</MenuItem>
                                            </Select>
                                        </Box>
                                    </Popover>
                                </div>
                            </TableCell>
                            {estatus === "INCOMPLETO" &&
                            <TableCell sx={styleCell}>
                            <div style={{ display: 'flex', justifyContent:'center', alignItems:'center'}}>
                                Motivos Incompleto
                                    {banderaMotivo ?
                                    <IconButton onClick={abrirPopMotivo} sx={{color:'white'}}
                                        disabled={disabled}>
                                        <FilterAltIcon/>
                                    </IconButton>
                                    :
                                    <IconButton sx={{color:'white'}}
                                                onClick={limpiarFiltroMotivo}>
                                        <FilterAltOffIcon/>
                                    </IconButton>
                                    }
                                    <Popover
                                        open={showFilterMotivo}
                                        anchorEl={anchorEl}
                                        onClose={cerrarPopMotivo}
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
                                                value={selectmotivo}
                                                onChange={handleChangeMotivo}
                                                MenuProps={MenuPropsStatus}
                                                variant="standard">
                                                <MenuItem value={0} disabled>-Seleccione-</MenuItem>
                                                {/*<MenuItem value={"OBRA ESTATAL"}>OBRA ESTATAL</MenuItem>*/}
                                                <MenuItem value={"SIN ACCESO"}>SIN ACCESO</MenuItem>
                                                <MenuItem value={"FUERA DEL ÁREA"}>FUERA DEL ÁREA</MenuItem>
                                                {/*<MenuItem value={"NO MUNICIPALIZADO"}>NO MUNICIPALIZADO</MenuItem>*/}
                                                <MenuItem value={"REQUIERE MATERIAL"}>REQUIERE MATERIAL</MenuItem>
                                                <MenuItem value={"ATENDIDO POR INVERSIÓN"}>ATENDIDO POR INVERSIÓN</MenuItem>
                                                <MenuItem value={"OTRO"}>OTRO</MenuItem>
                                            </Select>
                                        </Box>
                                    </Popover>
                                </div>
                                </TableCell>
                            }
                            <TableCell sx={styleCell}>Tiempo Restante</TableCell>
                            {stateFiltros.Cuadrilla &&
                            <TableCell sx={styleCell}>
                                <div style={{ display: 'flex', justifyContent:'center', alignItems:'center'}}>
                                    Responsable
                                    {banderaCuadrilla ?
                                    <IconButton onClick={abrirPopCuadrillaFiltro} sx={{color:'white'}}
                                        disabled={disabled}>
                                        <FilterAltIcon/>
                                    </IconButton>
                                    :
                                    <IconButton sx={{color:'white'}}
                                                onClick={limpiarFiltroCuadrilla}>
                                        <FilterAltOffIcon/>
                                    </IconButton>
                                    }
                                    <Popover
                                        open={showFilterCuadrilla}
                                        anchorEl={anchorEl}
                                        onClose={cerrarPopCuadrillaFiltro}
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
                                                id="select-cuadrilla"
                                                value={selectcuadrilla}
                                                onChange={handleChangeSelectCuadrilla}
                                                MenuProps={MenuProps}
                                                variant="standard">
                                                <MenuItem value={0} disabled>Seleccione</MenuItem>
                                                {cuadrilla.map((cuadrilla, index) => (
                                                    <MenuItem key={index} value={cuadrilla.id}>{cuadrilla.nombre_completo}</MenuItem>
                                                ))}
                                            </Select>
                                        </Box>
                                    </Popover>
                                </div>
                            </TableCell>
                            }
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
                            {stateFiltros.Falla &&
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
                                                value={selectfalla}
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
                            }
                            {stateFiltros.OrigenA &&
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
                                                value={selectOrigenA}
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
                            }
                            {stateFiltros.FechaC &&
                            <TableCell sx={styleCell}>
                                <div style={{ display: 'flex', justifyContent:'center', alignItems:'center'}}>
                                    Fecha Creacion
                                    {banderaFechaC ?
                                    <IconButton onClick={abrirPopFechaC} sx={{color:'white'}}
                                        disabled={disabled}>
                                        <FilterAltIcon/>
                                    </IconButton>
                                    :
                                    <IconButton sx={{color:'white'}}
                                                onClick={limpiarFiltroFechaC}>
                                        <FilterAltOffIcon/>
                                    </IconButton>
                                    }
                                    <Popover
                                        open={showFilterFechaC}
                                        anchorEl={anchorEl}
                                        onClose={cerrarPopFechaC}
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
                                            <Button onClick={filtrarFechaCreacion}>OK</Button>
                                        </Box>
                                    </Popover>
                                </div>
                            </TableCell>
                            }
                            {stateFiltros.FechaAt &&
                            <TableCell sx={styleCell}>
                                <div style={{ display: 'flex', justifyContent:'center', alignItems:'center'}}>
                                    Fecha Atencion
                                    {banderaFechaA ?
                                    <IconButton onClick={abrirPopFechaA} sx={{color:'white'}}
                                        disabled={disabled}>
                                        <FilterAltIcon/>
                                    </IconButton>
                                    :
                                    <IconButton sx={{color:'white'}}
                                                onClick={limpiarFiltroFechaA}>
                                        <FilterAltOffIcon/>
                                    </IconButton>
                                    }
                                    <Popover
                                        open={showFilterFechaA}
                                        anchorEl={anchorEl}
                                        onClose={cerrarPopFechaA}
                                        anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                        }}
                                        >
                                        <Box p={1} component="div">
                                            <DateRangePicker
                                                onChange={item => setrangofechasA([item.selection])}
                                                showSelectionPreview={true}
                                                months={1}
                                                ranges={rangofechasA}
                                                direction="horizontal"
                                                />;
                                            <Button onClick={filtrarFechaAtencion}>OK</Button>
                                        </Box>
                                    </Popover>
                                </div>
                            </TableCell>
                            }
                            {stateFiltros.FechaR &&
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
                            }
                            {/*{(user.rol !== 5 && user.rol !==6) &&
                            }*/}
                            {stateFiltros.Oficio &&
                            <TableCell sx={styleCell}>
                                <div style={{ display: 'flex', justifyContent:'center', alignItems:'center'}}>
                                    Oficio 
                                        <div>
                                            {banderaOficio ?
                                                <IconButton onClick={abrirPopOficio} 
                                                disabled={disabled}
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
                                            <TabList onChange={handleChangeTabMore} aria-label="lab API tabs example">
                                                <Tab label="Filtros" value="1" />
                                                <Tab label="Descargas" value="2" />
                                            </TabList>
                                            <TabPanel value="1" sx={{p:0}}>
                                                <Box sx={{p:1, width:"100%", maxHeight: 150, overflow:"auto"}}>
                                                    <div style={{display:"flex", alignItems:"center",
                                                        justifyContent:"space-between"}}>
                                                        <label style={{width:20, fontSize:13}}> Colonia:</label>
                                                        <Switch onChange={handleChangeSwitchFiltros}
                                                        checked={stateFiltros.Colonia} size='small'
                                                        name='Colonia'/>
                                                    </div>
                                                    <div style={{display:"flex", alignItems:"center",
                                                        justifyContent:"space-between"}}>
                                                        <label style={{width:20, fontSize:13}}>Responsable:</label>
                                                        <Switch onChange={handleChangeSwitchFiltros}
                                                        checked={stateFiltros.Cuadrilla} size='small'
                                                        name='Cuadrilla'/>
                                                    </div>
                                                    <div style={{display:"flex", alignItems:"center",
                                                        justifyContent:"space-between"}}>
                                                        <label style={{width:20, fontSize:13}}> Canal:</label>
                                                        <Switch onChange={handleChangeSwitchFiltros}
                                                        checked={stateFiltros.Canal} size='small'
                                                        name='Canal'/>
                                                    </div>
                                                    <div style={{display:"flex", alignItems:"center",
                                                        justifyContent:"space-between"}}>
                                                        <label style={{width:20, fontSize:13}}> Falla:</label>
                                                        <Switch onChange={handleChangeSwitchFiltros}
                                                        checked={stateFiltros.Falla} size='small'
                                                        name='Falla'/>
                                                    </div>
                                                    <div style={{display:"flex", alignItems:"center",
                                                        justifyContent:"space-between"}}>
                                                        <label style={{width:"70%", fontSize:13}}> Origen Avería:</label>
                                                        <Switch onChange={handleChangeSwitchFiltros}
                                                        checked={stateFiltros.OrigenA} size='small'
                                                        name='OrigenA'/>
                                                    </div>
                                                    <div style={{display:"flex", alignItems:"center",
                                                        justifyContent:"space-between"}}>
                                                        <label style={{width:"70%", fontSize:13}}>Fecha Creación:</label>
                                                        <Switch onChange={handleChangeSwitchFiltros}
                                                        checked={stateFiltros.FechaC} size='small'
                                                        name='FechaC'/>
                                                    </div>     
                                                    <div style={{display:"flex", alignItems:"center",
                                                        justifyContent:"space-between"}}>
                                                        <label style={{width:"70%", fontSize:13}}>Fecha Atención:</label>
                                                        <Switch onChange={handleChangeSwitchFiltros}
                                                        checked={stateFiltros.FechaAt} size='small'
                                                        name='FechaAt'/>
                                                    </div>     
                                                    <div style={{display:"flex", alignItems:"center",
                                                        justifyContent:"space-between"}}>
                                                        <label style={{width:"80%", fontSize:13}}>Fecha Resolución:</label>
                                                        <Switch onChange={handleChangeSwitchFiltros}
                                                        checked={stateFiltros.FechaR} size='small'
                                                        name='FechaR'/>
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
                                            <TabPanel value="2" sx={{p:0}}>
                                                <Box sx={{p:1, display:"flex", justifyContent:"center", 
                                                flexDirection:"column"}}>
                                                    <Button  variant="outlined" size="small"
                                                    onClick={downloadExcel}
                                                    color="success" endIcon={<ExplicitIcon/>}>
                                                        GENERAR EXCEL
                                                    </Button>
                                                    
                                                    {(["1","3"].includes(id_proyect)) &&
                                                    <Button  variant="outlined" size="small" sx={{mt:1}}
                                                    onClick={downloadWord} 
                                                    disabled={!(tipofechaA !== "" && estatus === "TERMINADO" && totalRegistros !== 0)}
                                                    color="primary" endIcon={<FontAwesomeIcon icon={faFileWord}/>}>
                                                        GENERAR WORD
                                                    </Button>
                                                    }
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
                                <TableCell sx={styleCellRow}>
                                    <div style={{display:"flex", alignItems:"center"}}>
                                        {reporte.killkizeo||reporte.id}
                                        <div style={{display:"flex", justifyContent:"center", alignItems: "center", width:"50%"}}>
                                            {reporte.reincidencia === 0 ? "" : 
                                                <IconButton color='error'
                                                onClick={() => abrirPanelUrgente(reporte.reincidencia)}>
                                                    <DiscFullIcon/>
                                                </IconButton>
                                            }
                                            {reporte.urgente === null ? "" :
                                                <Tooltip title="Urgente" placement="top" arrow>
                                                    <WarningIcon sx={{color:yellow[600]}}/>
                                                </Tooltip>
                                            }
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell sx={styleCellRow}>{reporte.luminaria.pdl_id}</TableCell>
                                {stateFiltros.Colonia &&
                                    <TableCell sx={{...styleCellRow, width:"15%"}}>
                                        {reporte.luminaria.colonia||"--"}
                                    </TableCell>
                                }
                                <TableCell sx={styleCellRow} onClick={() => abrirPanel(reporte)}>{reporte.total_reportes_eventos}</TableCell>
                                <TableCell sx={styleCellRow} onClick={() => abrirPanel(reporte)}>
                                    <Chip label={cambiar(reporte.estado)} 
                                    sx={[stylerow(reporte.estado), 
                                    {width:90, borderRadius:1.5, fontSize:"0.65rem", height:20, fontWeight:"bold",
                                    paddingTop:"1px"
                                    }]} 
                                    size="small" />
                                </TableCell>
                                {estatus === "INCOMPLETO" &&
                                    <TableCell sx={styleCellRow}>{reporte.motivo_incompleto||"--"}</TableCell>
                                }
                                <TableCell sx={styleCellRow} onClick={() => abrirPanel(reporte)}>
                                    {!(["TERMINADO","CANCELADO"].includes(reporte.estado)) ? 
                                        <ReporteItem key={index} reporte={reporte} />
                                        :
                                        "--"
                                    }
                                </TableCell>
                                {/*{user.rol !== 6 &&
                                }*/}
                                {stateFiltros.Cuadrilla &&
                                <TableCell sx={styleCellRow}>
                                    <>
                                    <IconButton disabled={!reporte.cuadrilla} sx={{mb:-1}} 
                                    onClick={(e) => 
                                            abrirPopCuadrilla(e, reporte.cuadrilla)}>
                                        <GroupsIcon/>
                                    </IconButton>
                                    <br/>
                                    {reporte.cuadrilla !== null ?
                                        reporte.cuadrilla.nombre
                                        :
                                        ""
                                    }
                                    <Popover
                                        id="Cuadrilla"
                                        open={showcuadrilla}
                                        anchorEl={anchorEl}
                                        onClose={cerrarPopCuadrilla}
                                        sx={{
                                            "& .MuiPaper-root": {
                                                boxShadow: '2px 1px 6px 3px rgba(0,0,0,0.005);'
                                              }
                                        }}
                                        anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                        }}
                                    >
                                        <Box p={1} sx={{fontSize:12}}>
                                            {datacuadrilla !== null ?
                                            <div style={{display:"flex", flexDirection:"column"}}>
                                            <label><strong>Supervisor: {datacuadrilla.supervisor.nombre + " " 
                                                + datacuadrilla.supervisor.ap_paterno}</strong></label>
                                            <label><strong>Resp.:</strong> {datacuadrilla.responsable.nombre + " " 
                                                + datacuadrilla.responsable.ap_paterno}</label>
                                            {datacuadrilla.companero !== null ?
                                                <label><strong>Auxiliar: </strong> {datacuadrilla.companero.nombre + " " 
                                                    + datacuadrilla.companero.ap_paterno}</label>
                                                :
                                                <label><strong>Auxiliar: </strong>Sin Registro Activo</label>
                                            }
                                            </div>
                                            :
                                            ""
                                            }
                                        </Box>
                                    </Popover>
                                    </>
                                </TableCell>
                                }
                                {stateFiltros.Canal &&
                                <TableCell sx={styleCellRow}>
                                    {/*
                                    {reporte.reporte_eventos.length !== 0 ?
                                        reporte.reporte_eventos[0].canal.nombre
                                        :
                                        "--"
                                    }
                                    */}
                                    {reporte.reporte_eventos[0].canal.nombre}
                                </TableCell>
                                }
                                {stateFiltros.Falla &&
                                <TableCell sx={styleCellRow}>
                                    {/*
                                    {reporte.reporte_eventos.length !== 0 ?
                                        reporte.reporte_eventos[0].falla.nombre
                                        :
                                        "--"
                                    }
                                    */}
                                    {reporte.reporte_eventos[0].falla.nombre}
                                </TableCell>
                                }
                                {stateFiltros.OrigenA &&
                                    <TableCell sx={{...styleCellRow, width:"10%"}}>
                                        {reporte.origen_averia||"N/A"}
                                    </TableCell>
                                }
                                {stateFiltros.FechaC &&
                                <TableCell sx={styleCellRow} onClick={() => abrirPanel(reporte)}>
                                    {changeDate(reporte.created_at)}
                                </TableCell>
                                }
                                {stateFiltros.FechaAt &&
                                <TableCell sx={styleCellRow} onClick={() => abrirPanel(reporte)}>
                                    {changeDate(reporte.fecha_atencion)||"--"}
                                </TableCell>
                                }
                                {stateFiltros.FechaR &&
                                <TableCell sx={styleCellRow} onClick={() => abrirPanel(reporte)}>
                                    {changeDate(reporte.fecha_resolucion)||"--"}
                                </TableCell>
                                }
                                {stateFiltros.Oficio &&
                                <TableCell sx={styleCellRow} onClick={() => abrirPanel(reporte)}>
                                    {reporte.oficio_proyecto||"---"}
                                </TableCell>
                                }
                                {stateFiltros.NumTicket &&
                                <TableCell sx={styleCellRow} onClick={() => abrirPanel(reporte)}>
                                    {reporte.num_ticket||"---"}
                                </TableCell>
                                }
                                <TableCell sx={{width:0}}></TableCell>
                                {/*{(user.rol !== 5 && user.rol !==6) &&
                                }*/}
                                {/*
                                <TableCell>
                                    <Button variant="outlined" 
                                    sx={{borderColor: 'black', color:'black'}}
                                    onClick={() => abrirPanel(reporte)}>
                                        <ZoomOutMapIcon />
                                    </Button>
                                </TableCell>
                                */}
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

        {/*
        <Modal
        open={showModalWord}
        onClose={cerrarModalWord}>
            <Box sx={styleModalWord}>
                <div style={{display:"flex", justifyContent:"space-between"}}>
                    <h2>Progreso Descarga Word</h2>
                    <Button onClick={cerrarModalWord} variant="outlined" color="error">CERRAR</Button>
                </div>

                {showProgress &&
                    <div style={{display:"flex", alignItems:"center", marginTop:"2%"}}>
                        <Box sx={{ width:'100%', mr:2}}>
                            <LinearProgress variant="determinate" value={progress} sx={{height:8}}/>
                        </Box>
                        <label>{progress}%</label>
                    </div>
                }
            </Box>
        </Modal>
        */}
        
        { isCharging && <LoaderIndicator /> }
        </div>
    );
}

export default TableReportes;         