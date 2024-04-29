import { Autocomplete, Box, Button, Chip, IconButton, MenuItem, Popover, Select, Tab, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, TextField} from '@mui/material';
//Iconos
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import MapIcon from '@mui/icons-material/Map';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';

import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';
import { useNavigate } from "react-router-dom";

import './TableInversiones.scss'
import { Url } from '../../../constants/global';
import Table0 from '../../../assets/Table0.jpg'
import LoaderIndicator from '../../../layout/LoaderIndicator/LoaderIndicator';
import Panel from '../../Panel Lateral/Panel';
import Inversion from './Inversion/Inversion';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import Reporte from '../Reportes/Reportes/Reporte';
import Luminaria from '../../Luminaria/Luminaria';


const TableInversiones = () => {

    const token = localStorage.getItem('token');
    const id_proyect = localStorage.getItem('id_proyecto')
    const [rangofechas, setrangofechas] = useState([
        {
        startDate: new Date(),
        endDate: addDays(new Date(), 1),
        key: 'selection'
        }
    ]);

    const Navigate = useNavigate();
    const [isCharging, setisCharging] = useState(false)
    const [openPanelInversion, setopenPanelInversion] = useState(false)

    //Filtros
    const [showPopPDL, setshowPopPDL] = useState(false)
    const [showPopEstado, setshowPopEstado] = useState(false)
    const [showPopTipo, setshowPopTipo] = useState(false)
    const [showPopOrigen, setshowPopOrigen] = useState(false)
    const [showPopNombre, setshowPopNombre] = useState(false)
    const [showPopFecha, setshowPopFecha] = useState(false)

    //Datos de Filtros
    const [pdl, setpdl] = useState("")
    const [estatus, setestatus] = useState(" ")
    const [tipo, settipo] = useState(" ")
    const [origen, setorigen] = useState(" ")
    const [fechadesde, setfechadesde] = useState("")
    const [fechahasta, setfechahasta] = useState("")
    const [iduser, setiduser] = useState("")

    const [dataInversiones, setdataInversiones] = useState([])
    const [datosPanel, setdatosPanel] = useState({})
    const [usersInversion, setusersInversion] = useState([])
    const [dataReporte, setdataReporte] = useState([])
    const [dataLuminaria, setdataLuminaria] = useState([])

    const [tabMenu, settabMenu] = useState("Info")
    const [anchorEl, setAnchorEl] = useState(null);
    const [indexTable, setindexTable] = useState(0)

    const [totalInversiones, settotalInversiones] = useState(0)

    const allInversiones = async () => {
        setisCharging(true)

        await axios.get(Url + "inversiones?proyecto="+id_proyect, {
            headers:{
                Authorization : token
            }
        })
        .then(res => {
            setisCharging(false)
            setdataInversiones(res.data.data)
            settotalInversiones(res.data.total)
        })
        .catch(err => {
            setisCharging(false)
            console.log(err)
            err.response.status === 401 && Navigate("/login")
        })
    }

    useEffect(() => {
        allInversiones()

        axios.get(Url + "users?roles=4,6",{
            headers:{
                Authorization : token
            }
        })
        .then(res => {
            setusersInversion(res.data)
        })
        .catch(err => {
            console.log(err)
            err.response.status === 401 && Navigate("/login")
        })

    },[])

    const handleChangeTab =  (event, newValue) => {
        settabMenu(newValue);   
    };

    const abrirMaps = (lat, lng) => {
        window.open('https://www.google.com/maps/place/'+lat+","+lng, '_blank');
    }

    //Filtros
    const cargarInversionesFiltro = (campo) => {
        const UrlFiltros = Url + ("inversiones?estado="+(campo === "estatus" ? "" : estatus)
                                        +"&tipo="+(campo === "tipo" ? "" : tipo)
                                        +"&origen="+(campo === "origen" ? "" : origen)
                                        +"&desde="+(campo === "desde" ? "" : fechadesde)
                                        +"&hasta="+(campo === "desde" ? "" : fechahasta)
                                        +"&usuario="+(campo === "user" ? "" : iduser)
                                        +"&pdl="+(campo === "pdl" ? "" : pdl)
                                        )
                    
        setisCharging(true)
        axios.get(UrlFiltros, {
            headers:{
                Authorization : token
            }
        })
        .then(res => {
            setisCharging(false)
            setdataInversiones(res.data.data)
            settotalInversiones(res.data.total)
        })
        .catch(err => {
            setisCharging(false)
            console.log(err)
        })
    }

    //PDL
    const abrirPopPdl = (event) => {
        setAnchorEl(event.currentTarget)
        setpdl("")
        setshowPopPDL(true)
    }

    const cerrarPopPdl = () => {
        setshowPopPDL(false)
    }

    const handleChangePDL = (event) => {
        setpdl(event.target.value)
    }

    const handleEnterPDL = (event) => {
        if (event.key === "Enter") {
            const UrlPdl = Url + "inversiones?proyecto="+id_proyect+"&estado="+estatus+"&tipo="+tipo
            +"&origen="+origen+"&desde="+fechadesde+"&hasta="+fechahasta+"&usuario="+iduser+"&pdl="+pdl

            setisCharging(true)
            axios.get(UrlPdl, {
                headers:{
                    Authorization : token
                }
            })
            .then(res => {
                setisCharging(false)
                setdataInversiones(res.data.data)
                settotalInversiones(res.data.total)
                if (res.data.total > 0) {
                    cerrarPopPdl()
                }
            })
            .catch(err => {
                setisCharging(false)
                console.log(err)
            })
        }
    }

    const limpiarfiltroPdl = () => {
        setpdl("")
        cargarInversionesFiltro("pdl")
    }

    //Estatus
    const abrirPopEstatus = (event) => {
        setAnchorEl(event.currentTarget)
        setestatus(" ")
        setshowPopEstado(true)
    }

    const cerrarPopEstatus = () => {
        setshowPopEstado(false)
    }

    const handleChangeSelectEstado = (event) => {
        const valueEstatus = event.target.value
        setestatus(event.target.value)

        const UrlFiltroEstado = Url + "inversiones?proyecto="+id_proyect+"&estado="+valueEstatus+"&tipo="+tipo+
        "&origen="+origen+"&desde="+fechadesde+"&hasta="+fechahasta+"&usuario="+iduser+"&pdl="+pdl

        setisCharging(true)
        axios.get(UrlFiltroEstado, {
            headers:{
                Authorization : token
            }
        })
        .then(res => {
            setisCharging(false)
            setdataInversiones(res.data.data)
            settotalInversiones(res.data.total)
            if (res.data.total > 0) {
                cerrarPopEstatus()
            }
        })
        .catch(err => {
            setisCharging(false)
            console.log(err)
        })
    }

    const limpiarfiltroEstatus = () => {
        setestatus(" ")
        cargarInversionesFiltro("estatus")
    }

    //Tipo
    const abrirPopTipo = (event) => {
        setAnchorEl(event.currentTarget)
        settipo(" ")
        setshowPopTipo(true)
    }

    const cerrarPopTipo = () => {
        setshowPopTipo(false)
    }

    const handleChangeSelectTipo = (event) => {
        const valueTipo = event.target.value
        settipo(valueTipo)

        const UrlFiltroTipo = Url + "inversiones?proyecto="+id_proyect+"&estado="+estatus+"&tipo="+valueTipo+
        "&origen="+origen+"&desde="+fechadesde+"&hasta="+fechahasta+"&usuario="+iduser+"&pdl="+pdl

        setisCharging(true)
        axios.get(UrlFiltroTipo, {
            headers:{
                Authorization : token
            }
        })
        .then(res => {
            setisCharging(false)
            setdataInversiones(res.data.data)
            settotalInversiones(res.data.total)
            if (res.data.total > 0) {
                cerrarPopTipo()
            }
        })
        .catch(err => {
            setisCharging(false)
            console.log(err)
        })
    }

    const limpiarfiltroTipo = () => {
        settipo(" ")
        cargarInversionesFiltro("tipo")
    }

    //Origen
    const abrirPopOrigen = (event) => {
        setAnchorEl(event.currentTarget)
        setorigen(" ")
        setshowPopOrigen(true)
    }

    const cerrarPopOrigen = () => {
        setshowPopOrigen(false)
    }

    const handleChangeSelectOrigen = (event) => {
        const valueOrigen = event.target.value
        setorigen(valueOrigen)

        const UrlFiltroOrigen = Url + "inversiones?proyecto="+id_proyect+"&estado="+estatus+"&tipo="+tipo+
        "&origen="+valueOrigen+"&desde="+fechadesde+"&hasta="+fechahasta+"&usuario="+iduser+"&pdl="+pdl

        setisCharging(true)
        axios.get(UrlFiltroOrigen, {
            headers:{
                Authorization : token
            }
        })
        .then(res => {
            setisCharging(false)
            setdataInversiones(res.data.data)
            settotalInversiones(res.data.total)
            if (res.data.total > 0) {
                cerrarPopOrigen()
            }
        })
        .catch(err => {
            setisCharging(false)
            console.log(err)
        })
    }

    const limpiarfiltroOrigen = () => {
        setorigen(" ")
        cargarInversionesFiltro("origen")
    }

    //Nombre
    const abrirPopNombre = (event) => {
        setAnchorEl(event.currentTarget)
        setiduser("")
        setshowPopNombre(true)
    }

    const cerrarPopNombre = () => {
        setshowPopNombre(false)
    }

    const handleChangeNombre = (value) => {
        const valorfinal = (value===null ? 0 : value.id)
        setiduser(valorfinal)

        const UrlUser = Url + "inversiones?proyecto="+id_proyect+"&estado="+estatus+"&tipo="+tipo+
        "&origen="+origen+"&desde="+fechadesde+"&hasta="+fechahasta+"&usuario="+valorfinal+"&pdl="+pdl
        
        setisCharging(true)
        axios.get(UrlUser, {
            headers:{
                Authorization : token
            }
        })
        .then(res => {
            setisCharging(false)
            setdataInversiones(res.data.data)
            settotalInversiones(res.data.total)
            if (res.data.total > 0) {
                cerrarPopNombre()
            }
        })
        .catch(err => {
            setisCharging(false)
            console.log(err)
        })
    }

    const limpiarNombre = () => {
        setiduser("")

        cargarInversionesFiltro("user")
    }

    //Fecha Creación
    const revisarfecha0 = (fecha) => {
        if (fecha < 10) {
            return "0"+fecha
        }
        return fecha
    }

    const abrirPopFecha = (event) => {
        setAnchorEl(event.currentTarget)
        setshowPopFecha(true)
    }

    const cerrarPopFecha = () => {
        setshowPopFecha(false)
    }

    const handleChangeFecha = () => {
        const desde = (rangofechas[0].startDate.getFullYear() + "-" + revisarfecha0(rangofechas[0].startDate.getMonth() + 1)
        + "-" + revisarfecha0(rangofechas[0].startDate.getDate()))

        const hasta = (rangofechas[0].endDate.getFullYear() + "-" + revisarfecha0(rangofechas[0].endDate.getMonth() + 1)
        + "-" + revisarfecha0(rangofechas[0].endDate.getDate()))

        setfechadesde(desde)
        setfechahasta(hasta)

        const UrlFiltroFecha = Url + "inversiones?proyecto="+id_proyect+"&estado="+estatus+"&tipo="+tipo+
        "&origen="+origen+"&desde="+desde+"&hasta="+hasta+"&usuario="+iduser+"&pdl="+pdl

        setisCharging(true)
        axios.get(UrlFiltroFecha, {
            headers:{
                Authorization : token
            }
        })
        .then(res => {
            setisCharging(false)
            setdataInversiones(res.data.data)
            settotalInversiones(res.data.total)
            if (res.data.total > 0) {
                cerrarPopFecha()
            }
        })
        .catch(err => {
            setisCharging(false)
            console.log(err)
        })
    }

    const limpiarfiltroFecha = () => {
        setfechadesde("")
        setfechahasta("")
        cargarInversionesFiltro("desde")
    }

    //Para Panel
    const abrirPanel = (id, estado, index) => {
        setdatosPanel({
            "id" : id,
            "estado" : estado
        })

        setindexTable(index)

        settabMenu("Info")
        setopenPanelInversion(true)
    }

    const cerrarPanel = () => {
        setopenPanelInversion(false)
    }

    //estilos
    const styleCellHead = {
        color: 'white',
        textAlign: "center",
        backgroundColor: "#237f65",
    }

    const styleCellBody = {
        color: 'black',
        textAlign: 'center',
    }

    const stylerow = (estatus) => {
        switch (estatus) {
            case "REGISTRADO":
                const styleCellRowRegistrado = {
                    color: 'white',
                    backgroundColor: "#2B88EB",
                }

                return styleCellRowRegistrado;

            case "EN OBSERVACION":
                const styleCellRowProceso = {
                    color: 'black',
                    backgroundColor: "#F4D03F ",
                }
                return styleCellRowProceso;
    
            case "ACEPTADO":
                const styleCellRowTerminado = {
                    color: 'white',
                    backgroundColor: "#28B463",
                }
                return styleCellRowTerminado;

            default:
                const styleCellRowN = {
                    color: 'black',
                    textAlign: 'center'
                }
                return styleCellRowN;
        }
    }

    return (
        <div className='TableInversiones'>
        {openPanelInversion &&
            <Panel closePanel={cerrarPanel} top={'50px'} width={'45%'}
                icono={<RequestQuoteIcon/>} dato={"Folio Inversión: " + datosPanel.id}
                chip={<Chip label={datosPanel.estado} sx={stylerow(datosPanel.estado)}
                style={{width:108, borderRadius:10, fontSize:"0.65rem", height:20, fontWeight:"bold"}}/>}
            >
                <TabContext value={tabMenu}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChangeTab}>
                        <Tab label="Información" value="Info" sx={{width:"33%"}}/>
                        {dataInversiones[indexTable].reporte !== null &&
                            <Tab label="Reporte" value="Report" sx={{width:"33%"}}/>
                        }
                        <Tab label="Asset" value="Luminaria" sx={{width:"33%"}}/>
                        </TabList>
                    </Box>
                    <TabPanel value="Info" sx={{p:1}}>
                        <Inversion idInversion={datosPanel.id} rechargeTable={allInversiones} 
                        cerrarPanel={cerrarPanel} openPanel={abrirPanel} llenarReporte={setdataReporte}
                        llenarLuminaria={setdataLuminaria} indexTable={indexTable}/>
                    </TabPanel>
                    <TabPanel value="Report" sx={{p:0.5}}>
                        <Reporte dataReporte={dataReporte} showoptions={false} deInversion={true}/>
                    </TabPanel>
                    <TabPanel value="Luminaria">
                        <Luminaria dataLuminariaPanel={dataLuminaria} showAñadirReporte={false} showEditar={false}
                        accion={"actualizar"}/>
                    </TabPanel>
                </TabContext>

            </Panel>
        }

        <TableContainer>
            <Table stickyHeader size='small' sx={{
                            "& .MuiTableRow-root:hover": {
                                backgroundColor: "#A2D9CE"
                                }
                            }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={styleCellHead}>Folio</TableCell>
                        <TableCell sx={styleCellHead}>
                            <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
                                Luminaria (PDL)
                                <IconButton onClick={pdl === "" ? abrirPopPdl : limpiarfiltroPdl}>
                                    {pdl === "" ?
                                        <FilterAltIcon sx={{color:"white"}} />
                                        :
                                        <FilterAltOffIcon sx={{color:"white"}} />
                                    }
                                </IconButton>
                                <Popover
                                    open={showPopPDL}
                                    anchorEl={anchorEl}
                                    onClose={cerrarPopPdl}
                                    anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                    }}
                                >
                                    <TextField variant='standard' sx={{p:1, width:110}} 
                                    onChange={handleChangePDL} onKeyDownCapture={handleEnterPDL}
                                    autoComplete='off'/>
                                </Popover>
                            </div>
                        </TableCell>
                        <TableCell sx={styleCellHead}>
                            <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
                                Estado
                                <IconButton onClick={estatus === " " ? abrirPopEstatus : limpiarfiltroEstatus}>
                                    {estatus === " " ?
                                        <FilterAltIcon sx={{color:"white"}} />
                                        :
                                        <FilterAltOffIcon sx={{color:"white"}} />
                                    }
                                </IconButton>
                                <Popover
                                    open={showPopEstado}
                                    anchorEl={anchorEl}
                                    onClose={cerrarPopEstatus}
                                    anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                    }}
                                >
                                    <Select
                                        id="select-estatus"
                                        onClose={() => {
                                            setTimeout(() => {
                                            document.activeElement.blur();
                                            }, 0);
                                        }}
                                        value={estatus}
                                        onChange={handleChangeSelectEstado}
                                        variant="standard"
                                        sx={{p:1}}
                                        >
                                        <MenuItem value={" "} disabled>-Seleccione-</MenuItem>
                                        <MenuItem value={"REGISTRADO"}>Registrado</MenuItem>
                                        <MenuItem value={"EN OBSERVACIÓN"}>En Observación</MenuItem>
                                        <MenuItem value={"ACEPTADO"}>Aceptado</MenuItem>
                                    </Select>
                                </Popover>
                            </div>
                        </TableCell>
                        <TableCell sx={styleCellHead}>Coordenadas</TableCell>
                        <TableCell sx={styleCellHead}>Reporte</TableCell>
                        <TableCell sx={styleCellHead}>
                            <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
                                Tipo
                                <IconButton onClick={tipo === " " ? abrirPopTipo : limpiarfiltroTipo}>
                                    {tipo === " " ?
                                        <FilterAltIcon sx={{color:"white"}} />
                                        :
                                        <FilterAltOffIcon sx={{color:"white"}} />
                                    }
                                </IconButton>
                                <Popover
                                    open={showPopTipo}
                                    anchorEl={anchorEl}
                                    onClose={cerrarPopTipo}
                                    anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                    }}
                                >
                                    <Select
                                        id="select-tipo"
                                        onClose={() => {
                                            setTimeout(() => {
                                            document.activeElement.blur();
                                            }, 0);
                                        }}
                                        value={tipo}
                                        onChange={handleChangeSelectTipo}
                                        variant="standard"
                                        sx={{p:1}}
                                        >
                                        <MenuItem value={" "} disabled>-Seleccione-</MenuItem>
                                        <MenuItem value={"MODERNIZACIÓN"}>Modernización</MenuItem>
                                        <MenuItem value={"AMPLIACIÓN"}>Ampliación</MenuItem>
                                        <MenuItem value={"COMPLEMENTACIÓN"}>Complementación</MenuItem>
                                        <MenuItem value={"REUBICACIÓN"}>Reubicación</MenuItem>
                                    </Select>
                                </Popover>
                            </div>
                        </TableCell>
                        <TableCell sx={styleCellHead}>
                            <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
                                Origen
                                <IconButton onClick={origen === " " ? abrirPopOrigen : limpiarfiltroOrigen}>
                                    {origen === " " ?
                                        <FilterAltIcon sx={{color:"white"}} />
                                        :
                                        <FilterAltOffIcon sx={{color:"white"}} />
                                    }
                                </IconButton>
                                <Popover
                                    open={showPopOrigen}
                                    anchorEl={anchorEl}
                                    onClose={cerrarPopOrigen}
                                    anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                    }}
                                >
                                    <Select
                                        id="select-origen"
                                        onClose={() => {
                                            setTimeout(() => {
                                            document.activeElement.blur();
                                            }, 0);
                                        }}
                                        value={origen}
                                        onChange={handleChangeSelectOrigen}
                                        variant="standard"
                                        sx={{p:1}}
                                        >
                                        <MenuItem value={" "} disabled>-Seleccione-</MenuItem>
                                        <MenuItem value={"LUMINARIA"}>Luminaria</MenuItem>
                                        <MenuItem value={"BRAZO"}>Brazo</MenuItem>
                                    </Select>
                                </Popover>
                            </div>
                        </TableCell>
                        <TableCell sx={styleCellHead}>
                            <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
                                Creado Por
                                <IconButton onClick={iduser === "" ? abrirPopNombre : limpiarNombre}>
                                    {iduser === "" ?
                                        <FilterAltIcon sx={{color:"white"}} />
                                        :
                                        <FilterAltOffIcon sx={{color:"white"}} />
                                    }
                                </IconButton>
                                <Popover
                                    open={showPopNombre}
                                    anchorEl={anchorEl}
                                    onClose={cerrarPopNombre}
                                    anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                    }}
                                >
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        onChange={(event, value) => handleChangeNombre(value)}
                                        options={usersInversion}
                                        getOptionLabel={(option) => option.nombre_completo}
                                        sx={{ width: 180, height:200, p:1 }}
                                        renderInput={(params) => <TextField {...params}
                                                                    id="nombreBuscado"
                                                                    variant="standard"/>}
                                        />
                                </Popover>
                            </div>
                        </TableCell>
                        <TableCell sx={styleCellHead}>
                        <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
                                Fecha de Creación
                                <IconButton onClick={fechadesde === "" ? abrirPopFecha : limpiarfiltroFecha}>
                                    {fechadesde === "" ?
                                        <FilterAltIcon sx={{color:"white"}} />
                                        :
                                        <FilterAltOffIcon sx={{color:"white"}} />
                                    }
                                </IconButton>
                                <Popover
                                    open={showPopFecha}
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
                                        <Button onClick={handleChangeFecha}>OK</Button>
                                    </Box>
                                </Popover>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableHead>
                {totalInversiones > 0 &&
                    <TableBody>
                        {dataInversiones.map((inversion, index) => (
                            <TableRow key={index}>
                                <TableCell sx={styleCellBody}>{inversion.id}</TableCell>
                                <TableCell sx={styleCellBody}>{inversion.luminaria.pdl_id}</TableCell>
                                <TableCell sx={styleCellBody} onClick={()=>abrirPanel(inversion.id, inversion.estado, index)}>
                                <Chip label={inversion.estado} sx={stylerow(inversion.estado)}
                                    style={{width:108, borderRadius:10, fontSize:"0.65rem", height:20, 
                                    fontWeight:"bold"}}/>
                                </TableCell>
                                <TableCell sx={styleCellBody} style={{display:"flex", alignItems:"center",
                                    justifyContent:"space-between"}}>
                                    <div>
                                        {inversion.latitud || "--"}, <br /> {inversion.longitud || "--"}
                                    </div>
                                    <div>
                                        <IconButton color="primary" sx={{ml:1, border:"1px solid"}} size='small'
                                        onClick={() => abrirMaps(inversion.latitud, inversion.longitud)}>
                                            <MapIcon fontSize='small'/>
                                        </IconButton>
                                    </div>
                                </TableCell>
                                <TableCell sx={styleCellBody} onClick={()=>abrirPanel(inversion.id, inversion.estado, index)}>
                                    {inversion.reporte === null ? "N/A" : inversion.reporte.killkizeo}</TableCell>
                                <TableCell sx={styleCellBody} onClick={()=>abrirPanel(inversion.id, inversion.estado, index)}>
                                    {inversion.tipo || "SIN ESPECIFICAR"}</TableCell>
                                <TableCell sx={styleCellBody} onClick={()=>abrirPanel(inversion.id, inversion.estado, index)}>
                                    {inversion.origen}</TableCell>
                                <TableCell sx={styleCellBody} onClick={()=>abrirPanel(inversion.id, inversion.estado, index)}>
                                    {inversion.created_by.nombre} {inversion.created_by.ap_paterno}
                                </TableCell>
                                <TableCell sx={styleCellBody}>{inversion.created_at}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                }
            </Table>
        </TableContainer>
        
        {totalInversiones === 0 &&
            <div style={{display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column"}}>
                <img src={Table0} alt="Searching..." height={300} width={400} style={{marginTop:"5%"}}/>
                <h3 style={{marginTop:"-3%", color:"#dce4f7"}}>Sin Registros</h3>
            </div>
        }

        <footer className={"footerTableInversiones"}>
                    Total de Registros: {totalInversiones}
        </footer>

        {isCharging && <LoaderIndicator/>}
        </div>
    );
}

export default TableInversiones;