import React, { useState, useEffect, useRef } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

import axios from 'axios'

import { Url } from "../../constants/global";
import LoaderIndicator from "../../layout/LoaderIndicator/LoaderIndicator";
import "./MapGoogle.scss";
import mapStyle from "./MapGoogleStyle.jsx"

import { useNavigate} from "react-router-dom";

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ClearIcon from '@mui/icons-material/Clear';
import { Box, Button, Chip, Divider, FormControl, IconButton, InputAdornment, MenuItem,
    Paper, Select, Skeleton, Tab, TextField } from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import Reporte from '../Tables/Reportes/Reportes/Reporte';
import Comentarios from '../Comentarios/Comentario';
import Luminaria from '../Luminaria/Luminaria';

//Ícono de búsqueda para el radio del mapa
import GpsFixedIcon from '@mui/icons-material/GpsFixed';

const MapGoogle = (props) => {
  const mapRef = useRef(null);

  const MySwal = withReactContent(Swal);
  const user = JSON.parse(localStorage.getItem('user_datos'));
  const Navigate = useNavigate();

  const searchBoxRef = useRef(null);
  const token = localStorage.getItem('token');
  const id_proyect = localStorage.getItem('id_proyecto')
  const [ isCharging, setisCharging ] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState(null);

  const [value, setValue] = React.useState('1');
  
  const [showForm] = useState(true)
  const [showmoreinfo, setshowmoreinfo] = useState(false)

  const [dataluminaria, setdataluminaria] = useState([])
  const [dataGeoJson, setdataGeoJson] = useState(0)
  const [tiporeporte, setiporeporte] = useState("")

  const [pdl, setpdl] = useState('')
  const [folioreporte, setfolioreporte] = useState('')

  const [circlepdl, setcirclepdl] = useState(null)
  const [circulosActuales, setcirculosActuales] = useState([])

  const [canales, setCanales] = useState([])
  const [selectcanal, setselectcanal] = React.useState('');

  const [showpaso2, setshowpaso2] = useState(false)
  const [showPeticion, setshowPeticion] = useState(false)
  const [showCall, setshowCall] = useState(false)
  const [showOficio, setshowOficio] = useState(false)
  const [showOmnicanal, setshowOmnicanal] = useState(false)
  const [showJornadasB, setshowJornadasB] = useState(false)
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

  //Latitud y longitud del circulo
  const circleLat = useRef(null);
  const circleLng = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current.map;
      const input = searchBoxRef.current;

      const searchBox = new window.google.maps.places.SearchBox(input);

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

      map.addListener('bounds_changed', () => {
        searchBox.setBounds(map.getBounds());
      });
      
      //Capturando el evento click en el mapa
      map.addListener('mousemove', () => {
        circleLat.current =map.center.lat();
        circleLng.current = map.center.lng(); 
      });
     
      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();

        if (places.length === 0) {
          return;
        }

        const place = places[0];

        if (!place.geometry) {
          console.error('Place not found:', place);
          return;
        }

        map.panTo(place.geometry.location);
        map.setZoom(17);

        const newXY = {
            latitud : place.geometry.location.lat(),
            longitud: place.geometry.location.lng()
        }
        
        crearcirculo(newXY, mapRef.current.map)

        // Actualizar el estado con la ubicación seleccionada
        setSelectedLocation({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      });
    }
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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

  //Método para colorear el radio

  const pintarRadio = () =>{
    let objLatLng = {
         latitud: circleLat.current,
         longitud: circleLng.current
     };

    crearcirculo(objLatLng, mapRef.current.map);
    mapRef.current.map.setZoom(16);

    setSelectedLocation({
        lat: circleLat.current,
        lng: circleLng.current,
      });
  }


  const alerta = async (infoLuminariaGeoJson) => {
    setValue('1')
    setshowmoreinfo(true)
    setshowpaso2(true)
    setshowFalla(true)
    setselectcanal(3)
    setshowCall(true)
    buscarkillkizeo(infoLuminariaGeoJson)
    await axios.get(Url + 'luminarias/'+infoLuminariaGeoJson.id, {
        headers: {
            Authorization : token,
        }
      })
    .then(res =>  {
        setdataluminaria(res.data);
      })
    .catch(err => console.log(err))
  }

  const limpiarform = () => {
    setselectcanal('')
    //------------------------
    setshowpaso2(false)
    setshowCall(false)
    setshowOficio(false)
    setshowPeticion(false)
    setshowRedes(false)
    //
    setselectfalla('')
    setshowFalla(false)
    //
    settelefono('')
    setnombre('')
    setcorreo('')
    setlink('')
    setFolio('')
    setnumticket('')
    setOficio('')
    setusuario('')
    setnameFile('')
    setfile(null)
    setinstrucciones('')
    //
    setinstrucciones('')
    setshowInstrucciones(false)
    setshowCrear(false)
  }

  const cancelar = () => {
    limpiarform()
  }

  const crearcirculo = (XYBusqueda, map) => {
    setisCharging(true)
    limpiarcirculos()

    if(circlepdl !== null)
    {
        circlepdl.setMap(null);
    }

    var url = Url + 'luminarias?proyecto='+id_proyect+'&latitud='+XYBusqueda.latitud+
                      '&longitud='+XYBusqueda.longitud;
    axios.get(url, {
        headers: {
            Authorization : token,
        }
      })
    .then(res =>  {
          const nuevosCirculos = [];
          
          for (let index = 0; index < res.data.features.length; index++) {
              (function(index) {
                  var coordenadas = res.data.features[index].geometry.coordinates;
                  var description = res.data.features[index].properties;

                  var center = { lat: coordenadas[1], lng: coordenadas[0] };
          
                  const cityCircle = new props.google.maps.Circle({
                      strokeColor: description.reporte_activo === 0 ? "#2ECC71" : "red",
                      strokeOpacity: 0.8,
                      strokeWeight: 2,
                      fillColor: description.reporte_activo === 0 ? "#2ECC71" : "#E74C3C",
                      fillOpacity: 0.5,
                      map,
                      center: center,
                      radius: 3,
                  });
          
                  // Agregar un evento onclick al círculo
                  cityCircle.addListener('click', () => {
                      alerta(description);
                      setSelectedLocation(center)
                      setValue('1')
                      limpiarform()
                      setshowmoreinfo(true)
                      setshowpaso2(true)
                      setshowFalla(true)
                      setselectcanal(3)
                      setshowCall(true)
                  });

                  nuevosCirculos.push(cityCircle);
              })(index);
          }

          // Usa la función de retorno en setcirculosActuales para garantizar el uso del estado más reciente
          setcirculosActuales(prevCirculos => {
            // Eliminar círculos antiguos de manera segura
            prevCirculos.forEach(circulo => {
              circulo.setMap(null);
            });
    
            return nuevosCirculos;
          });

          setisCharging(false)
      })
      .catch(err => {
          console.log(err)}
      )
  }

  const buscarPDL = async (event) => {
    if (event.key === "Enter") {
        var pdlfinal
        pdl ==='' ? pdlfinal= null : pdlfinal = pdl

        if(circlepdl !== null)
        {
            circlepdl.setMap(null);
        }

        if (circulosActuales.length > 0) {
            limpiarcirculos()
          }
        
        setisCharging(true)
        await axios.get(Url + 'luminarias?proyecto='+id_proyect+'&pdl='+ pdlfinal, {
            headers: {
                Authorization : token,
            }
            })
          .then(res =>  {
              setisCharging(false)

              if (res.data.features.length !== 0) {
                var coordenadaspdl = res.data.features[0].geometry.coordinates;
                var descriptionpdl = res.data.features[0].properties;

                var centerpdl = { lat: coordenadaspdl[1], lng: coordenadaspdl[0] };
                setSelectedLocation(centerpdl)

                mapRef.current.map.setCenter(centerpdl);
                mapRef.current.map.setZoom(17);

                var map = mapRef.current.map

                const cityCirclePdl = new props.google.maps.Circle({
                    strokeColor: descriptionpdl.reporte_activo === 0 ? "#2ECC71" : "red",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: descriptionpdl.reporte_activo === 0 ? "#2ECC71" : "#E74C3C",
                    fillOpacity: 0.5,
                    map,
                    center: centerpdl,
                    radius: 3,
                });
                
                alerta(descriptionpdl)
                setcirclepdl(cityCirclePdl)

              }else{
                MySwal.fire({
                  title: "No existe la luminaria",
                  text: "",
                  icon: "info"
                });
              }
            })
          .catch(err => {
            console.log(err)
            setisCharging(false)
            MySwal.fire({
                title: "Error en la Conexión",
                text: "",
                icon: "error"
              });
        })
    }
  }

  const buscarPDLDirecto = async (pdlprop) => {

        if(circlepdl !== null)
        {
            circlepdl.setMap(null);
        }

        if (circulosActuales.length > 0) {
            limpiarcirculos()
          }
        
        setisCharging(true)
        await axios.get(Url + 'luminarias?proyecto='+id_proyect+'&pdl='+ pdlprop, {
            headers: {
                Authorization : token,
            }
            })
          .then(res =>  {
              setisCharging(false)

              if (res.data.features.length !== 0) {
                var coordenadaspdl = res.data.features[0].geometry.coordinates;
                var descriptionpdl = res.data.features[0].properties;

                var centerpdl = { lat: coordenadaspdl[1], lng: coordenadaspdl[0] };
                setSelectedLocation(centerpdl)

                mapRef.current.map.setCenter(centerpdl);
                mapRef.current.map.setZoom(17);

                var map = mapRef.current.map

                const cityCirclePdl = new props.google.maps.Circle({
                    strokeColor: descriptionpdl.reporte_activo === 0 ? "#2ECC71" : "red",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: descriptionpdl.reporte_activo === 0 ? "#2ECC71" : "#E74C3C",
                    fillOpacity: 0.5,
                    map,
                    center: centerpdl,
                    radius: 3,
                });
                
                alerta(descriptionpdl)
                setcirclepdl(cityCirclePdl)

              }else{
                MySwal.fire({
                  title: "No existe la luminaria",
                  text: "",
                  icon: "info"
                });
              }
            })
          .catch(err => console.log(err))
    }

  const limpiarpdl = () => {
    setpdl('')
    setSelectedLocation(null)
    setdataGeoJson(0)
    setdataluminaria([])
    setshowmoreinfo(false)
    if(circlepdl !== null)
    {
        circlepdl.setMap(null);
    }
  }

  const buscarReporte = async (event) => {
    if (event.key === "Enter") {
        var folioreportefinal
        folioreporte ==='' ? folioreportefinal= null : folioreportefinal = folioreporte

        if(circlepdl !== null)
        {
            circlepdl.setMap(null);
        }

        if (circulosActuales.length > 0) {
            limpiarcirculos()
          }
        
        setisCharging(true)
        await axios.get(Url + 'reportes/killkizeo/'+ folioreportefinal, {
            headers: {
                Authorization : token,
            }
            })
          .then(res =>  {
                buscarPDLDirecto(res.data.luminaria.pdl_id)
            })
          .catch(err => {
            setisCharging(false)
            MySwal.fire({
                title: "Reporte no encontrado",
                icon: "error"
              });
            console.log(err)})
    }
  }

  const limpiarreporte = () => {
    setfolioreporte('')
    setSelectedLocation(null)
    setdataGeoJson(0)
    setdataluminaria([])
    setshowmoreinfo(false)
    if(circlepdl !== null)
    {
        circlepdl.setMap(null);
    }
  }

  //Eventos del Form
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

    if (event.target.value === 14) {
        setshowOmnicanal(true)
    } else {
        setshowOmnicanal(false)
    }

    if (event.target.value === 15) {
        setshowJornadasB(true)
    } else {
        setshowJornadasB(false)
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

            //console
            await axios.get(Url + "reporte_eventos/telefono/"+telefono, {
                headers: {
                    Authorization : token,
                }
            })
            .then(res =>  {
                //console.log(res.data[0].nombre_completo)
                setnombre(res.data.nombre_completo)
                setcorreo(res.data.email)
                setisCharging(false)
            })
            .catch(err => {
                setisCharging(false)
                console.log(err)
                setnombre("")
                setcorreo("")})
            }
        }
        /*else{
            setnombre("")
            setcorreo("")
        }*/
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

    let changecanal = selectcanal

    if ([14,15].includes(changecanal)) {
        changecanal = 4
    }

    const new_report = {
        "luminaria":        dataluminaria.id,
        "falla":            selectfalla,
        "canal":            changecanal,
        "usuario":          parseInt(user.id),
        "folio_proyecto":   folio,
        "oficio_proyecto":  oficio,
        "correo_contacto":  correo,
        "num_ticket":       numticket,    
        "imagenes":         id_file,
        "nombre_contacto":  nombre,
        "telefono_contacto":    telefono,
        "username_red_social":  usuario,
        "post_red_social":  link,
        "instrucciones_mantenimiento": instrucciones!=='' ? instrucciones+ ' - ' + new Date().toLocaleDateString('en-GB') : ''
    }

   await axios.post(Url + 'reportes', new_report, {
        headers: {
            Authorization : token,
        }
    })
    .then(res =>  {
        if (res.status === 201) {
            MySwal.fire({
                icon: 'success',
                html: '<h3>Se ha creado correctamente el reporte con Folio: ' + res.data.killkizeo
                +'</h3> <h2>Tiempo Restante: <b>'+res.data.sla_atencion_restante+' hrs</b></h2>',
            })
            .then((result) => {
                if (result.isConfirmed) {
                    limpiarform()
                }
            })
        }else{
            MySwal.fire({
                icon: 'success',
                html: '<h3>Se ha adjuntado al archivo del reporte con Folio: ' + res.data.killkizeo
                +'</h3> <h2>Tiempo Restante: <b>'+res.data.sla_atencion_restante+' hrs</b></h2>',
            })
            .then((result) => {
                if (result.isConfirmed) {
                    limpiarform()
                }
            })
        }
    })
    .catch(err => console.log(err))
}

const limpiarcirculos = () => {
    if (circulosActuales && circulosActuales.length > 0) {
        circulosActuales.forEach(circulo => {
          circulo.setMap(null);
        });

        setcirculosActuales([])
      }
}

const limpiarsearchbox = () => {
    searchBoxRef.current.value = ''
    limpiarcirculos()
}

const centrarMapa = (proyecto) => {
    var ProyectoCoordenadas = {}

    switch (proyecto) {
        case "1":
            ProyectoCoordenadas = {
                lat : 19.0409511,
                lng : -98.221976
            }
            break;

        case "2":
            ProyectoCoordenadas = {
                lat : 31.866396,
                lng : -116.596191
            }
            break;
        
        case "3":
            ProyectoCoordenadas = {
                lat : 20.629081,
                lng : -87.074004
            }
            break;

        case "4":
            ProyectoCoordenadas = {
                lat : 19.059260195326157,
                lng : -98.29559007022044
            }
            break;

        case "5":
            ProyectoCoordenadas = {
                lat : 19.049495448888855,
                lng : -98.2140849071712
            }
            break;

        case "6":
            ProyectoCoordenadas = {
                lat : 19.06114759114169,
                lng : -98.30773870118088
            }
            break;
            
        default:
            break;
    }

    return ProyectoCoordenadas
}

const TextFieldProp = {
    style: {
      fontSize: "12px",
  },
};

const styleSelect = {
    height: "25px"   
}

const mapStyles = {
    width: '55%',
    height: '91%',
};


  return (
        <div>
            <Box sx={{ width: 300, zIndex: 1, position: 'absolute', right: "40.3%", top: 58, 
                    height:45, backgroundColor:"white", borderRadius:10, display:"flex",
                    border:"2px solid gray"}}>
                <input
                ref={searchBoxRef}
                placeholder="Buscar Dirección"
                type="text"
                style={{ width: '88%', border:0, height:40, marginLeft:20, padding:5}} />
                <IconButton onClick={limpiarsearchbox}>
                    <ClearIcon/>
                </IconButton>
            </Box>

            <Box sx={{ width: 215, zIndex: 1, position: 'absolute', left: "70px", top: 58, 
                    height:45, backgroundColor:"white", borderRadius:10, display:"flex", border:"2px solid gray"}}>
                <TextField variant='standard' placeholder='PDL' sx={{height:40, marginLeft:2, pt:1, 
                width:"85%"}} value={pdl} onChange={(e) => setpdl(e.target.value)} 
                onKeyDownCapture={buscarPDL} autoComplete='off'/>
                <IconButton onClick={limpiarpdl}>
                    <ClearIcon/>
                </IconButton>
            </Box>

            <Box sx={{ width: 215, zIndex: 1, position: 'absolute', left: "70px", top: 108, 
                    height:45, backgroundColor:"white", borderRadius:10, display:"flex", border:"2px solid gray"}}>
                <TextField variant='standard' placeholder='Folio Reporte' sx={{height:40, marginLeft:2, pt:1}}
                value={folioreporte} onChange={(e) => setfolioreporte(e.target.value)} onKeyDownCapture={buscarReporte}
                autoComplete='off'/>
                <IconButton onClick={limpiarreporte}>
                    <ClearIcon/>
                </IconButton>
            </Box>
            
            {/* Botón para pintar el radio  */}
            <Box sx={{ width: 45, zIndex: 1, position: 'absolute', left: "70px", top: "90%", 
                    height:45, backgroundColor:"white", borderRadius:10, display:"flex", border:"2px solid gray"}}>
                <IconButton onClick={pintarRadio} sx={{ml:0.3}}>
                    <GpsFixedIcon/>
                </IconButton>
            </Box>

            {showForm &&
                <Paper sx={{width:"40%", zIndex:3, position:"absolute", right:0, 
                        height:"100%"}}>
                        {/* Ajustes de diseño para las etiquetas */}
                    <div>
                     <div className='grid_cuadrilla'>
                     
                     <label>PDL: <b>{dataluminaria.pdl_id||"--"}</b> </label>
                     <div className='texto-derecha'>
                        {showmoreinfo &&
                            <div>
                                {dataGeoJson !== 0 ?
                                    <div>
                                        {tiporeporte !== "reincidencia" ?
                                            <b>Reporte con Folio: {dataGeoJson.killkizeo}</b>
                                            :
                                            <b>Reporte Terminado con Folio: {dataGeoJson.killkizeo}</b>
                                        }       
                                    </div>
                                    :
                                     <b>Sin reporte</b>
                                }
                            </div>
                        }
                    </div>
                     </div>
        
                    <div className='grid_cuadrilla'>
                        <label>Calle: {dataluminaria.calle||"--"}</label>
                        <label className='texto-derecha'>Colonia: {dataluminaria.colonia||"--"}</label> 
                    </div>             
                    </div>

                    <Divider/>
                    {showmoreinfo ?
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
                        <TabPanel value="1" sx={{margin:0, padding:2, overflow:"auto", height: "calc(100% - 140px)"}}>                            
                            <Divider>
                                <Chip label="1" />
                            </Divider>
                            <FormControl fullWidth>
                                Canal:
                                <Select
                                    id="Canal"
                                    //defaultValue='3'
                                    value={selectcanal}
                                    //MenuProps={MenuProps}
                                    sx={styleSelect}
                                    onChange={handleChangeSelect}
                                >
                                    {canales.map((canal, index) => (
                                        <MenuItem key={index} value={canal.id} name={canal.nombre}>
                                            {canal.nombre}</MenuItem>
                                    ))}
                                    <MenuItem value={14} name={"Omnicanal"}>Omnicanal</MenuItem>
                                    <MenuItem value={15} name={"JornadasB"}>
                                        Jornadas de Bienestar</MenuItem>
                                </Select>
                            </FormControl>
                            {showpaso2 &&
                            <>  
                                <p />
                                <Divider>
                                    <Chip label="2" />
                                </Divider>
                            </>
                            }
                            {showFalla &&
                                <FormControl fullWidth sx={{mb:2}}>
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
                            {showCall &&
                                <div>
                                    <h5>Contacto:</h5>
                                    <Box sx={{ mb: 1, display: "flex"}}>
                                        <p style={{ width: "10%" }}>Telefono:</p>
                                        <TextField variant="standard" sx={{ width: "100%", ml: 3, mt: -0.3 }}
                                            inputProps={TextFieldProp} onChange={handleChangeText} name="telefono"
                                            size="lg" onKeyDownCapture={handleDownTel} autoComplete="off"
                                            InputProps={{
                                            //readOnly: true,
                                            startAdornment: <InputAdornment position="start"
                                                sx={{
                                                    '& .MuiTypography-root':{
                                                        fontSize: "12px"
                                                    }, ml:0.5, mb:0
                                                }}>
                                                +52</InputAdornment>,
                                            }}/>
                                    </Box>
                                    <Box sx={{ mb: 1, display: "flex" }}>
                                        <p style={{ width: "10%" }}>Nombre:</p>
                                        <TextField variant="standard" sx={{ width: "100%", ml: 3, mt: -0.3 }}
                                            inputProps={TextFieldProp} onChange={handleChangeText} name="nombre"
                                            size="small" value={nombre}/>
                                    </Box>
                                    <Box sx={{ mb: 1, display: "flex" }}>
                                        <p style={{ width: "10%" }}>Correo:</p>
                                        <TextField variant="standard" sx={{ width: "100%", ml: 3, mt: -0.3 }}
                                            inputProps={TextFieldProp} onChange={handleChangeText} name="correo"
                                            size="small" value={correo}/>
                                    </Box>
                                </div>
                            }
                            {showOficio &&
                                <>
                                    <div>
                                        <Box sx={{ mb: 1, display: "flex", alignItems:"center" }}>
                                            <p style={{ width: "21%", fontSize:12.5 }}>No. Oficio:</p>
                                            <TextField variant="standard" sx={{ width: "100%", mt: -0.3 }}
                                                inputProps={TextFieldProp} onChange={handleChangeText} name="oficio"
                                                size="small" />
                                        </Box>
                                    </div>        
                                    <Divider/>                                            
                                    <div>
                                        <h5>Contacto:</h5>
                                        <Box sx={{ mb: 1, display: "flex" }}>
                                            <p style={{ width: "21%" }}>Nombre:</p>
                                            <TextField variant="standard" sx={{ width: "100%", mt: -0.3 }}
                                                inputProps={TextFieldProp} onChange={handleChangeText} name="nombre"
                                                size="small" />
                                        </Box>
                                        <Box sx={{ mb: 1, display: "flex" }}>
                                            <p style={{ width: "21%" }}>Telefono:</p>
                                            <TextField variant="standard" sx={{ width: "100%", mt: -0.3 }}
                                                inputProps={TextFieldProp} onChange={handleChangeText} name="telefono"
                                                size="small" defaultValue={"+52"}/>
                                        </Box>
                                    </div>
                                </>
                            }
                            {showOmnicanal &&
                                <>
                                    <div>
                                        <Box sx={{ mb: 1, display: "flex", alignItems:"center" }}>
                                            <p style={{ width: "21%", fontSize:12.5 }}>No. Ticket del Cliente:</p>
                                            <TextField variant="standard" sx={{ width: "100%", mt: -0.3 }}
                                                inputProps={TextFieldProp} onChange={handleChangeText} name="num_ticket"
                                                size="small" />
                                        </Box>
                                    </div>        
                                    <Divider/>                                            
                                    <div>
                                        <h5>Contacto:</h5>
                                        <Box sx={{ mb: 1, display: "flex" }}>
                                            <p style={{ width: "21%" }}>Nombre:</p>
                                            <TextField variant="standard" sx={{ width: "100%", mt: -0.3 }}
                                                inputProps={TextFieldProp} onChange={handleChangeText} name="nombre"
                                                size="small" />
                                        </Box>
                                        <Box sx={{ mb: 1, display: "flex" }}>
                                            <p style={{ width: "21%" }}>Telefono:</p>
                                            <TextField variant="standard" sx={{ width: "100%", mt: -0.3 }}
                                                inputProps={TextFieldProp} onChange={handleChangeText} name="telefono"
                                                size="small" defaultValue={"+52"}/>
                                        </Box>
                                    </div>
                                </>
                            }
                            {showJornadasB &&
                                <>
                                    <div>
                                        <Box sx={{ mb: 1, display: "flex", alignItems:"center" }}>
                                            <p style={{ width: "21%", fontSize:12.5 }}>Folio Seg. del Cliente:</p>
                                            <TextField variant="standard" sx={{ width: "100%", mt: -0.3 }}
                                                inputProps={TextFieldProp} onChange={handleChangeText} name="folio"
                                                size="small" />
                                        </Box>
                                    </div>        
                                    <Divider/>                                            
                                    <div>
                                        <h5>Contacto:</h5>
                                        <Box sx={{ mb: 1, display: "flex" }}>
                                            <p style={{ width: "21%" }}>Nombre:</p>
                                            <TextField variant="standard" sx={{ width: "100%", mt: -0.3 }}
                                                inputProps={TextFieldProp} onChange={handleChangeText} name="nombre"
                                                size="small" />
                                        </Box>
                                        <Box sx={{ mb: 1, display: "flex" }}>
                                            <p style={{ width: "21%" }}>Telefono:</p>
                                            <TextField variant="standard" sx={{ width: "100%", mt: -0.3 }}
                                                inputProps={TextFieldProp} onChange={handleChangeText} name="telefono"
                                                size="small" defaultValue={"+52"}/>
                                        </Box>
                                    </div>
                                </>
                            }
                            {showRedes &&
                                <div>
                                    <h5>Contacto:</h5>
                                    <Box sx={{ mb: 1, display: "flex" }}>
                                        <p style={{ width: "10%" }}>Usuario:</p>
                                        <TextField variant="standard" sx={{ width: "100%", ml: 3, mt: -0.3 }}
                                            inputProps={TextFieldProp} onChange={handleChangeText} name="usuario"
                                            size="small"/>
                                    </Box>
                                    <Box sx={{ mb: 1, display: "flex" }}>
                                        <p style={{ width: "10%" }}>Nombre:</p>
                                        <TextField variant="standard" sx={{ width: "100%", ml: 3, mt: -0.3 }}
                                            inputProps={TextFieldProp} onChange={handleChangeText} name="nombre"
                                            size="small" />
                                    </Box>
                                    <Box sx={{ mb: 1, display: "flex" }}>
                                        <p style={{ width: "10%" }}>Link:</p>
                                        <TextField variant="standard" sx={{ width: "100%", ml: 3, mt: -0.3 }}
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
                                        <TextField variant="standard" sx={{ width: "100%", ml: 3, mt: -0.3 }}
                                            inputProps={TextFieldProp} onChange={handleChangeText} name="nombre"
                                            size="small" />
                                    </Box>
                                    <Box sx={{ mb: 1, display: "flex" }}>
                                        <p style={{ width: "10%" }}>Telefono:</p>
                                        <TextField variant="standard" sx={{ width: "100%", ml: 3, mt: -0.3 }}
                                            inputProps={TextFieldProp} onChange={handleChangeText} name="telefono"
                                            size="small" defaultValue={"+52"}/>
                                    </Box>
                                </div>
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
                                <Button variant="outlined" color="error" onClick={cancelar}
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
                        <TabPanel value="2" sx={{margin:0, padding:2, overflow:"auto", height: "calc(100vh - 160px)"}}>
                            <div style={{marginTop:16}}>
                                <Luminaria dataLuminariaPanel={dataluminaria} showAñadirReporte={false}
                                    accion={"actualizar"}/>
                            </div>
                        </TabPanel>
                        <TabPanel value="3" sx={{margin:0, padding:1, display:"flex", 
                                flexDirection:"column", overflow:"auto", height: "calc(100vh - 160px)"}}>
                            <Reporte dataReporte={dataGeoJson} tiporeporte={tiporeporte}/>
                            <Divider>
                                <Chip label="Histórico" />
                            </Divider>
                            <Comentarios ruta={Url + "reportes/" + dataGeoJson.id + "/comentarios"}/>
                        </TabPanel>
                    </TabContext>
                    :
                    <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center",
                                paddingTop:10}}>
                        <Skeleton animation="wave" width={"95%"} height={35}/>
                        <Skeleton animation="wave" width={"90%"} height={60}/>
                        <Skeleton animation="wave" width={"95%"} height={35}/>
                        <Skeleton animation="wave" width={"95%"} height={35}/>
                    </div>
                    }
                </Paper>
            }
          
          <Map
              ref={mapRef}
              google={props.google}
              zoom={15}
              style={mapStyles}
              //gestureHandling='cooperative'
              styles={mapStyle}
              initialCenter={centrarMapa(id_proyect)}
          >
              {/* Renderizar el marcador si hay una ubicación seleccionada */}
              {selectedLocation && <Marker position={selectedLocation} />}
              
              {isCharging && <LoaderIndicator />}
          </Map>
            
        </div>  
  );
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAiXWOxSPvO0AViX6hlFjBTP3dg5NH83FQ',
})(MapGoogle);