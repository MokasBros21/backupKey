import React, { useRef, useState} from "react";
import axios from 'axios'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

//iconos Panel
import LightIcon from '@mui/icons-material/Light';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ConstructionIcon from '@mui/icons-material/Construction';
import ArticleIcon from '@mui/icons-material/Article';

import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import WarningIcon from '@mui/icons-material/Warning';
import EngineeringIcon from '@mui/icons-material/Engineering';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MapIcon from '@mui/icons-material/Map';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import ClearIcon from '@mui/icons-material/Clear';
import EditNoteIcon from '@mui/icons-material/EditNote';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Modal from '@mui/material/Modal';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Link from '@mui/material/Link';

import "./Reporte.scss";
import KeyModal from "../../../KeyModal/KeyModal"
import { blue, green, orange, purple, red, yellow } from "@mui/material/colors";
import { IconButton } from "@mui/material";
import { Url } from "../../../../constants/global";
import { useEffect } from "react";

const Reporte = ({dataReporte, cerrarPanel, cargareportes, showoptions, tiporeporte, reloadpanel,
                deInversion, tablaReportes}) => {

    const MenuProps = {
          style: {
            maxHeight: 250,
        },
      };

    const motivosIncompleto = [
        "OBRA ESTATAL",
        "SIN ACCESO",
        "FUERA DEL ÁREA",
        "NO MUNICIPALIZADO",
        "REQUIERE MATERIAL",
        "ATENDIDO POR INVERSIÓN"
    ]
    const [selectMotivo, setselectMotivo] = useState("0")

    const token = localStorage.getItem('token');
    const id_proyect = localStorage.getItem('id_proyecto')
    const user = JSON.parse(localStorage.getItem('user_datos'));
    const MySwal = withReactContent(Swal);

    const [reporte, setReporte] = useState([])
    const [luminaria, setLuminaria] = useState([])
    const [openModal, setopenModal] = useState(false)
    const [modalIncompleto, setmodalIncompleto] = useState(false)
    const [modalTerminar, setmodalTerminar] = useState(false)

    const [cuadrilla, setcuadrilla] = React.useState(0)
    const [cuadrilla2, setcuadrilla2] = React.useState([])
    const [datacuadrilla, setdatacuadrilla] = useState(null)

    const [reportevento, setreportevento] = useState([])
    const [actividadesreporte, setactividadesreporte] = useState([])

    const [showAsignar, setshowAsignar] = useState(false)
    const [checkUrgente, setcheckUrgente] = useState(null)
    const [editinstrucciones, seteditinstrucciones] = useState(true)

    const [pdfarchivo, setpdfarchivo] = useState(null)
    const [imagenincompleto, setimagenincompleto] = useState(null)

    const [imagesreporte, setimagesreporte] = useState([])
    const hiddenImputFileNewImage = useRef(null);
    const [finalfile, setfinalfile] = useState([null, null, null])
    const [fileNewImage, setFileNewImage] = useState([null, null, null]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

    const actividades = async (idReporte) => {
        await axios.get(Url + "reportes/"+idReporte+"/actividades", {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
                if(res.data.length !== 0){
                    setactividadesreporte(res.data)
                }else{
                    setactividadesreporte([])
                }
            })
        .catch(err => {
            console.log(err)
            setactividadesreporte([])
        })
    }

    const llenarReporte = (datosReporte) => {
        //console.log(datosReporte)

        setReporte(datosReporte);
        setLuminaria(datosReporte.luminaria)

        if (datosReporte.urgente === null) {
            setcheckUrgente(false)
        }else{
            setcheckUrgente(true)
        }

        actividades(datosReporte.id)

        axios.get(Url + 'reportes/' + datosReporte.id, {
            headers: {
                Authorization : token,
            }})
            .then(res =>  {
                let images = []
                //setpdfarchivo(null)

                if(res.data.imagenes.length > 0){
                    res.data.imagenes.map((imagen, index) => {

                        switch (imagen.campo.id) {
                            case 2:
                                var antes = {titulo : "Antes",
                                             imagen : imagen.imagen,
                                             idimage: imagen.id}
                                images.push(antes)
                                break;

                            case 3:
                                var durante = {titulo : "Durante",
                                               imagen : imagen.imagen,
                                               idimage: imagen.id}
                                images.push(durante)
                                break;

                            case 4:
                                var despues = {titulo : "Después",
                                               imagen : imagen.imagen,
                                               idimage: imagen.id}
                                images.push(despues)
                                break;

                            case 6:
                                setpdfarchivo(imagen.imagen)
                                break;

                            case 8:
                                setimagenincompleto(imagen.imagen)
                                break;
                        
                            default:
                                break;
                        }
                    })
                    
                    images.sort((a, b) => {
                        const order = { "Antes": 1, "Durante": 2, "Después": 3 };
                        return order[a.titulo] - order[b.titulo];
                    });

                    setimagesreporte(images)

                }else{
                    setpdfarchivo(null)
                    setimagenincompleto(null)
                    setimagesreporte(null)
                }
                setreportevento(res.data.reporte_eventos)
            })
            .catch(err => console.log(err))
    }

    if (reporte.id !== dataReporte.id) {
        llenarReporte(dataReporte)
    }

    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
      }

    const handleChange = (event) => {
        setcuadrilla(event.target.value)
        setReporte(values => ({...values, ['cuadrilla']: event.target.value})) 

        axios.get(Url + "cuadrillas?responsable=" + event.target.value, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            {res.data.data[0] !== undefined ? 
                axios.get(Url + "cuadrillas/" + res.data.data[0].id, {
                    headers: {
                        Authorization : token
                    }
                })
                .then(res => {
                    setdatacuadrilla(res.data)
                })
                .catch(err => console.log(err))
                :
                setdatacuadrilla(null)
            }
          })
        .catch(err => console.log(err))

        setshowAsignar(true)
    };

    const mandarMaps = (reporte) => {
        window.open("https://www.google.es/maps?q="+reporte.luminaria.latitud+","+reporte.luminaria.longitud, "_blank");
    }

    const abrirSwalDelete = (FolioEliminar) => {
        MySwal.fire({
            title: <strong>Confirmación</strong>,
            confirmButtonColor: '#28B463',
            showDenyButton: true,
            showConfirmButton: true,
            reverseButtons: true,
            denyButtonText: 'CANCELAR',
            confirmButtonText: 'CONFIRMAR',
            html: <p>Estás seguro de eliminar el Folio de Reporte: {FolioEliminar}?</p>,
            icon: 'question'
        })
        .then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                axios.delete(Url + 'reportes/'+FolioEliminar, {
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
                    cerrarPanel();
                    cargareportes();
                })
                .catch(err => console.log(err))
            };
        })}

    const abrirModal = async (estadoreporte) => {
        setcuadrilla(0)
        setdatacuadrilla(null)

        var urlcuadrilla = ""
        if (user.rol === 5) {
            urlcuadrilla = Url + 'users?proyecto='+id_proyect+'&roles=6&supervisor='+user.id
        }else{
            urlcuadrilla = Url + 'users?proyecto='+id_proyect+'&roles=6'
        }

        if (estadoreporte === "EN PROCESO") {
            MySwal.fire({
                title: <strong>Confirmación</strong>,
                confirmButtonColor: '#28B463',
                showDenyButton: true,
                showConfirmButton: true,
                denyButtonText: 'CANCELAR',
                confirmButtonText: 'CONFIRMAR',
                html: '<p>Éste reporte se encuentra En Proceso</p>' +
                        '<p>¿Estás seguro de reasignarlo?</p>',
                icon: 'warning'
            })
            .then((result) => {
                if (result.isConfirmed) {
                    axios.get(urlcuadrilla, {
                        headers: {
                            Authorization : token,
                        }
                        })
                        .then(res =>  {
                            setcuadrilla2(res.data)
                        })
                        .catch(err => console.log(err))
                    setopenModal(true)
                }
            })
        }else{
            axios.get(urlcuadrilla, {
                headers: {
                    Authorization : token,
                }
                })
                .then(res =>  {
                    setcuadrilla2(res.data)
                })
                .catch(err => console.log(err))
            setopenModal(true)
        }
    }

    const closeModal = () => {
        setopenModal(false);
        setshowAsignar(false)
    }

    const asignacion = () => {
        const newAsignacion = {
            "estado": "ASIGNADO",
            "responsable": reporte.cuadrilla
        }

        axios.put(Url + 'reportes/' + reporte.id, newAsignacion, {
            headers: {
                    Authorization : token,
                }
            })
            .then(res =>  {
                setReporte(res.data)
                closeModal()
                //cargareportes()
                cerrarPanel()
            })
            .catch(err => console.log(err))
    }

    const descargarPDF = async () => {
        const response = await axios.get(Url + 'reportes/pdf/download?proyecto=' + id_proyect + '&fotografico=true' +
            '&killkizeo=' + reporte.killkizeo, {
                headers: {
                    Authorization: token
                },
                responseType: 'blob'
            });

        // Crea una URL para el Blob
        const url = window.URL.createObjectURL(response.data);

        // Abre una nueva ventana con la URL
        window.open(url, "_blank");
    }

    const handleChangeCheck = () => {
        let datoUpdate = null;

        if(checkUrgente === false){
            setcheckUrgente(true)
            datoUpdate = user.id
        }else{
            setcheckUrgente(false)
            datoUpdate = null
        }

        const newUpdate = {
            "urgente" : datoUpdate
        }

        axios.put(Url + "reportes/" + reporte.id, newUpdate,{
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            cargareportes()
            //cerrarPanel()
        })
        .catch(err => console.log(err))
    }

    const styleModal = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '35%',
        //height: '50%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        p: 4
    };

    const styleInputLabel = {
        width: '25%'
    }

    const styleTextField = {
        width: '65%'
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

    const colorcronometro = (tiempo) => {
        let horaEntero = parseInt(tiempo.replace(":", ""));

        if (horaEntero < 7200 && horaEntero >= 4800 ) {
            return green[500]
        }
        if (horaEntero < 4800 && horaEntero >= 2400) {
            return yellow[700]
        }
        if (horaEntero < 2400 && horaEntero >= 1200) {
            return orange[400]
        }
        if (horaEntero < 1200) {
            return red[500]
        }
    }

    const ReporteItem = ({ reporte }) => {
        const [slaAtencionRestante, setSlaAtencionRestante] = useState(reporte.sla_atencion_restante);
      
        useEffect(() => {
          const intervalId = setTimeout(() => {
            // Resta un minuto de slaAtencionRestante
            setSlaAtencionRestante(restarmin(slaAtencionRestante));
          }, 60000);
      
          // Limpia el intervalo cuando el componente se desmonta
          return () => clearInterval(intervalId);
        });
      
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <AccessTimeIcon 
              sx={{color:colorcronometro(slaAtencionRestante)}}
              />
              {slaAtencionRestante !== "00:00" ? 
                <p style={{color:colorcronometro(slaAtencionRestante)}}>{slaAtencionRestante} hrs</p>
                :
                <strong style={{color:"red"}}>{slaAtencionRestante} hrs</strong>
              }
            </div>
        );
      };

    const buscarporkillkizeo = (foliokill) =>{

        axios.get(Url + "reportes/killkizeo/" + foliokill, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            reloadpanel(res.data)
          })
        .catch(err => console.log(err))
    }

    const dividirhijos = (cadenahijos) => {
        const prueba = cadenahijos.split(",")

        return prueba.map((elemento, index) => (
            <React.Fragment key={index}>
                {index > 0 && ', '}
                <Link onClick={() => buscarporkillkizeo(elemento)} style={{cursor:"pointer"}}>
                {elemento}
                </Link>
            </React.Fragment>
        ));
    }
    
    const handleChangeReporte = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        
        setReporte(values => ({...values, [name]: value}))
      }
    
    const GuardarIntrucciones = () => {
        seteditinstrucciones(true)

        const newUpdateInstrucciones = {
            "instrucciones_mantenimiento" : reporte.instrucciones_mantenimiento
        }

        axios.put(Url + "reportes/" + reporte.id, newUpdateInstrucciones,{
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            cargareportes()
            reloadpanel(reporte)
        })
        .catch(err => console.log(err))
    }

    const newimagen = (index) => {
        hiddenImputFileNewImage.current.click();
        setSelectedImageIndex(index)
    }

    const cambiarimagen = async (id_imagenanterior, index) => {
        var id_file = null
        let id_tipofoto = 0

        switch (index) {
            case 0:
                    id_tipofoto = 2
                break;

            case 1:
                    id_tipofoto = 3
                break;

            case 2:
                    id_tipofoto = 4
                break;
        
            default:
                break;
        }

        var formData = new FormData();
        formData.append("imagen", finalfile[index]);
        formData.append("campo", id_tipofoto)
        formData.append("entidad", "reportes")

        await axios.post(Url + 'upload', formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            Authorization : token,
            }
        })
        .then(res =>  {
            id_file = res.data.id
        })
        .catch(err => console.log(err))

        const uploadimage = {
            "imagen_actual" : id_imagenanterior,
            "nueva_imagen"  : id_file
        }

        axios.put(Url + "reportes/" + reporte.id + "/image", uploadimage,{
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            const newImages = [...fileNewImage];
            newImages[index] = null;
            setFileNewImage(newImages);

            llenarReporte(reporte)

            MySwal.fire({
                title: "Se ha actualizado la imagen correctamente",
                icon: "success"
              });

        })
        .catch(err => console.log(err))
    }

    const handleChangeImage = (event) => {
        const file = event.target.files[0];
        if (file) {
            const newImages = [...fileNewImage];
            const finalimage = [...finalfile];

            newImages[selectedImageIndex] = URL.createObjectURL(file);
            setFileNewImage(newImages);

            finalimage[selectedImageIndex] = file
            setfinalfile(finalimage)
        }
    }

    const cancelarImage = (index) => {
        const newImages = [...fileNewImage];
        newImages[index] = null;
        setFileNewImage(newImages);
    }

    const openChangeMotive = () => {
        setselectMotivo("0")
        setmodalIncompleto(true)
    }

    const closeChangeMotive = () => {
        setmodalIncompleto(false)
    }

    const handleChangeMotivo = (event) => {
        setselectMotivo(event.target.value)
    }

    const updateMotivo = async () => {
        const newUpdateIncompleto = 
        {
            "motivo_incompleto" : selectMotivo,
        }

        await axios.put(Url + "reportes/" + reporte.id, newUpdateIncompleto, {
            headers:{
                Authorization : token
            }
        })
        .then(res => {
            closeChangeMotive()
            cargareportes()
            llenarReporte(res.data)
            reloadpanel(res.data)
        })
        .catch(err => {
            MySwal.fire({
                title: err.response.data.message, 
                icon: "error"
            })
        })
    }

    //Modal Terminar Reporte

    return(
        <div style={{ textAlign: "left" }}>
            {showoptions &&
            <><Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
                <div style={{ marginRight: '2%', display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <Box sx={{ height: 36, width: 36, color: 'primary.main', border: 1, borderRadius: '50%', ml: '5%' }}>
                        <IconButton color="primary" onClick={() => mandarMaps(reporte)}>
                            <MapIcon fontSize="small" />
                        </IconButton>
                    </Box>
                    <div style={{ textAlign: "center" }}>
                        <p style={{ color: blue[600], fontSize: '13px' }}>
                            Google <br /> Maps
                        </p>
                    </div>
                </div>
                {/*ASIGNAR*/}
                {((!["TERMINADO", "CANCELADO"].includes(reporte.estado) && [3, 4, 11, 12].includes(user.rol)) 
                || ((user.rol === 5 && ["ASIGNADO", "EN PROCESO"].includes(reporte.estado) && 
                    user.id === reporte.supervisor))
                || (user.rol === 5 && ["CREADO", "INCOMPLETO"].includes(reporte.estado)))
                &&
                    <div>
                        <><Box sx={{ height: 36, width: 36, color: 'success.main', border: 1, borderRadius: '50%', ml: '10%' }}>
                            <IconButton color="success"
                                onClick={() => abrirModal(reporte.estado)}>
                                <DoneOutlineIcon fontSize="small" />
                            </IconButton>
                        </Box>
                            <p style={{ color: green[800], fontSize: '13px' }}>Asignar</p></>
                    </div>}
                {/*MARCAR URGENTE*/}
                {(reporte.estado !== "TERMINADO" && reporte.estado !== "CANCELADO") &&
                    <div style={{ marginLeft: '2%', display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Box sx={{ height: 36, width: 36, color: yellow[700], border: 1, borderRadius: '50%' }}>
                            <Checkbox
                                sx={{ ml: "-7%", mt: "-6%", color: yellow[700] }}
                                icon={<WarningAmberOutlinedIcon />}
                                checkedIcon={<WarningIcon sx={{ color: yellow[700] }} />}
                                checked={checkUrgente}
                                onChange={handleChangeCheck} />
                        </Box>
                        <div style={{ textAlign: "center" }}>
                            <p style={{ color: yellow[700], fontSize: '12px' }}>
                                {!checkUrgente ?
                                    "Marcar" : "Desmarcar"}
                                <br />
                                Urgente
                            </p>
                        </div>
                    </div>}
                {/*PDF*/}
                {(reporte.estado === "CANCELADO" && [3,11].includes(user.rol) || (reporte.estado === "TERMINADO" &&
                    reporte.reporte_padre === null)) &&
                    <div>
                        <><Box sx={{ height: 36, width: 36, color: 'red', border: 1, borderRadius: '50%', ml: '16%' }}>
                            <IconButton color="error"
                                onClick={() => descargarPDF()}>
                                <PictureAsPdfIcon fontSize="small" />
                            </IconButton>
                        </Box>
                            <p style={{ color: red[600], fontSize: '13px' }}>Descargar</p></>
                    </div>}
                {/*INCOMPLETO*/}
                {(([3,4].includes(user.rol)) && reporte.estado === "INCOMPLETO") && 
                    <div style={{ marginLeft: '2%' }}>
                        <Box sx={{ height: 36, width: 36, color:purple[700], border: 1, borderRadius: '50%', ml: '10%' }}>
                            <IconButton sx={{color:purple[700]}} onClick={openChangeMotive}>
                                <EditNoteIcon fontSize="small" />
                            </IconButton>
                        </Box><p style={{ color:purple[700] , fontSize: '13px', marginLeft:2 }}>
                            Motivo</p>
                    </div>}
                
                {/*TERMINAR REPORTE*/}
                {/*
                {(([3,4].includes(user.rol)) && reporte.estado !== "TERMINADO") &&
                    <div  style={{ marginLeft: '2%' }}>
                        <><Box sx={{ height: 36, width: 36, color: 'success.main', border: 1, borderRadius: '50%', ml: '10%' }}>
                            <IconButton color="success"
                                //onClick={() => abrirModal(reporte.estado)}
                                >
                                <PlaylistAddCheckIcon />
                            </IconButton>
                        </Box>
                        <p style={{ color: green[800], fontSize: '13px' }}>Terminar <br/> Reporte</p></>
                    </div>
                }
                */}
                {/*ELIMINAR*/}
                {([3,4].includes(user.rol) || [15,18,65].includes(user.id)) &&
                    <div style={{ marginLeft: '2%' }}>
                        <Box sx={{ height: 36, width: 36, color: 'error.main', border: 1, borderRadius: '50%', ml: '10%' }}>
                            <IconButton color="error" onClick={() => abrirSwalDelete(reporte.id)}>
                                <DeleteForeverIcon fontSize="small" />
                            </IconButton>
                        </Box><p style={{ color: red[900], fontSize: '13px' }}>Eliminar</p>
                    </div>
                }
            </Box>
            <Divider style={{ marginTop: 10 }} /></>
            }
            {!showoptions &&
                <>
                {![7].includes(user.rol) ?
                <div style={{display:"flex", marginBottom:10}}>
                    <Chip label={cambiar(reporte.estado)}
                    sx={[stylerow(reporte.estado),
                    { width: 90, borderRadius: 1.5, fontSize: "0.65rem", height: 20, 
                    fontWeight: "bold", mr:1 }]}
                    size="small"/>
                    
                    {reporte.estado !== "TERMINADO" &&
                    <div style={{marginRight: 15}}>
                        <ReporteItem reporte={reporte} />
                    </div>    
                    }

                    {deInversion &&
                        <label>Folio: {reporte.killkizeo}</label>
                    }
                </div>
                :
                <div>
                </div>
                }
                </>
            }

            <Box className="BoxInfoReporte">
                <LightIcon fontSize="small" sx={{ marginRight: 1.3 }} /> 
                <InputLabel sx={styleInputLabel}>PDL: </InputLabel>
                <TextField multiline variant="standard" name="pdl" value={luminaria.pdl_id}
                     disabled placeholder="Ninguna" sx={styleTextField}/>
            </Box> 

            {pdfarchivo !== null &&
            <Box className="BoxInfoReporte">
                    <FilePresentIcon sx={{ marginRight: 0.6 }} />
                    <InputLabel sx={styleInputLabel}>Documento: </InputLabel>
                    <Link href={pdfarchivo} sx={styleTextField} target="_blank">Documento Adjunto</Link>
            </Box>
            }
            {reporte.oficio_proyecto !== null &&
            <Box className="BoxInfoReporte">
                    <ArticleIcon sx={{ marginRight: 0.6 }} />
                    <InputLabel sx={styleInputLabel}>Oficio: </InputLabel>
                    <TextField variant="standard" name="longitud" value={reporte.oficio_proyecto}
                     disabled sx={styleTextField}/>
            </Box>
            }
            {reporte.num_ticket !== null &&
            <Box className="BoxInfoReporte">
                    <ArticleIcon sx={{ marginRight: 0.6 }} />
                    <InputLabel sx={styleInputLabel}>No. Ticket: </InputLabel>
                    <TextField variant="standard" name="longitud" value={reporte.num_ticket}
                     disabled sx={styleTextField}/>
            </Box>
            }
            <Box className="BoxInfoReporte">
                    <ArticleIcon sx={{ marginRight: 0.6 }} />
                    <InputLabel sx={styleInputLabel}>Instrucciones: </InputLabel>
                    <TextField multiline maxRows={4} value={reporte.instrucciones_mantenimiento||""} 
                    disabled={editinstrucciones} sx={styleTextField} onChange={handleChangeReporte}
                    name="instrucciones_mantenimiento" placeholder="Instrucciones"/>
                    {((user.rol === 11 && reporte.estado !== "TERMINADO" && reporte.estado !== "CANCELADO")
                        || user.rol === 3) && showoptions &&
                    <>
                        {editinstrucciones ?
                            <IconButton color="primary" sx={{border:1, ml:1, mr:1}}
                                        onClick={() => seteditinstrucciones(false)}>
                                <EditIcon />
                            </IconButton>
                            :
                            <IconButton color="primary" sx={{border:1, ml:1, mr:1}}
                                        onClick={GuardarIntrucciones}>
                                <SaveIcon />
                            </IconButton>
                        }
                    </>
                    }
            </Box>

            <Box className="BoxInfoReporte">
                    <CalendarMonthIcon size="xl" style={{ marginRight: 6 }} />
                    <InputLabel sx={{...styleInputLabel, whiteSpace:"normal"}} >Fecha Creación: </InputLabel>
                    <TextField
                        sx={styleTextField}
                        variant="standard"
                        name="fecha_censo"
                        InputLabelProps={{ shrink: true, required: true }}
                        value={reporte.created_at||"--"}
                        //onChange={handleChangeT}
                        disabled 
                        />
            </Box>

            <Box className="BoxInfoReporte">
                    <CalendarMonthIcon size="xl" style={{ marginRight: 6 }} />
                    <InputLabel sx={{...styleInputLabel, whiteSpace:"normal"}} >Fecha Asignación: </InputLabel>
                    <TextField
                        sx={styleTextField}
                        variant="standard"
                        name="fecha_censo"
                        InputLabelProps={{ shrink: true, required: true }}
                        value={reporte.fecha_asignacion||"--"}
                        //onChange={handleChangeT}
                        disabled 
                        />
            </Box>

            <Box className="BoxInfoReporte">
                    <CalendarMonthIcon size="xl" style={{ marginRight: 6 }} />
                    <InputLabel sx={{...styleInputLabel, whiteSpace:"normal"}}>Fecha Atención: </InputLabel>
                    <TextField
                        sx={styleTextField}
                        variant="standard"
                        name="fecha_censo"
                        InputLabelProps={{ shrink: true, required: true }}
                        value={reporte.fecha_atencion||"--"}
                        //onChange={handleChangeT}
                        disabled 
                        />
            </Box>
            
            <Box className="BoxInfoReporte">
                    <CalendarMonthIcon size="xl" style={{ marginRight: 6 }} />
                    <InputLabel sx={{...styleInputLabel, whiteSpace:"normal"}}>Fecha Resolución: </InputLabel>
                    <TextField
                        sx={styleTextField}
                        variant="standard"
                        name="fecha_censo"
                        InputLabelProps={{ shrink: true, required: true }}
                        value={reporte.fecha_resolucion||"--"}
                        //onChange={handleChangeT}
                        disabled 
                        />
            </Box>

            {reporte.origen_averia !== null &&
            <Box className="BoxInfoReporte">
                    <QueryStatsIcon sx={{ marginRight: 0.6 }} />
                    <InputLabel sx={{...styleInputLabel, whiteSpace:"normal"}}>Origen Avería: </InputLabel>
                    <TextField
                        sx={styleTextField}
                        variant="standard"
                        name="origen_averia"
                        value={reporte.origen_averia||"--"}
                        disabled 
                        />
            </Box>
            }

            {reporte.estado === "TERMINADO" &&
                <>
                <Divider/>
                <Box sx={{ml:2, mt:2, mb:2}}>
                    {reporte.reporte_padre !== null &&
                    <div style={{display:"flex"}}>
                        <InputLabel sx={{whiteSpace:"normal", fontSize:"15px", mr:1}}>
                        Se terminó con el folio del reporte: 
                        </InputLabel>
                        <Link onClick={() => {buscarporkillkizeo(reporte.reporte_padre)}} style={{cursor:"pointer"}}>
                            {reporte.reporte_padre} 
                        </Link>
                    </div>
                    }
                    {reporte.reportes_hijos !== null &&
                    <div style={{display:"flex", flexDirection:"column"}}>
                        <div style={{display:"flex"}}>
                            <InputLabel sx={{whiteSpace:"normal", fontSize:"15px", mr:1}}>
                            Reportes extras solucionados:  </InputLabel>
                            <p>
                            {dividirhijos(reporte.reportes_hijos)}
                            </p>
                        </div>
                    </div>
                    }
                </Box>
                </>
            }
            
            {actividadesreporte.length !== 0 &&
            <div>
                {actividadesreporte.map((actividad, index) => (
                    <Box className="BoxInfoReporte" key={index}
                    sx={{border:"solid 1px gray",marginRight:2}}>
                    <EngineeringIcon sx={{ marginRight: 0.6 }} />
                    <InputLabel sx={styleInputLabel}>Actividad: <br/> {actividad.categoria}</InputLabel>
                    
                        <Box sx={{display:"flex", flexDirection:"column", width:"65%"}}>
                        <TextField multiline variant="standard" name="actividad" 
                        value={actividad.actividad.nombre} disabled/>
                            {tiporeporte !== "reincidencia" &&
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
                            }               
                        </Box>
                    </Box>
                ))}
            </div>
            }

            {(reporte.motivo_incompleto !== null) &&
            <Box sx={{display:"flex", justifyContent:"space-evenly", alignItems:"center",
                    border:"2px solid #8E44AD", mx:1, mb:1}} maxWidth={"99%"} className="BoxInfoReporte"
                    style={{paddingBottom:0}}
                    >
                <div style={{display:"flex", justifyContent:"center"}}>
                    <InputLabel><strong>Razón: {reporte.motivo_incompleto}</strong></InputLabel>
                </div>

                {imagenincompleto !== null && 
                    <a href={imagenincompleto} target="_blank" rel="noreferrer" style={{marginTop:5}}>
                        <img src={imagenincompleto} height={80} alt={"Fotográfico"} />
                    </a>
                }
            </Box>
            }

            {imagesreporte !== null &&
                imagesreporte.map((imagen, index) => (
                    <div key={index} 
                    style={{display:"flex", justifyContent:"center", alignItems:"center",
                            border:"1px solid #008080", margin:"1%"}}>   
                        <div style={{width:"30%"}}>
                            <b>{imagen.titulo + ":"}</b>
                        </div>
                        <div style={{display:"flex", justifyContent:"left", alignItems:"center", height:90}}>
                            {fileNewImage[index] === null && 
                                <a href={imagen.imagen} target="_blank" rel="noreferrer" style={{marginTop:5}}>
                                    <img src={imagen.imagen} height={80} width={60} alt={"Foto " + imagen.titulo} />
                                </a>
                            }                   

                            {fileNewImage[index] !== null && 
                                <img src={fileNewImage[index]} alt="ImagenNueva" height={80}/>
                            }

                            {(![7,11,5].includes(user.rol) && tablaReportes) &&
                            <div style={{display:"flex", flexDirection:"column"}}>
                                <IconButton size="small" color="secondary" sx={{border:1, ml:1, mr:1}}
                                    onClick={() => newimagen(index)}>
                                    <PhotoLibraryIcon fontSize="small"/>
                                </IconButton>
                                {fileNewImage[index] !== null &&
                                <>
                                    <IconButton size="small" color="primary" sx={{border:1, ml:1, mr:1}}
                                    onClick={() => cambiarimagen(imagen.idimage, index)}>
                                        <SaveIcon fontSize="small"/>
                                    </IconButton>
                                    <IconButton size="small" color="error" sx={{border:1, ml:1, mr:1}}
                                     onClick={() => cancelarImage(index)}>
                                        <ClearIcon fontSize="small"/>
                                    </IconButton>
                                </>
                                }
                            </div>
                            }

                            <input
                                type="file"
                                accept="image/jpeg,image/png"
                                ref={hiddenImputFileNewImage}
                                onChange={(event) => handleChangeImage(event)}
                                style={{ display: "none" }} />
                        </div>
                    </div>
                ))
            }
            <Divider/>
            <div style={{textAlign:"left", padding:15}}>
                <h4>Incidencias: {reportevento.length}</h4>
                {reportevento.map((reporteevento, index) => (
                    <div key={index} style={{ display: "flex", borderTop:"1px solid #DEDEDE" }}>
                        <div style={{ marginBottom: 10, width: "70%", justifyContent: "center", 
                        flexDirection:"column", display:"flex"}}>
                            <p style={{fontSize:"14px", fontFamily:"Raleway, sans-serif"}}><b>Canal:</b> {reporteevento.canal.nombre}</p>
                            <p style={{marginTop:-15, fontSize:"14px", fontFamily:"Raleway, sans-serif"}}><b>Falla:</b> {reporteevento.falla.nombre}</p>
                            <p style={{marginTop:-15, fontSize:"14px", fontFamily:"Raleway, sans-serif"}}><b>Fecha Registro:</b> {reporteevento.created_at}</p>
                            {reporteevento.nombre_contacto !== null &&
                                <p style={{marginTop:-15, fontSize:"14px", fontFamily:"Raleway, sans-serif"}}><b>Nombre:</b> {reporteevento.nombre_contacto||"Sin Nombre"} </p>
                            }
                            {reporteevento.telefono_contacto !== null &&
                                <p style={{marginTop:-15, fontSize:"14px", fontFamily:"Raleway, sans-serif"}}><b>Teléfono:</b> {reporteevento.telefono_contacto||"Sin número"} </p>
                            }
                            {reporteevento.username_red_social !== null &&
                                <p style={{marginTop:-15, fontSize:"14px", fontFamily:"Raleway, sans-serif"}}><b>User:</b> {reporteevento.username_red_social||"Sin Red Social"} </p>
                            }
                            {reporteevento.post_red_social !== null &&
                                <p style={{marginTop:-15, fontSize:"14px", fontFamily:"Raleway, sans-serif"}}><b>Red Social:</b> {reporteevento.post_red_social||"Sin @"} </p>
                            }
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "30%", margin:"1%" }}>
                            {reporteevento.imagen !== null ?
                                <a href={reporteevento.imagen.imagen} target="_blank" rel="noreferrer">
                                    <img key={index} alt="Foto" src={reporteevento.imagen.imagen} width={130} />
                                </a>
                                :
                                <p key={index} />}
                        </div>
                    </div>
                ))}
            </div>

            <Modal 
             open={openModal}
             onClose={closeModal}>
                <Box sx={styleModal}>
                    <Box sx={{display:"flex", flexDirection:"column"}}>
                            <h3 style={{textAlign:"center"}}>Datos de Asignación</h3>
                        <div style={{display:"flex", alignItems:"center"}}>
                            Cuadrilla:
                            <FormControl size="small" 
                                sx={{ width: 200, paddingLeft: 1}}>
                                <Select
                                    onClose={() => {
                                        setTimeout(() => {
                                        document.activeElement.blur();
                                        }, 0);
                                    }}
                                    id="select-estado"
                                    value={cuadrilla}
                                    onChange={handleChange}
                                    variant="standard"
                                    MenuProps={MenuProps}
                                    >
                                    
                                    <MenuItem value={0} disabled>Seleccione cuadrilla</MenuItem>
                                    {cuadrilla2.map((cuadrilla, index) => (
                                        <MenuItem key={index} value={cuadrilla.id} style={{fontSize:"small"}}>
                                            {cuadrilla.nombre_completo}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <Box p={1} sx={{fontSize:12}}>
                            {openModal &&
                                <div style={{display:"flex", flexDirection:"column"}}>
                                    {datacuadrilla !== null ?
                                    <>
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
                                    </>
                                    :
                                    "Sin Registros"
                                    }
                                </div>
                        }
                        </Box>
                        <br/>
                        <div style={{textAlign:"center", justifyContent:'space-between', display:'flex'}}>
                            <Button color="error" variant="outlined" onClick={closeModal}>
                                Cancelar
                            </Button>
                        {showAsignar &&
                            <Button color="success" variant="outlined" sx={{width:200}} onClick={asignacion}>
                                Confirmar Asignación
                            </Button>
                        }
                        </div>
                    </Box>
                </Box>
            </Modal>

            <KeyModal open={modalIncompleto} title={"Cambiar Motivo"} onClose={closeChangeMotive}>
                <div style={{display:"flex", marginBottom:10}}>
                    <label><strong>Motivo: </strong></label>
                    <FormControl size="small" sx={{ width: 220, paddingLeft: 1}}>
                        <Select
                            onClose={() => {
                                setTimeout(() => {
                                    document.activeElement.blur();
                                }, 0);
                            }}
                            id="select-motivo"
                            fullWidth
                            value={selectMotivo}
                            onChange={handleChangeMotivo}
                            variant="standard"
                            MenuProps={MenuProps}
                        >
                            <MenuItem value={"0"} disabled>Seleccione motivo</MenuItem>
                                {motivosIncompleto.map((motivo, index) => (
                                    <MenuItem key={index} value={motivo} style={{fontSize:"small"}}>
                                        {motivo}
                                    </MenuItem>
                                ))}
                            </Select>
                    </FormControl>
                </div>
                    
                {selectMotivo !== '0' &&
                    <div style={{display:"flex", justifyContent:"end"}}>
                        <Button color="secondary" variant="outlined" sx={{width:"40%"}} 
                                onClick={updateMotivo}>
                            GUARDAR
                        </Button>
                    </div>
                }       
            </KeyModal>

        </div>
    )

}

export default Reporte;