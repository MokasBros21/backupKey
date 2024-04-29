import React, { useState} from "react";
import axios from 'axios'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

//iconos Panel
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import AlignVerticalBottomIcon from '@mui/icons-material/AlignVerticalBottom';
import VillaIcon from '@mui/icons-material/Villa';
import SignpostIcon from '@mui/icons-material/Signpost';
import LightIcon from '@mui/icons-material/Light';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MapIcon from '@mui/icons-material/Map';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';

import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faRoad } from '@fortawesome/free-solid-svg-icons'
import {  faMagnifyingGlassLocation } from '@fortawesome/free-solid-svg-icons'

import "./ReporteEvento.scss";
import { blue, green, grey, red } from "@mui/material/colors";
import { IconButton } from "@mui/material";
import MapGeneral from "../../../MapGeneral/MapGeneral";
import { Url } from "../../../../constants/global";
import LoaderIndicator from "../../../../layout/LoaderIndicator/LoaderIndicator";

const Reporte = ({dataReporte, cerrarPanel, cargareportes}) => {
    const token = localStorage.getItem('token');
    const MySwal = withReactContent(Swal);


    const [reporte, setReporte] = useState([])
    const [openModal, setopenModal] = useState(false)
    const [infoLuminaria, setinfoLuminaria] = useState([])
    const [coordenadasmaps, setcoordenadamaps] = useState({})
    const [showButton, setshowButton] = useState(false)
    const [success, setsuccess] = useState(false)
    const [denied, setdenied] = useState(false)
    const [reporteCreado, setreporteCreado] = useState("")
    const [infomessage, setinfomessage] = useState("")
    const [urlimagen, seturlimagen] = useState("")

    const [ isCharging, setisCharging ] = useState(false);

    if (reporte.id !== dataReporte.id) {
        setReporte(dataReporte);
        if(dataReporte.imagenes[0] === undefined){
            seturlimagen("")
        }else{
        seturlimagen(dataReporte.imagenes[0].imagen)}
        //console.log(reporte.referencia)
    }



    const mandarMaps = (reporte) => {
        window.open("https://www.google.es/maps?q="+reporte.latitud+","+reporte.longitud, "_blank");
    }

    const abrirSwalDelete = (FolioEliminar) => {
        MySwal.fire({
            title: <strong>Confirmación</strong>,
            showConfirmButton: false,
            showDenyButton: true,      
            denyButtonText: 'RECHAZAR',
            html: <p>Estás seguro de rechazar el Folio de Seguimiento: {FolioEliminar}?</p>,
            icon: 'question'
        })
        .then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isDenied) {
                axios.delete(Url + 'reporte_eventos/'+FolioEliminar, {
                headers: {
                    Authorization : token,
                }
                })
                .then(res =>  {
                    Swal.fire('Realizado!', '', 'success')
                    cerrarPanel();
                    cargareportes();
                })
                .catch(err => console.log(err))
            };
        })}

    const abrirSwalCreate = async (pdlverificar, latoriginal, longoriginal) => {
        setcoordenadamaps([]);

        if(pdlverificar !== null)
        {
            setisCharging(true)
           await axios.get(Url + 'luminarias/pdl/'+pdlverificar, {
                headers: {
                    Authorization : token,
                }
              })
            .then(res =>  {
                setisCharging(false)
                setcoordenadamaps(res.data.data[0])
              })
            .catch(err => {
                setisCharging(false)
                console.log(err)})
        }else{
            const originales = {
                latitud: latoriginal,
                longitud: longoriginal
            }
            setcoordenadamaps(originales)
        }
        setinfoLuminaria([]);
        setshowButton(false)
        
        setsuccess(false)
        setreporteCreado("")

        setdenied(false)
        setinfomessage("")

        setopenModal(true)
    }

    const crearReporte = (FolioCrear) =>{
        const luminaria = {
            luminaria : infoLuminaria.id
        }

        //console.log(luminaria)

        axios.put(Url + 'reporte_eventos/'+ FolioCrear +'/aprobar',  luminaria, {
            headers: {
                Authorization : token,
            }
          })
        .then(res =>  {
            setreporteCreado(res.data.reporte)
            //setsuccess(true)
            closeModal()
            cerrarPanel();
            cargareportes();
            MySwal.fire({
                icon: 'success',
                title: 'Se ha creado correctamente el reporte',
                showConfirmButton: false,
                timer: 1500
            })
          })
        .catch(err => 
            {
                setinfomessage(err.response.data.message)
                setdenied(true)
                //console.log(err.response.data.message)
            })
    }

    const closeModal = () => {
        setopenModal(false);
    }

    const styleModal = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        height: '90%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        p: 4,
    };

    const styleInputLabel = {
        width: '20%'
    }

    const styleTextField = {
        width: '70%'
    }

return(
        <div style={{ textAlign: "left" }}>
            <Box sx={{display:"flex", alignItems:"center", justifyContent:"center"}}>
                <div style={{marginRight:'3%'}}>
                    <Box sx={{height:36, width:36, color:'primary.main', border:1, borderRadius: '50%', ml:'-5%'}}>
                        <IconButton color="primary" onClick={() => mandarMaps(reporte)}>
                            <MapIcon fontSize="small"/>   
                        </IconButton>
                    </Box>
                    <p style={{color:blue[600], fontSize:'13px'}}>Maps</p>
                </div>
                <div style={{marginRight:'2%'}}>
                <Box sx={{height:36, width:36, color:'error.main', border:1, borderRadius: '50%', ml:'16%'}}>
                    <IconButton color="error" onClick={() => abrirSwalDelete(reporte.id)}>
                        <DeleteForeverIcon fontSize="small"/>   
                    </IconButton>
                </Box>
                <p style={{color:red[900], fontSize:'13px'}}>Rechazar</p>
                </div>
                <div>
                {(reporte.reporte !== null) &&
                    <><Box sx={{ height: 36, width: 36, color: 'grey.500', border: 1, borderRadius: '50%', ml: '10%' }}>
                        <IconButton color="success"
                            disabled={reporte.reporte !== null}>
                            <ThumbUpOffAltIcon fontSize="small" />
                        </IconButton>
                    </Box><p style={{ color: grey[500], fontSize: '13px' }}>Aprobar</p></>
                }
                {(reporte.reporte === null) &&
                <><Box sx={{ height: 36, width: 36, color: 'success.main', border: 1, borderRadius: '50%', ml: '10%' }}>
                        <IconButton color="success"
                            onClick={() => abrirSwalCreate(reporte.etiqueta, reporte.latitud, reporte.longitud)}>
                            <ThumbUpOffAltIcon fontSize="small" />
                        </IconButton>
                    </Box><p style={{ color: green[800], fontSize: '13px' }}>Aprobar</p></>
                }
                </div>
            </Box>
            <Divider style={{marginTop: 10 }} />
            <Box className="BoxInfo">
                    <LightIcon fontSize="small" sx={{ marginRight: 1.3 }} /> 
                    <InputLabel sx={styleInputLabel}>PDL: </InputLabel>
                    <TextField multiline variant="standard" name="etiqueta" value={reporte.etiqueta||"Ninguna"}
                     disabled placeholder="Ninguna" sx={styleTextField}/>
            </Box>
            <Box className="BoxInfo">
                <AlignHorizontalLeftIcon fontSize="small" sx={{ marginRight: 1.3 }} />
                <InputLabel sx={styleInputLabel}>Latitud: </InputLabel>
                <TextField variant="standard" name="latitud" value={reporte.latitud}
                   disabled sx={styleTextField}/>
            </Box>
            <Box className="BoxInfo">
                    <AlignVerticalBottomIcon fontSize="small" sx={{ marginRight: 1.3 }} />
                    <InputLabel sx={styleInputLabel}>Longitud: </InputLabel>
                    <TextField variant="standard" name="longitud" value={reporte.longitud}
                     disabled sx={styleTextField}/>
            </Box>
            <Box className="BoxInfo">
                    <FontAwesomeIcon icon={faRoad} size="xl" style={{ marginRight: 6 }} />
                    <InputLabel sx={styleInputLabel}>Calle: </InputLabel>
                    <TextField multiline variant="standard" name="calle" value={reporte.calle||"Ninguna"}
                     disabled placeholder="Ninguna" sx={styleTextField}/>
            </Box>
            <Box className="BoxInfo">
                    <VillaIcon sx={{ marginRight: 1 }} />
                    <InputLabel sx={styleInputLabel}>Colonia: </InputLabel>
                    <TextField multiline variant="standard" name="colonia" value={reporte.colonia||"Ninguna"}
                     disabled placeholder="Ninguna" sx={styleTextField}/>
            </Box>
            <Box className="BoxInfo">
                    <SignpostIcon sx={{ marginRight: 1 }} />
                    <InputLabel sx={styleInputLabel}>Entre Calles: </InputLabel>
                    <TextField multiline variant="standard" name="entrecalles" value={reporte.entrecalles||"Ninguna"}
                    disabled  placeholder="Ninguna" sx={styleTextField}/>
            </Box>
            <Box className="BoxInfo">
                    <FontAwesomeIcon icon={faMagnifyingGlassLocation} size="xl" style={{ marginRight: 9 }}/>
                    <InputLabel sx={styleInputLabel}>Referencia: </InputLabel>
                    <TextField multiline variant="standard" name="referencia" value={reporte.referencia||"--"}
                     disabled placeholder="Ninguna" sx={styleTextField}/>
            </Box>
            <Divider style={{marginBottom: 10 }} />
            <div style={{textAlign:'center'}}>
                <img style={{width:'40%'}} src={urlimagen||null} alt=""/>
            </div>
            <Modal 
             open={openModal}
             onClose={closeModal}>
                <Box sx={styleModal}>
                    <div style={{display:"flex"}}>
                        <div style={{marginBottom:'2%',width:'30%'}}>
                            <div style={{display:"flex", marginBottom:"1%"}}>
                            <ReportGmailerrorredIcon sx={{mr:'1%'}}/> Datos Reporte Evento
                            </div>
                            <b>Folio de Seguimiento:</b> {reporte.id}<br/>
                            <b>Latitud:</b> {reporte.latitud}<br/>
                            <b>Longitud:</b> {reporte.longitud}<br/>
                            <b>Calle:</b> {reporte.calle||"Sin Registro"}
                        </div>

                        <div style={{marginBottom:'2%', marginLeft:'2%',width:'30%'}}>
                            <div style={{display:"flex", marginBottom:"1%"}}>
                            <EmojiObjectsIcon sx={{mr:'1%'}}/> Datos Luminaria
                            </div>
                            <b>PDL:</b> {infoLuminaria.pdl_id||"--"}<br/>
                            <b>Latitud:</b> {infoLuminaria.latitud||"--"}<br/>
                            <b>Longitud:</b> {infoLuminaria.longitud||"--"}<br/>
                        </div>

                    {showButton &&
                        <div style={{marginBottom:'2%',width:'40%'}}>
                            <Button variant="outlined" color="success"
                            sx={{ marginTop: '1%', marginBottom: '2%' }}
                            onClick={() => crearReporte(reporte.id)}>
                            CREAR REPORTE
                            </Button>
                            {success &&
                            <Alert severity="success">Reporte Creado Exitosamente con Folio:{reporteCreado||""}</Alert>
                            }
                            {denied &&
                            <Alert severity="info">{infomessage||""}</Alert>
                            }
                        </div>
                    }
                    </div>
                    <MapGeneral latitudReporte={coordenadasmaps.latitud} longitudReporte={coordenadasmaps.longitud}
                    setinfoLuminaria={setinfoLuminaria} showButton={setshowButton} caso={1}/>
                    <p>Seleccione un PDL para confirmar</p>
                </Box>
            </Modal>

            { isCharging && <LoaderIndicator /> }
        </div>
    )

}

export default Reporte;