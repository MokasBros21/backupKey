import React, { useState, useEffect, useRef} from "react";
import { Box, Button, Chip, Divider, FormControl, InputAdornment, MenuItem, Modal, 
    Select, Tab, TextField } from "@mui/material";

import { useNavigate} from "react-router-dom";

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import axios from 'axios'
import { Url } from '../../constants/global';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import MapGoogle from "../MapGoogle/MapGoogle";
import Luminaria from "../Luminaria/Luminaria";
import Reporte from "../Tables/Reportes/Reportes/Reporte";
import Comentarios from "../Comentarios/Comentario";
import LoaderIndicator from "../../layout/LoaderIndicator/LoaderIndicator";

const ModalNewReporte = ({ setmostrar, dataluminariaextra }) => {

    const MySwal = withReactContent(Swal);
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user_datos'));
    const Navigate = useNavigate();
    const [ isCharging, setisCharging ] = useState(false);

    const [openModal, setopenModal] = useState(true)

    const [dataluminaria, setdataluminaria] = useState([])
    const [dataGeoJson, setdataGeoJson] = useState(0)
    const [tiporeporte, setiporeporte] = useState("")

    const [showCanal, setshowCanal] = useState(false)
    const [canales, setCanales] = useState([])
    const [selectcanal, setselectcanal] = React.useState('');

    const [showpaso2, setshowpaso2] = useState(false)
    const [showPeticion, setshowPeticion] = useState(false)
    const [showCall, setshowCall] = useState(false)
    const [showOficio, setshowOficio] = useState(false)
    const [showRedes, setshowRedes] = useState(false)

    const [showFalla, setshowFalla] = useState(false)
    const [fallas, setfallas] = useState([])
    const [selectfalla, setselectfalla] = React.useState('');

    const [showInstrucciones, setshowInstrucciones] = useState(false)
    const [showCrear, setshowCrear] = useState(false)

    const hiddenFileInput = useRef(null);
    const [nameFile, setnameFile] = useState('')
    const [folio, setFolio] = useState('')
    const [oficio, setOficio] = useState('')
    const [numticket, setnumticket] = useState('')
    const [nombre, setnombre] = useState("")
    const [telefono, settelefono] = useState("")
    const [correo, setcorreo] = useState("")
    const [instrucciones, setinstrucciones] = useState('')
    const [usuario, setusuario] = useState('')
    const [link, setlink]  = useState('')
    const [file, setfile] = useState(null)

    const [value, setValue] = React.useState('1');

    const navigateToReports = () => {
        Navigate("/reportes")
    }

    const buscarkillkizeo = async (id_reporte) => {
        if(id_reporte.reporte_activo !== 0){
          await axios.get(Url + 'reportes/'+id_reporte.reporte_activo, {
            headers: {
                Authorization : token,
                }
              })
            .then(res =>  {
                setiporeporte("reporte_activo")
                setdataGeoJson(res.data)
              })
            .catch(err => console.log(err))
        }else{
          if (id_reporte.reincidencia !== 0) {
            await axios.get(Url + 'reportes/'+id_reporte.reincidencia, {
              headers: {
                  Authorization : token,
                  }
                })
              .then(res =>  {
                  setiporeporte("reincidencia")
                  setdataGeoJson(res.data)
                })
              .catch(err => console.log(err))
          }else{
            setdataGeoJson(0)
          }
        }
      }

    useEffect(() => {
        if (dataluminariaextra !== null) {
            setdataluminaria(dataluminariaextra)
            buscarkillkizeo(dataluminariaextra)
            setshowCanal(true)
        }
        
        abrirModal()
    },[])

    const abrirModal = () => {
        //closeDrawer()
        setopenModal(true)
        axios.get(Url + 'canales?call_center=true', {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            setCanales(res.data);
        })
        .catch(err => console.log(err))

        axios.get(Url + 'fallas?tipo=luminaria', {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            setfallas(res.data);
        })
        .catch(err => console.log(err))
    }

    const closeModal = () => {
        setopenModal(false)
        setmostrar()

        setdataluminaria([])

        setshowCanal(false)
        setshowpaso2(false)
        setshowFalla(false)
        setshowCrear(false)
        setshowInstrucciones(false)

        setshowCall(false)
        setshowOficio(false)
        setshowRedes(false)
        setshowPeticion(false)

        setselectcanal('')
        setselectfalla('')
        setnameFile('')
        setinstrucciones('')
        setfile(null)
        setdataGeoJson(0)
    }

    //Select Canal
    const handleChange = (event, newValue) => {
        setValue(newValue);
      };

      const handleChangeSelect = (event) => {
        if (event.target.value === 3) {
            setshowCall(true)
        }else{
            setshowCall(false)
        }

        if (event.target.value === 4 || event.target.value === 10) {
            setshowOficio(true)
        }else{
            setshowOficio(false)
        }

        if (event.target.value === 6) {
            setshowPeticion(true)
        }else{
            setshowPeticion(false)
        }

        if (event.target.value === 7) {
            setshowRedes(true)
        }else{
            setshowRedes(false)
        }

        setshowpaso2(true)
        setshowFalla(true)
        setselectcanal(event.target.value)
    }

    //Select Falla
    const handleChangeFalla = (event) => {
        setshowInstrucciones(true)
        setshowCrear(true)
        setselectfalla(event.target.value)
    }

    //Autocompletar Teléfono
    const handleDownTel = async (event) =>{
        if (event.key === "Enter") {
            if(telefono !== ""){
                setisCharging(true)

                await axios.get(Url + "users?telefono="+telefono, {
                    headers: {
                        Authorization : token,
                    }
                })
                .then(res =>  {
                    //console.log(res.data[0].nombre_completo)
                    setnombre(res.data[0].nombre_completo)
                    setcorreo(res.data[0].email)
                    setisCharging(false)
                })
                .catch(err => {
                    setisCharging(false)
                    console.log(err)
                    setnombre("")
                    setcorreo("")})
                }
            }else{
                setnombre("")
                setcorreo("")
            }
        }

    //Subir Archivo
    const FileNew = () => {
        hiddenFileInput.current.click();
    }

    const handleChangeFile = (event) => {
        const fileUploaded = event.target.files[0];

        if(fileUploaded !== undefined)
        {
            setfile(fileUploaded)
            setnameFile(fileUploaded.name)
        }else{
            setfile(null)
            setnameFile('')
        }
    }

    //Genérico para campos abiertos
    const handleChangeText = (event) =>{
        const campo = (event.target.name)

        switch (campo) {
            case "folio":
                setFolio(event.target.value)
                break;

            case "oficio":
                setOficio(event.target.value)
                break;

            case "num_ticket":
                setnumticket(event.target.value)
                break;

            case "nombre":
                setnombre(event.target.value)
                break;

            case "telefono":
                settelefono(event.target.value)
                break;

            case "correo":
                setcorreo(event.target.value)
                break;

            case "usuario":
                setusuario(event.target.value)
                break;

            case "link":
                setlink(event.target.value)
                break;

            case "instrucciones":
                setinstrucciones(event.target.value)
                break;

            default:
                break;
        }
    }

    const crearReporte = async () => {
        var id_file = null

        if(nameFile !== '')
        {
            /*let tipo_campo = 0
            var ext = nameFile.substring(nameFile.lastIndexOf("."));

            if (ext === ".png" || ext === ".jpg") {
                tipo_campo = 1
            }else{
                tipo_campo = 6
            }*/

            var formData = new FormData();
            formData.append("imagen", file);
            formData.append("campo", 6)
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
        }

        const new_report = {
            "luminaria":        dataluminaria.id,
            "falla":            selectfalla,
            "canal":            selectcanal,
            "usuario":          parseInt(user.id),
            "folio_proyecto":   folio,
            "oficio_proyecto":  oficio,
            "num_ticket":       numticket,    
            "imagenes":         id_file,
            "nombre_contacto":  nombre,
            "telefono_contacto":    telefono,
            "username_red_social":  usuario,
            "post_red_social":  link,
            "instrucciones_mantenimiento": instrucciones
        }

       await axios.post(Url + 'reportes', new_report, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            closeModal()
            if (res.status === 201) {
                MySwal.fire({
                    icon: 'success',
                    html: '<h3>Se ha creado correctamente el reporte con Folio: ' + res.data.killkizeo
                    +'</h3> <h2>Tiempo Restante: <b>'+res.data.sla_atencion_restante+' hrs</b></h2>',
                    //showConfirmButton: false,
                    //timer: 3000
                })
                .then((result) => {
                    if (result.isConfirmed) {
                        navigateToReports()
                        setTimeout(() => { 
                            window.location.reload(); 
                          }, 1);
                    }
                })
            }else{
                MySwal.fire({
                    icon: 'success',
                    html: '<h3>Se ha adjuntado al archivo del reporte con Folio: ' + res.data.killkizeo
                    +'</h3> <h2>Tiempo Restante: <b>'+res.data.sla_atencion_restante+' hrs</b></h2>',
                    //showConfirmButton: false,
                    //timer: 3000
                })
                .then((result) => {
                    if (result.isConfirmed) {
                        navigateToReports()
                        setTimeout(() => { 
                            window.location.reload(); 
                          }, 1);
                    }
                })
                //navigateToReports()
            }
        })
        .catch(err => console.log(err))
        //console.log(window.location.href)
    }

    const styleModal = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: dataluminariaextra === null ? '92%' : '50%',
        height: '90%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        p: 4,
        //overflow: 'auto'
    };

    const TextFieldProp = {
        style: {
          fontSize: "12px",
      },
    };

    const styleSelect = {
        height: "25px"   
    }

    return (
        <div>
            <Modal
            open={openModal}
            onClose={closeModal}>
                <Box sx={{...styleModal, flexDirection:"column"}}>
                    <h3 style={dataluminariaextra === null ?
                                {textAlign:"center", marginLeft:"-45%"}
                                :
                                {textAlign:"center"}}>Crear Reporte</h3>
                    
                    <div style={{display:"flex", height:"90%"}}>   
                        {dataluminariaextra === null && 
                            <div style={{flex:2.45, marginRight:30}}>
                                {/*<MapGeneral setinfoLuminaria={setdataluminaria} showButton={setshowCanal}
                                setdatosGeoJson={setdataGeoJson} primerTab={setearTab} setiporeporte={setiporeporte}/> 
                        Seleccione un punto para ver las Luminarias*/}
                                <MapGoogle/>
                            </div>
                        }

                        <div  style={dataluminariaextra === null ?
                                        {flex:1.55, marginTop:-40, marginBottom:150}
                                        :
                                        {width:"100%"}}>
                            <div style={{display:"flex", width:"80%", height:"10%", alignItems:"center"}}>
                                <p style={{marginRight:30}}>PDL: {dataluminaria.pdl_id||"--"}</p>
                                {showCanal &&
                                    <>
                                    {dataGeoJson !== 0 ?  
                                        <div>
                                        {tiporeporte !== "reincidencia" ?
                                            <b>Reporte con Folio: {dataGeoJson.killkizeo}</b>
                                            :
                                            <b>Reporte Terminado con Folio: {dataGeoJson.killkizeo}</b>
                                        }       
                                        </div>

                                        :
                                        <p>Sin Reportes</p>
                                    }
                                    </>
                                }
                            </div>
                            <div style={dataluminariaextra !== null ? 
                                        {height:"85%",overflow:"auto"}
                                        :
                                        {height:"140%",overflow:"auto"}}>
                                {!showCanal &&
                                    <Button variant="outlined" color="error" onClick={closeModal} 
                                            sx={{marginRight:'10%'}}>
                                    CANCELAR
                                    </Button>
                                }
                                {showCanal &&
                                <>
                                <TabContext value={value}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                                        <Tab label="Levantamiento" value="1" />
                                        <Tab label="Assets" value="2" />
                                        {dataGeoJson !== 0 &&
                                            <Tab label="Reporte" value="3" />
                                        }
                                    </TabList>
                                    </Box>
                                    <TabPanel value="1" sx={{margin:0, padding:1}}>                            
                                        <Divider>
                                            <Chip label="1" />
                                        </Divider>
                                        <FormControl fullWidth>
                                            Canal:
                                            <Select
                                                id="Canal"
                                                value={selectcanal}
                                                //MenuProps={MenuProps}
                                                sx={styleSelect}
                                                onChange={handleChangeSelect}
                                            >
                                            {canales.map((canal, index) => (
                                                <MenuItem key={index} value={canal.id} name={canal.nombre}>
                                                    {canal.nombre}</MenuItem>
                                            ))}
                                            </Select>
                                        </FormControl>
                                        {showpaso2 &&
                                        <>  
                                            <p />
                                            <Divider>
                                                <Chip label="2" />
                                            </Divider>
                                            <p />
                                        </>
                                        }
                                        {showCall &&
                                        <div>
                                            <h5>Contacto:</h5>
                                            <Box sx={{ mb: 1, display: "flex" }}>
                                                <p style={{ width: "10%" }}>Telefono:</p>
                                                <TextField variant="standard" sx={{ width: 160, ml: 3, mt: -0.3 }}
                                                    inputProps={TextFieldProp} onChange={handleChangeText} name="telefono"
                                                    size="small" onKeyDownCapture={handleDownTel} autoComplete="off"
                                                    InputProps={{
                                                        //readOnly: true,
                                                        startAdornment: <InputAdornment position="start"
                                                        sx={{
                                                            '& .MuiTypography-root':{
                                                                fontSize: "12px"
                                                            }, ml:0.5, mb:0.6
                                                        }}>
                                                            +52</InputAdornment>,
                                                    }}/>
                                            </Box>
                                            <Box sx={{ mb: 1, display: "flex" }}>
                                                <p style={{ width: "10%" }}>Nombre:</p>
                                                <TextField variant="standard" sx={{ width: 200, ml: 3, mt: -0.3 }}
                                                    inputProps={TextFieldProp} onChange={handleChangeText} name="nombre"
                                                    size="small" value={nombre}/>
                                            </Box>
                                            <Box sx={{ mb: 1, display: "flex" }}>
                                                <p style={{ width: "10%" }}>Correo:</p>
                                                <TextField variant="standard" sx={{ width: 160, ml: 3, mt: -0.3 }}
                                                    inputProps={TextFieldProp} onChange={handleChangeText} name="correo"
                                                    size="small" value={correo}/>
                                            </Box>
                                        </div>
                                        }
                                        {showOficio &&
                                        <div>
                                            <div>
                                                <Box sx={{ mb: 1, display: "flex", alignItems:"center" }}>
                                                    <p style={{ width: "21%", fontSize:12.5 }}>No. Oficio:</p>
                                                    <TextField variant="standard" sx={{ width: 170, mt: -0.3 }}
                                                        inputProps={TextFieldProp} onChange={handleChangeText} name="oficio"
                                                        size="small" />
                                                </Box>
                                                <Box sx={{ mb: 1, display: "flex", alignItems:"center" }}>
                                                    <p style={{ width: "21%", fontSize:12.5 }}>No. Ticket del Cliente:</p>
                                                    <TextField variant="standard" sx={{ width: 170, mt: -0.3 }}
                                                        inputProps={TextFieldProp} onChange={handleChangeText} name="num_ticket"
                                                        size="small" />
                                                </Box>
                                                <Box sx={{ mb: 1, display: "flex", alignItems:"center" }}>
                                                    <p style={{ width: "21%", fontSize:12.5 }}>Folio Seg. del Cliente:</p>
                                                    <TextField variant="standard" sx={{ width: 170, mt: -0.3 }}
                                                        inputProps={TextFieldProp} onChange={handleChangeText} name="folio"
                                                        size="small" />
                                                </Box>
                                            </div>
                                            
                                            <Divider/>
                                            
                                            <div>
                                                <h5>Contacto:</h5>
                                                <Box sx={{ mb: 1, display: "flex" }}>
                                                    <p style={{ width: "21%" }}>Nombre:</p>
                                                    <TextField variant="standard" sx={{ width: 170, mt: -0.3 }}
                                                        inputProps={TextFieldProp} onChange={handleChangeText} name="nombre"
                                                        size="small" />
                                                </Box>
                                                <Box sx={{ mb: 1, display: "flex" }}>
                                                    <p style={{ width: "21%" }}>Telefono:</p>
                                                    <TextField variant="standard" sx={{ width: 170, mt: -0.3 }}
                                                        inputProps={TextFieldProp} onChange={handleChangeText} name="telefono"
                                                        size="small" defaultValue={"+52"}/>
                                                </Box>
                                            </div>
                                        </div>
                                        }
                                        {showRedes &&
                                        <div>
                                            <h5>Contacto:</h5>
                                            <Box sx={{ mb: 1, display: "flex" }}>
                                                <p style={{ width: "10%" }}>Usuario:</p>
                                                <TextField variant="standard" sx={{ width: 160, ml: 3, mt: -0.3 }}
                                                    inputProps={TextFieldProp} onChange={handleChangeText} name="usuario"
                                                    size="small"/>
                                            </Box>
                                            <Box sx={{ mb: 1, display: "flex" }}>
                                                <p style={{ width: "10%" }}>Nombre:</p>
                                                <TextField variant="standard" sx={{ width: 160, ml: 3, mt: -0.3 }}
                                                    inputProps={TextFieldProp} onChange={handleChangeText} name="nombre"
                                                    size="small" />
                                            </Box>
                                            <Box sx={{ mb: 1, display: "flex" }}>
                                                <p style={{ width: "10%" }}>Link:</p>
                                                <TextField variant="standard" sx={{ width: 160, ml: 3, mt: -0.3 }}
                                                    inputProps={TextFieldProp} onChange={handleChangeText} name="link"
                                                    size="small" />
                                            </Box>
                                        </div>
                                        }
                                        {showPeticion &&
                                        <div>
                                            <h5>Contacto:</h5>
                                            <Box sx={{ mb: 1, display: "flex" }}>
                                                <p style={{ width: "10%" }}>Nombre:</p>
                                                <TextField variant="standard" sx={{ width: 160, ml: 3, mt: -0.3 }}
                                                    inputProps={TextFieldProp} onChange={handleChangeText} name="nombre"
                                                    size="small" />
                                            </Box>
                                            <Box sx={{ mb: 1, display: "flex" }}>
                                                <p style={{ width: "10%" }}>Telefono:</p>
                                                <TextField variant="standard" sx={{ width: 160, ml: 3, mt: -0.3 }}
                                                    inputProps={TextFieldProp} onChange={handleChangeText} name="telefono"
                                                    size="small" defaultValue={"+52"}/>
                                            </Box>
                                        </div>
                                        }
                                        {showFalla &&
                                            <FormControl fullWidth>
                                                Falla:
                                                    <Select
                                                        id="Falla"
                                                        value={selectfalla}
                                                        //MenuProps={MenuProps}
                                                        sx={styleSelect}
                                                        onChange={handleChangeFalla}
                                                    >
                                                    {fallas.map((falla, index) => (
                                                        <MenuItem key={index} value={falla.id}>{falla.nombre}</MenuItem>
                                                        ))}
                                                    </Select>
                                            </FormControl>
                                        }
                                        {showInstrucciones &&
                                        <>
                                        <p/>
                                        <Divider>
                                            <Chip label="3" />
                                        </Divider>
                                        <Box
                                            component="form"
                                            sx={{
                                            '& .MuiTextField-root': { mt:1, width: '100%' },
                                            m:1
                                            }}
                                            noValidate
                                            autoComplete="off"
                                        >
                                            <TextField
                                                id="Instrucciones"
                                                multiline
                                                rows={3}
                                                placeholder="Instrucciones"
                                                name="instrucciones"
                                                onChange={handleChangeText}
                                                />
                                        </Box>
                                        <div style={{ marginTop:10 }}>
                                            <Button onClick={FileNew} variant="outlined" startIcon={<CloudUploadIcon />}
                                                sx={{ mr: 2 }}>
                                                    Subir Archivo
                                            </Button>
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,application/pdf"
                                                ref={hiddenFileInput}
                                                onChange={handleChangeFile}
                                                style={{ display: "none" }} />
                                            <p style={{ fontSize: "12px" }}>{nameFile || ""}</p>
                                        </div>
                                        </>
                                        }
                                        <p/>
                                        <div style={{display:"flex", justifyContent:"space-between"}}>
                                            <Button variant="outlined" color="error" onClick={closeModal} 
                                            sx={{marginRight:'10%'}}>
                                                CANCELAR
                                            </Button>
                                            
                                            {showCrear &&
                                            <Button variant="outlined" color="success" onClick={crearReporte}>
                                                CREAR
                                            </Button>
                                            }
                                        </div>
                                    </TabPanel>
                                    <TabPanel value="2" sx={{margin:0, padding:1}}>
                                        <div style={{marginTop:16}}>
                                            <Luminaria dataLuminariaPanel={dataluminaria} showAñadirReporte={false}
                                            accion={"actualizar"}/>
                                        </div>
                                    </TabPanel>
                                    <TabPanel value="3" sx={{margin:0, padding:1, display:"flex", flexDirection:"column"}}>
                                        <Reporte dataReporte={dataGeoJson} tiporeporte={tiporeporte}/>
                                            <Divider>
                                                <Chip label="Histórico" />
                                            </Divider>
                                        <Comentarios ruta={Url + "reportes/" + dataGeoJson.id + "/comentarios"}/>
                                    </TabPanel>
                                </TabContext>
                                </>
                                }
                            </div>
                        </div>
                    </div>
                </Box>
            </Modal>
        
        { isCharging && <LoaderIndicator /> }

    </div>
    );
}

export default ModalNewReporte;