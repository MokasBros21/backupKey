import React, { useState, useEffect } from "react";
import classnames from "classnames";

// Import the main component
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { getFilePlugin } from '@react-pdf-viewer/get-file';

// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';

import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import axios from 'axios'
import { Url } from '../../constants/global';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import LightIcon from '@mui/icons-material/Light';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Drawer from '@mui/material/Drawer';
import MapIcon from '@mui/icons-material/Map';
import FeedIcon from '@mui/icons-material/Feed';
import DownloadIcon from '@mui/icons-material/Download';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import PasswordIcon from '@mui/icons-material/Password';
import DvrIcon from '@mui/icons-material/Dvr';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ExplicitIcon from '@mui/icons-material/Explicit';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import GroupIcon from '@mui/icons-material/Group';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

import MenuIcon from '@mui/icons-material/Menu';
import { NoCrash } from "@mui/icons-material";

import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import TrafficIcon from '@mui/icons-material/Traffic';
import SensorsIcon from '@mui/icons-material/Sensors';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';

import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core";

import "./MenuModulos.scss"
import { Box, Button, Divider, Modal, TextField } from "@mui/material";
import LoaderIndicator from "../../layout/LoaderIndicator/LoaderIndicator";
import ModalNewReporte from "../../components/Modals/ModalNewReport";
import KeyModal from "../../components/KeyModal/KeyModal";

//Recorrido
import AddRoadIcon from '@mui/icons-material/AddRoad';

//Dashboard
import DashboardIcon from '@mui/icons-material/Dashboard';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import InsightsIcon from '@mui/icons-material/Insights';

//Rutas
import AltRouteIcon from '@mui/icons-material/AltRoute';
import { grey, red } from "@mui/material/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileWord } from "@fortawesome/free-solid-svg-icons";

import LinearProgress from '@mui/material/LinearProgress';

const useStyles = makeStyles(theme => ({
    root: {
      "& .MuiPaper-root": {
        top: 50,
        width: "23%",
        height: "calc(100% - 50px)",
        overflow: "auto"
      },

      "& MuiInput-root": {
        height:"80px"
      },

      "MuiSelect-root":{
        maxHeight: "25px"
      }
    }
  }));

const MenuModulos = () => {
    const classesMenuMod = useStyles();
    const [ isCharging, setisCharging ] = useState(false);

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user_datos'));
    const id_proyect = localStorage.getItem('id_proyecto')
    
    const MySwal = withReactContent(Swal);

    const [showModalCrear, setshowModalCrear] = useState(false)
    const [openModalDownload, setopenModalDownload] = useState(false)

    const [draweropen, setdraweropen] = useState(false)
    const [showoptionsReporte, setshowoptionsReporte] = useState(true)
    const [showoptionsRegistros, setshowoptionsRegistros] = useState(true)
    const [showoptionsConfig, setshowoptionsConfig] = useState(true)

    const [openChangePass, setopenChangePass] = useState(false)
    const [datosChange, setdatosChange] = useState({
        "email" : "",
        "password": "",
        "password_confirmation": ""
    })
    const [error, seterror] = useState(false)

    const Navigate = useNavigate();

    const go = (path) => {
        Navigate(path);
    }

    const goDrawer = (pagina) => {
        Navigate(pagina)
        closeDrawer()
    }

    const openDrawer = () => {
        setdraweropen(true)
    }

    const closeDrawer = () => {
        setdraweropen(false)
    }

    const cerrarModalHijo = () =>{
        setshowModalCrear(false)
    }

    const crearPDF = async() =>{
    /*
        var fecha_fin = fechafin.year() + "-" + (fechafin.month() + 1) + "-" + fechafin.date()
        var fecha_incio = fechainicio.year() + "-" + (fechainicio.month() + 1) + "-" + fechainicio.date()

        //const UrlPDFAxios = Url + "reportes/pdf/download?proyecto="+id_proyect+"&desde="+fecha_incio+"&hasta="+fecha_fin+"&fotografico=true&fecha=fecha_atencion"

        const UrlWord = Url + "word?proyecto=1&desde="+fecha_incio+"&hasta="+fecha_fin+"&fecha=fecha_atencion"
        

        setshowPDF(true)
        let progress = 0;
        setprogress(0)

        const interval = setInterval(() => {
            if (progress >= 99) {
                clearInterval(interval);
                return;
            }
            progress += 10;
            setprogress(Math.min(progress, 99));
        }, 5500);

        try {
            const response =  await axios.get(UrlWord , {
                responseType: 'blob'
            });
    
            if (![1097,7148,7149].includes(response.data.size)) {
                // Crea una URL para el Blob
                const url = window.URL.createObjectURL(response.data);
                
                setprogress(100);
                clearInterval(interval);

                // Crea un elemento <a> para simular un clic y descargar el archivo
                const link = document.createElement('a');
                link.href = url;

                // Establece el nombre del archivo que se descargará
                link.download = 'reportes'; // Cambia 'nombre_del_archivo.pdf' por el nombre que desees

                // Simula un clic en el enlace para descargar el archivo
                document.body.appendChild(link);
                link.click();

                // Elimina el enlace después de la descarga
                document.body.removeChild(link);

            } else  {
                setprogress(0);
                clearInterval(interval);
                setshowPDF(false)
    
                MySwal.fire({
                    icon: "info",
                    title: "Oops... <br/> Aún no existen registros",
                  });
            }
        } catch (error) {
            setprogress(0);
            clearInterval(interval);
            setshowPDF(false)

            MySwal.fire({
                icon: "info",
                title: "Documento demasiado pesado",
                text: "En unos minutos se mandará un correo con la liga del archivo"
              });
            console.error('Error al descargar o convertir el archivo:', error);
        }

        /*
        await axios.get(UrlPDFAxios, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            if (res.data.length !== 1097) {
                const response = axios.get(UrlPDFAxios , {
                    headers: {
                        Authorization: token
                    },
                    responseType: 'blob'
                });
        
                // Crea una URL para el Blob
                const url = window.URL.createObjectURL(response.data);
                
                setisCharging(false)
                window.open(url, "_blank");

            }else{
                MySwal.fire({
                    icon: "info",
                    title: "Oops... <br/> Aún no existen registros",
                  });
                setshowPDF(false)
                setUrlPDF(null)
            }
        })
        .catch(err => {
            MySwal.fire({
                icon: "info",
                title: "Error en la carga de información",
                text: "Favor de poner un rango de fecha no mayor a una semana"
              });
            setisCharging(false)
            console.log(err)
        })
        */
        //setUrlPDF(Url + "reportes/pdf/download?proyecto=1&categoria=CORRECTIVO&fecha_inicio=2023-11-01&fecha_fin=2023-11-30&fotografico=true")
    }

    const cerrarModalPass = () => {
        setopenChangePass(false)
    }
    
    const handleChangeNewPass = (event) => {
        setdatosChange({
            ...datosChange,
            [event.target.name]: event.target.value,
            });
    }

    const saveNewPass = () => {
        if (datosChange.email === '' || datosChange.password === '' 
            || datosChange.password_confirmation === '') {
            seterror(true)
        }else{
            setisCharging(true)
            
            axios.post(Url + "reset", datosChange,{
            headers: {
                Authorization : token,
            }
            })
            .then(res =>  {
                setisCharging(false)
                seterror(false)
                setdatosChange({
                    "email" : '',
                    "password" : '',
                    "password_confirmation" : ''
                })
                MySwal.fire({
                    icon: "success",
                    title: "Cambio Realizado con Éxito",
                });
                cerrarModalPass()
                closeDrawer()
            })
            .catch(err => {
                    console.log(err)
                    setisCharging(false)
                    seterror(false)
                    MySwal.fire({
                        icon: "error",
                        title: "Ocurrió un error, favor de verificar",
                    });
                })
            }
    }

    const styleModal = {
        position: 'absolute',
        top: '35%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        height: '25%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        p: 2,
        //overflow: 'auto'
    };

    if (token) {
    return(
        <><div className={classnames("Menu")}>
            <button className={classnames("Menu-item")} onClick={openDrawer}>
                <MenuIcon />
            </button>
            {!([13,8].includes(user.rol))&&
            <>
            <button className={classnames("Menu-item")} onClick={() => go("/luminarias")}>
                <LightIcon fontSize="small">
                </LightIcon>
                <span className="Menu-text">Luminarias</span>
            </button>
            <button className={classnames("Menu-item")} onClick={() => go("/construction")}>
                <TrafficIcon />
                <span className="Menu-text">Semáforos</span>
            </button>
            {/*
            <button className={classnames("Menu-item")}>
                <SensorsIcon />
                <span className="Menu-text">Sensores</span>
            </button>
            */}
            </>
            }

            {([3,13].includes(user.rol))&&
                <button className={classnames("Menu-item")} onClick={() => go("/trafico")}>
                    <NoCrash />
                    <span className="Menu-text">Detectores</span>
                </button>      
            }
        </div>

        <React.Fragment>
            <Drawer
                anchor={"left"}
                className={classesMenuMod.root}
                open={draweropen}
                onClose={closeDrawer}
            >    
                {!([13,7].includes(user.rol))&&
                <>
                 {/* DASHBOARD */}
                 <div style={{display:"flex", alignItems:"center", justifyContent:"center", padding:3}}>
                    <DashboardIcon />
                    <span className="Menu-textDrawer">Dashboards</span>
                </div> 
                <Divider sx={{mb:1}}/>
                <MenuItem onClick={() => goDrawer("/dashboard")}>
                    <ListItemIcon>
                        <AutoGraphIcon/>
                    </ListItemIcon>
                    Reportes
                </MenuItem>
                {!([8].includes(user.rol))&&
                    <MenuItem onClick={() => goDrawer("/dashboardSupervisores")}>
                        <ListItemIcon>
                            <InsightsIcon/>
                        </ListItemIcon>
                        Indicadores operativos
                    </MenuItem>
                }
                <Divider/>
                </>
                }

                {!([13].includes(user.rol))&&
                <>
                <div style={{display:"flex", alignItems:"center", justifyContent:"center", padding:3,
                    cursor:"pointer", marginTop: user.rol === 7 ? 0 : -6}} 
                    onClick={() => setshowoptionsReporte(showoptionsReporte ? false : true)}>
                    <ReportGmailerrorredIcon />
                    <span className="Menu-textDrawer">Reportes</span>
                    {showoptionsReporte ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                </div> 
                <Divider sx={{mb:1}}/>
                    {showoptionsReporte &&
                        <>
                        {![8].includes(user.rol) &&
                        <MenuItem onClick={() => goDrawer("/creacionreporte")}>
                            <ListItemIcon >
                                <AddBoxIcon/>
                            </ListItemIcon>
                            Crear
                        </MenuItem>
                        }
                        {![7,8,11].includes(user.rol) &&
                            <MenuItem onClick={() => goDrawer("/reportesmapafiltros")}>
                                <ListItemIcon>
                                    <MapIcon/>
                                </ListItemIcon>
                                Mapa
                            </MenuItem>
                        }
                        <MenuItem onClick={() => 
                            goDrawer(user.rol !== 7 ? (user.rol === 8 ? "/ReportesTabla" : "/reportes") : "/tablaReportes")}>
                            <ListItemIcon>
                                <ListAltIcon/>
                            </ListItemIcon>
                            Listado
                        </MenuItem>
                        {![7,8].includes(user.rol) &&
                        <MenuItem onClick={() => goDrawer("/reportesmapa")}>
                                <ListItemIcon>
                                    <DynamicFeedIcon/>
                                </ListItemIcon>
                                Asignación
                            </MenuItem>
                        }
                        {([3,4,11].includes(user.rol)) &&
                        <MenuItem onClick={() => goDrawer("/reportes/call")}>
                            <ListItemIcon>
                                <FeedIcon />
                            </ListItemIcon>
                            Origen Reporte
                        </MenuItem> 
                        } 
                        <Divider/>
                        </>
                    }
                    </>
                }
                {/*INVERSIONES*/}
                {[3,4].includes(user.rol) &&
                    <>
                        <div style={{display:"flex", alignItems:"center", justifyContent:"center", padding:3,
                                    marginTop:-6}}>
                            <RequestQuoteIcon/>
                            <span className="Menu-textDrawer">Inversiones</span>
                        </div> 
                        <Divider sx={{mb:1}}/>
                            <MenuItem onClick={() => goDrawer("/inversiones")}>
                            <ListItemIcon>
                                <ListAltIcon/>
                            </ListItemIcon>
                            Listado
                            </MenuItem>
                            {["8"].includes(id_proyect) &&
                            <>
                                <MenuItem onClick={() => goDrawer("/mapainversiones")}>
                                    <ListItemIcon>
                                        <MapIcon/>
                                    </ListItemIcon>
                                    Mapa
                                </MenuItem>
                            </>
                            }
                        <Divider/>
                    </>
                }
                {[3,12].includes(user.rol) &&
                    <>
                        <div style={{display:"flex", alignItems:"center", justifyContent:"center", padding:3,
                                    marginTop:-6, cursor:"pointer"}} onClick={() => 
                                        setshowoptionsRegistros(showoptionsRegistros ? false : true)}>
                            <DvrIcon/>
                            <span className="Menu-textDrawer">Registros</span>
                            {showoptionsRegistros ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                        </div> 
                        <Divider sx={{mb:1}}/>
                        {showoptionsRegistros &&
                            <>
                            <MenuItem onClick={() => goDrawer("/usuarios")}>
                                <ListItemIcon>
                                    <GroupIcon/>
                                </ListItemIcon>
                                Usuarios
                            </MenuItem>
                            {[3].includes(user.rol) &&
                            <MenuItem onClick={() => goDrawer("/vehiculos")}>
                                <ListItemIcon>
                                    <AirportShuttleIcon/>
                                </ListItemIcon>
                                Vehículos
                            </MenuItem>
                            }
                            <Divider/>
                            </>
                        }
                    </>
                }
                {[3].includes(user.rol) &&
                    <>
                    {/* RUTAS */}
                    <div style={{display:"flex", alignItems:"center", justifyContent:"center", padding:3,
                                marginTop:-6}}>
                        <AltRouteIcon/>
                        <span className="Menu-textDrawer">Rutas</span>
                    </div> 
                    <Divider sx={{mb:1}}/>
                    <MenuItem onClick={() => goDrawer("/rutasAleatorias")}>
                    <ListItemIcon >
                        <AddBoxIcon/>
                    </ListItemIcon>
                        Crear
                    </MenuItem>
                    <Divider/>
                    </>
                }

                {[3,13].includes(user.rol) &&
                    <>
                    {/* RECORRIDOS */}
                    <div style={{display:"flex", alignItems:"center", justifyContent:"center", padding:3}}>
                        <AddRoadIcon />
                        <span className="Menu-textDrawer">Recorridos</span>
                    </div> 
                    <Divider sx={{mb:1}}/>
                    <MenuItem onClick={() => goDrawer("/recorridos")}>
                        <ListItemIcon>
                            <ListAltIcon/>
                        </ListItemIcon>
                        Listado
                    </MenuItem>
                    <Divider/>
                    </>
                }
                {[3].includes(user.rol) &&
                    <>
                    {/*ADMINISTRADORES*/}
                    <div style={{display:"flex", alignItems:"center", justifyContent:"center", 
                        marginTop:-1, cursor:"pointer"}} onClick={() => 
                            setshowoptionsConfig(showoptionsConfig ? false : true)}>
                        <MiscellaneousServicesIcon />
                        <span className="Menu-textDrawer">Configuraciones</span>
                        {showoptionsConfig ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                    </div>
                    <Divider sx={{mb:1, mt:0.5}}/>
                    {showoptionsConfig &&
                        <>
                        <MenuItem onClick={() => setopenChangePass(true)}>
                            <ListItemIcon>
                                <PasswordIcon/>
                            </ListItemIcon>
                            Cambiar Contraseña
                        </MenuItem>
                        <MenuItem onClick={() => goDrawer("/registro")}>
                            <ListItemIcon>
                                <PersonAddIcon/>
                            </ListItemIcon>
                            Crear Usuario
                        </MenuItem>
                        <Divider/>
                        </>
                    }
                    </>
                }
            </Drawer>
        </React.Fragment>
        
        {/*
        <React.Fragment>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        ml: 6.5,
                        mt: -3.5,
                        '& .MuiAvatar-root': {
                            width: 35,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 12,
                            left: -4,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={navigatetoLuminarias}>
                    <ListItemIcon>
                        <MapIcon/>
                    </ListItemIcon>
                    Senso
                </MenuItem>
            </Menu>
        </React.Fragment>
        */}

        <KeyModal open={openChangePass} onClose={cerrarModalPass} title={"Cambiar Contraseña"}>
                <div style={{display:"flex"}}>
                    <label style={{width:"50%"}}>E-Mail: </label>
                    <TextField variant="standard" value={datosChange.email} autoComplete="off" 
                    fullWidth onChange={handleChangeNewPass} name="email" 
                    placeholder="ejemplo@trafficlight.mx" error={error} 
                    helperText={error ? "*Obligatorio" : ""}/>
                </div>
                <div style={{display:"flex", marginTop:12.5}}>
                    <label style={{width:"50%"}}>Nueva Contraseña: </label>
                    <TextField variant="standard" value={datosChange.password} autoComplete="off" 
                    fullWidth sx={{mt:1}} onChange={handleChangeNewPass} name="password" error={error} 
                    helperText={error ? "*Obligatorio" : ""}/>
                </div>
                <div style={{display:"flex", marginTop:12.5, marginBottom:10}}>
                    <label style={{width:"50%"}}>Confirmar Nueva Contraseña: </label>
                    <TextField variant="standard" value={datosChange.password_confirmation} autoComplete="off" 
                    fullWidth sx={{mt:1}} onChange={handleChangeNewPass} name="password_confirmation" 
                    error={error} helperText={error ? "*Obligatorio" : ""}/>
                </div>
                <div style={{display:"flex", justifyContent:"flex-end"}}>
                    <Button color="success" variant="outlined" onClick={saveNewPass}>GUARDAR</Button>
                </div>
        </KeyModal>

        { showModalCrear && <ModalNewReporte setmostrar={cerrarModalHijo} dataluminariaextra={null}/> }
        
        </>
        
    );
    }else{
        return Navigate("/login")
    }

}

export default MenuModulos;