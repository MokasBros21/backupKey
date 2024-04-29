import React, { useRef, useState, useEffect} from "react";
import mapboxgl from "mapbox-gl";
//import TopBar  from "../../layout/TopBar/TopBar";
import axios from 'axios'
import WarningUser from '../../assets/warningprueba.png'
import Exclamation from '../../assets/important.png'

import "./MapReportesAlta.scss";
import classNames from "classnames";
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content';

import AddIcon from '@mui/icons-material/Add';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';

import LoaderIndicator from '../../layout/LoaderIndicator/LoaderIndicator';
import { Url } from "../../constants/global";
import { Button, Chip, MenuItem, Modal, Paper, Select } from "@mui/material";
import { FormControl } from "@material-ui/core";
import { useNavigate } from "react-router";

import MapboxDraw from "@mapbox/mapbox-gl-draw";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import Panel from "../Panel Lateral/Panel";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Tab } from "@mui/material";
import Reporte from "../Tables/Reportes/Reportes/Reporte";
import Comentarios from "../Comentarios/Comentario";

mapboxgl.accessToken = 'pk.eyJ1IjoibWlndWVsdHJhZmZpYyIsImEiOiJjbG01Z2U2cW0wajdiM3Bsb2N6ZGhrN2lxIn0.hMkzztmUbOf-N9uToXeBwA';

const MapReportesAlta = () => {
    const mapReportesAlta = useRef(null);
    const map = useRef(null);
    let [lat] = useState(19.0409511);
    let [lng] = useState(-98.221976);
    let [zoom] = useState(12);

    const [total, settotal] = useState(0)
    const markers = useRef([]);
    const pdls_id = useRef([]);
    const clicks = useRef({});
    const [ids_lum, setids_lum] = useState('')

    const MySwal = withReactContent(Swal);

    const [isCharging, setisCharging ] = useState(false);

    const [cuadrilla, setcuadrilla] = React.useState([])
    const [cuadrilla2, setcuadrilla2] = React.useState([])
    const [datacuadrilla, setdatacuadrilla] = useState(null)
    const [openModal, setopenModal] = useState(false)
    const [showAsignar, setshowAsignar] = useState(false)

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user_datos'));
    const id_proyect = localStorage.getItem('id_proyecto')

    const [estatus, setestatus] = useState({
        Creado      : true,
        Asignado    : true,
        EnProceso   : true,
        Incompleto  : true
    })

    const [selectresponsable, setselectresponsable] = useState("")
    const [dataresponsables, setdataresponsables] = useState([])

    const [showPanel, setShowPanel] = useState(false);
    const [Reporteporid, setReporteporid] = useState([])

    const Navigate = useNavigate()

    const ubicacionProyecto = () => {
        switch (id_proyect) {
            case "2":
                lng = -116.596191
                lat = 31.866396
                zoom = 12
                break;
            
            case "3":
                lng = -87.074004
                lat = 20.629081
                zoom = 12.9
                break;
            
            case "4":
                lng = -98.29855783279912
                lat = 19.050966324235745
                zoom = 14
                break;

            case "5":
                lat = 19.049495448888855
                lng = -98.2140849071712
                zoom = 11
                break;

            case "6":
                lat = 19.06114759114169
                lng = -98.30773870118088
                zoom = 12.9
                break;
                
            default:
                break;
        }
    }

    const traerResponsables = () => {
        setselectresponsable(" ")

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
                setdataresponsables(res.data)
            })
            .catch(err => console.log(err))
    }

    //Para actualizar Mapa después de que se asignen
    const traerReportesMapa = async () => {
        var url = Url + 'reportes/geojson?proyecto='+id_proyect+'&estados=CREADO,ASIGNADO,EN PROCESO,INCOMPLETO'

        await axios.get(url, {
            headers: {
                Authorization : token,
            }
          })
        .then(res =>  {
            map.current.getSource('xample_points').setData(res.data);
        })
        .catch(err => console.log(err))
    }

    useEffect(() => {

        if (token) {
        ubicacionProyecto()
        traerResponsables()

        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapReportesAlta.current,
            style: 'mapbox://styles/mapbox/navigation-night-v1',
            center: [lng, lat],
            zoom: zoom,
            boxZoom: true,
            });

            map.current.on('load', function() {

                const draw = new MapboxDraw({
                    displayControlsDefault: false,
                    // Select which mapbox-gl-draw control buttons to add to the map.
                    controls: {
                        polygon: true,
                        trash: true
                    },
                    // Set mapbox-gl-draw to draw by default.
                    // The user does not have to click the polygon control button first.
                    //defaultMode: 'draw_polygon'
                });
                
                //map.current.addControl(draw, 'bottom-left');
            
                setisCharging(true)

                if ([3,4,5,11].includes(user.rol)) {
                var url = Url + 'reportes/geojson?proyecto='+id_proyect+'&estados=CREADO,ASIGNADO,EN PROCESO,INCOMPLETO'

                axios.get(url, {
                    headers: {
                        Authorization : token,
                    }
                  })
                .then(res =>  {
                    map.current.addSource('xample_points', {
                        type: 'geojson',
                        data: res.data
                        });

                        map.current.loadImage(
                          WarningUser,
                          function(error, image) {
                            if (error) throw error;
                            map.current.addImage('custom-icon', image);
                          }
                        );

                        /*map.current.loadImage(
                            Antifaz,
                            function(error, image2) {
                              if (error) throw error;
                              map.current.addImage('antifaz-image', image2);
                            }
                          );*/

                        map.current.loadImage(
                            Exclamation,
                            function(error, image3) {
                              if (error) throw error;
                              map.current.addImage('exclamation', image3);
                            }
                          );

                        map.current.addLayer({
                          'id': 'xample_points_icon',
                          'type': 'symbol',
                          'source': 'xample_points',
                          'layout': {
                            'icon-image': 'custom-icon', // Nombre del icono que agregaste al mapa
                            'icon-size': 0.3,
                            'icon-anchor': 'bottom',
                            'icon-offset': [0, -10] // Ajusta la posición vertical del icono en relación con el círculo
                          },
                          'filter': ['!=', ['get', 'reincidencia'], 0] // Filtrar para mostrar solo cuando 'reporte_activo' no sea 0
                        });

                        /*map.current.addLayer({
                            'id': 'xample_points_icon2',
                            'type': 'symbol',
                            'source': 'xample_points',
                            'layout': {
                              'icon-image': 'antifaz-image', // Nombre del icono que agregaste al mapa
                              'icon-size': 0.05,
                              'icon-anchor': 'bottom',
                              'icon-offset': [0, -10] // Ajusta la posición vertical del icono en relación con el círculo
                            },
                            'filter': ['!=', ['get', 'robado'], false] // Filtrar para mostrar solo cuando 'reporte_activo' no sea 0
                          });*/

                        map.current.addLayer({
                            'id': 'xample_points_icon2',
                            'type': 'symbol',
                            'source': 'xample_points',
                            'layout': {
                              'icon-image': 'exclamation', // Nombre del icono que agregaste al mapa
                              'icon-size': 0.25,
                              'icon-anchor': 'bottom',
                              'icon-offset': [0, -20] // Ajusta la posición vertical del icono en relación con el círculo
                            },
                            'filter': ['any', ['==', ['get', 'motivo_incompleto'], 'INACTIVIDAD'], ['==', ['get', 'motivo_incompleto'], 'REQUIERE MATERIAL']]
                          });
                          
                        //
                        map.current.addLayer({
                        'id': 'xample_points',
                        'type': 'circle',
                        'source': 'xample_points',
                       
                          'paint': {
                          'circle-radius': 9,
                          'circle-blur': 0.5,
                          'circle-stroke-width': 0.1,
                          'circle-color': [
                                'match',
                                ['get', 'reincidencia'],
                                0, [   'match',
                                            ['get', 'estado'],
                                            'CREADO','#2B88EB',
                                            'ASIGNADO', '#D35400',
                                            'EN PROCESO', '#F4D03F',
                                            'INCOMPLETO', '#8E44AD',
                                            'yellow'
                                        ],
                                'red'
                            ],
                          'circle-stroke-color': 'white'
                          }  
                        });
                        
                  setisCharging(false)
                  })
                .catch(err => {
                    
                    setisCharging(false)
                    console.log(err)
                })
                }

                /*
                if (user.rol === 5) {
                    var url = Url + 'reportes/geojson?proyecto='+id_proyect+'&supervisor='+user.id

                    axios.get(url, {
                        headers: {
                            Authorization : token,
                        }
                      })
                    .then(res =>  {
                        map.current.addSource('xample_points', {
                            type: 'geojson',
                            data: res.data
                            });
                              
                            //
                            map.current.addLayer({
                            'id': 'xample_points',
                            'type': 'circle',
                            'source': 'xample_points',
                           
                              'paint': {
                              'circle-radius': 9,
                              'circle-blur': 0.5,
                              'circle-stroke-width': 0.1,
                              'circle-color': [
                                    'match',
                                    ['get', 'reincidencia'],
                                    0, [   'match',
                                                ['get', 'estado'],
                                                'CREADO','#2B88EB',
                                                'ASIGNADO', '#D35400',
                                                'EN PROCESO', '#F4D03F',
                                                'INCOMPLETO', '#8E44AD',
                                                'yellow'
                                            ],
                                    'red'
                                ],
                              'circle-stroke-color': 'white'
                              }  
                            });
                            
                      setisCharging(false)
                      })
                    .catch(err => {
                        
                        setisCharging(false)
                        console.log(err)
                    })

                    var url = Url + 'reportes/geojson?proyecto='+id_proyect+'&estados=CREADO,INCOMPLETO'

                    axios.get(url, {
                        headers: {
                            Authorization : token,
                        }
                      })
                    .then(res =>  {
                        map.current.addSource('xample_points2', {
                            type: 'geojson',
                            data: res.data
                            });
                              
                            //
                            map.current.addLayer({
                            'id': 'xample_points2',
                            'type': 'circle',
                            'source': 'xample_points2',
                           
                              'paint': {
                              'circle-radius': 9,
                              'circle-blur': 0.5,
                              'circle-stroke-width': 0.1,
                              'circle-color': [
                                    'match',
                                    ['get', 'reincidencia'],
                                    0, [   'match',
                                                ['get', 'estado'],
                                                'CREADO','#2B88EB',
                                                'ASIGNADO', '#D35400',
                                                'EN PROCESO', '#F4D03F',
                                                'INCOMPLETO', '#8E44AD',
                                                'yellow'
                                            ],
                                    'red'
                                ],
                              'circle-stroke-color': 'white'
                              }  
                            });
                            
                      setisCharging(false)
                      })
                    .catch(err => {
                        
                        setisCharging(false)
                        console.log(err)
                    })
                    
                }*/

                map.current.on('mouseenter', 'xample_points', () => {
                    map.current.getCanvas().style.cursor = 'pointer'
                  })
                  map.current.on('mouseleave', 'xample_points', () => {
                    map.current.getCanvas().style.cursor = 'default'
                  })
    
                map.current.on('click', 'xample_points', (e) => {
    
                    const coordinates = e.features[0].geometry.coordinates;
                    const description = e.features[0].properties;
    
                    markerClicked(description, coordinates)
                });

                map.current.on('contextmenu', 'xample_points', (e) => {
                    const coordinates = e.features[0].geometry.coordinates;
                    const description = e.features[0].properties;
                
                    abrirInfoPanel(description)
                
                    e.preventDefault();
                });
            })
        }else{
            Navigate("/login")
        }
    },[])

    //Método para markers y para seleccionar reportes a Asignar
    const markerClicked  = (datos, coordinates) => {
        const id = datos.id;
        const estado = datos.estado

        clicks.current[id] = clicks.current[id] || 0;

        if ((clicks.current[id] % 2) === 0) {
            if (estado === "EN PROCESO") {
                MySwal.fire({
                    title: "Confirmación",
                    confirmButtonColor: '#28B463',
                    text: "Éste reporte se encuentra en atención, está seguro de reasignarlo?",
                    icon: "question",
                    showDenyButton: true,
                    showConfirmButton: true
                  })
                  .then((result) => {
                    if (result.isConfirmed) {
                        pdls_id.current.push(id);
                        const marker = new mapboxgl.Marker();
                        marker.setLngLat(coordinates);
                        marker.addTo(map.current);
                        markers.current.push(marker);

                        setids_lum(pdls_id.current.toString())   
                    }
                  })
            } else {
                pdls_id.current.push(id);
                const marker = new mapboxgl.Marker();
                marker.setLngLat(coordinates);
                marker.addTo(map.current);
                markers.current.push(marker);

                setids_lum(pdls_id.current.toString())
            }
        } else {
            const index = pdls_id.current.indexOf(id);

            if (index !== -1) {
                //const marker = markers[index];
                markers.current[index].remove();
                markers.current.splice(index, 1);
                pdls_id.current.splice(index, 1);

                setids_lum(pdls_id.current.toString())
            }
        }
        settotal(markers.current.length)
        clicks.current[id]++;
    };

    const borrarMarkers = () => {
        for (var i = markers.current.length - 1; i >= 0; i--) {
            markers.current[i].remove();
        }
        markers.current = []
        settotal(markers.current.length)
    }

    //Modal de Asignar Cuadrilla
    const abrirModal = () => {
        setcuadrilla(0)
        setdatacuadrilla(null)

        axios.get(Url + 'users?roles=6', {
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

    const handleChange = (event) => {
        setcuadrilla(event.target.value)

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

    const asignarReportes = async() => {
        const new_asignacion_masiva = {
            "responsable" : cuadrilla,
            "reportes"  : ids_lum 
        }

        //console.log(new_asignacion_masiva)
        
        await axios.put(Url + 'cuadrillas/asignar', new_asignacion_masiva, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            traerReportesMapa()
            clicks.current = {}
            closeModal()
            borrarMarkers()
            pdls_id.current = []

            MySwal.fire({
                title: "Asignación Realizada con Éxito",
                icon: "success"
              });
        })
        .catch(err => {
                console.log(err)
                MySwal.fire({
                    title: "Algo Ocurrió!",
                    icon: "error"
                  });
            })
    }

    const closeModal = () => {
        setopenModal(false);
        setshowAsignar(false)
    }

    //Para los Filtros del Mapa
    function filtrarToString(objeto) {
        // Filtrar las propiedades del objeto que tienen el valor true
        const propiedadesTrue = Object.keys(objeto).filter(propiedad => objeto[propiedad] === true && propiedad !== 'EnProceso');

        // Verificar si 'EnProceso' es true y agregarlo separadamente
        const enProceso = objeto.EnProceso === true ? 'En Proceso' : '';

        // Concatenar las propiedades true en una cadena, separadas por ', '
        const resultadoToString = [...propiedadesTrue, enProceso].join(',');

        return resultadoToString;
      }

    const handleChangeEstatus = (event) => {
        var estados = ""

        estatus[event.target.name] = event.target.checked
        setestatus({...estatus, 
            [event.target.name] : event.target.checked
        })

        estados = filtrarToString(estatus)

        if (estados === "") {
            estados = null
        }

        ubicacionProyecto()

        setisCharging(true)
        axios.get(Url + "reportes/geojson?proyecto="+id_proyect+"&estados="+estados+
                                "&responsables="+selectresponsable, {
            headers:{
                Authorization : token
            }
        })
        .then(res => {
            setisCharging(false)
            map.current.setCenter([lng, lat])
            map.current.setZoom(12.5)
            map.current.getSource('xample_points').setData(res.data);
        })
        .catch(err => {
            console.log(err)
        })
    }

    const handleChangeSelectResponsable = (event) => {
        var estadosprop = ""
        estadosprop = filtrarToString(estatus)

        var idresponsable = event.target.value

        setselectresponsable(idresponsable)

        ubicacionProyecto()

        /*if (idresponsable === "0") {
            idresponsable = " "
        }*/

        setisCharging(true)
        axios.get(Url + "reportes/geojson?proyecto="+id_proyect+"&estados="+estadosprop+
                                        "&responsables="+idresponsable, {
            headers:{
                Authorization : token
            }
        })
        .then(res => {
            setisCharging(false)
            map.current.setCenter([lng, lat])
            map.current.setZoom(12.5)
            map.current.getSource('xample_points').setData(res.data);
        })
        .catch(err => {
            console.log(err)
        })
    }

    //Estilo del Modal de Asingar
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

    const MenuProps = {
        style: {
          maxHeight: 250,
      },
    };

    const abrirInfoPanel = async (datosReporte) => {
        
        await axios.get(Url + "reportes/" + datosReporte.id, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            setReporteporid(res.data);
        })
        .catch(err => console.log(err))

        setShowPanel(true)
    }

    const [valueTab, setValueTab] = React.useState('InfoReportes');
    const handleChangeTab = (event, newValue) => {
        setValueTab(newValue);
      };

    const closePanel = () => {
        setShowPanel(false)
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
                    color: 'black',
                    backgroundColor: "#F39C12",
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
                    color: 'white',
                    backgroundColor: "#FF0101",
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
        <div ref={mapReportesAlta} className={classNames("mapReportesAlta-container")}>

            {showPanel &&
                <Panel 
                dato={"Folio de Reporte: " + Reporteporid.killkizeo} 
                closePanel={closePanel} 
                icono={<ReportGmailerrorredIcon/>}
                top={0}
                width={'48%'}
                /*chip={<Chip label={cambiar(Reporteporid.estado)} 
                sx={[stylerow(Reporteporid.estado), 
                {width:90, borderRadius:1.5, fontSize:"0.65rem", height:20, fontWeight:"bold"}]} 
                size="small" />}*/
                bool={Reporteporid.reincidencia===0 ? "" : 
                <Chip label={"REINCIDENCIA"} 
                sx={[stylerow("RECHAZADO"), 
                {width:90, borderRadius:1.5, fontSize:"0.65rem", height:20, fontWeight:"bold"}]} 
                size="small" />}>
                    <TabContext value={valueTab}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom:2}}>
                            <TabList onChange={handleChangeTab}>   
                                <Tab label="Información" value="InfoReportes" sx={{width:"50%"}}/>
                                <Tab label="Historico" value="ComentariosReportes" sx={{width:"50%"}}/>
                            </TabList>
                        </Box>
                        <TabPanel value="InfoReportes" sx={{padding:1}}>
                            <Reporte dataReporte={Reporteporid} cerrarPanel={closePanel} showoptions={false}/>
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
                    </TabContext>
                </Panel>
            }

            <Box sx={{zIndex:1, backgroundColor:"white", width:120, 
                    borderRadius:2, position:"absolute", m:1}}>
                    <b style={{fontSize:14, marginLeft:"30%"}}>Total:{total}</b>
            </Box>

            <Paper sx={{zIndex:1, backgroundColor:"white", minWidth:170, 
                    borderRadius:2, position:"absolute", m:1, right:0}}>
                <Box sx={{display:"flex", alignItems:"center", mb:-1}}>
                    <Checkbox checked={estatus.Creado} onChange={handleChangeEstatus} 
                        name="Creado" size="small"/>
                    <label style={{fontSize:"13px"}}>Nuevo</label>
                </Box>
                <Box sx={{display:"flex", alignItems:"center", mb:-1}}>
                    <Checkbox checked={estatus.Asignado} onChange={handleChangeEstatus} 
                        sx={{
                            '&.Mui-checked': {
                                color: '#D35400',
                            },
                        }}
                        name="Asignado" size="small"/>
                    <label style={{fontSize:"13px"}}>Asignado</label>
                </Box>
                <Box sx={{display:"flex", alignItems:"center", mb:-1}}>
                    <Checkbox checked={estatus.EnProceso} onChange={handleChangeEstatus} 
                        sx={{
                            '&.Mui-checked': {
                                color: '#F4D03F',
                            },
                        }}
                        name="EnProceso" size="small"/>
                    <label style={{fontSize:"13px"}}>En Proceso</label>
                </Box>
                <Box sx={{display:"flex", alignItems:"center"}}>
                    <Checkbox checked={estatus.Incompleto} onChange={handleChangeEstatus} 
                        sx={{
                            '&.Mui-checked': {
                                color: '#8E44AD',
                            },
                        }}
                        name="Incompleto" size="small"/>
                    <label style={{fontSize:"13px"}}>Incompleto</label>
                </Box>
            </Paper>

            <Paper sx={{zIndex:1, backgroundColor:"white", minWidth:170, 
                    borderRadius:2, position:"absolute", m:1, right:0, top:125}}>
                    <Select
                        onClose={() => {
                            setTimeout(() => {
                            document.activeElement.blur();
                            }, 0);
                        }}
                        sx={{m:1, backgroundColor:"white", width:"90%"}}
                        id="select-Responsable"
                        value={selectresponsable}
                        onChange={handleChangeSelectResponsable}
                        MenuProps={MenuProps}
                        variant="standard">
                        <MenuItem value=" ">Ninguno</MenuItem>
                        {dataresponsables.map((responsable, index) => (
                            <MenuItem key={index} value={responsable.id}>{responsable.nombre_completo}</MenuItem>
                        ))}
                    </Select>
            </Paper>

            {total > 0 &&
            <div style={{position:"absolute", top:0, left: 130, display:"flex", flexDirection:"row-reverse",
                margin:5}}>
                <Paper sx={{borderRadius:10, border:"solid 1px green"}}>
                    <Button color="success" size="small" onClick={abrirModal}>
                        <AddIcon fontSize="small" sx={{mr:1}}/>Asignar Cuadrilla
                    </Button>
                </Paper>

                {/*
                <Paper sx={{borderRadius:10}}>
                    <Button color="error" size="small" onClick={borrarMarkers}>
                        <CleaningServicesIcon fontSize="small" sx={{mr:1}}/>Limpiar Selección
                    </Button>
                </Paper>
                */}
            </div>
            }

            <Modal 
             open={openModal}
             onClose={closeModal}>
                <Box sx={styleModal}>
                    <Box sx={{display:"flex", flexDirection:"column"}}>
                            <h3 style={{textAlign:"center"}}>Datos de Asignación</h3>
                        <div style={{display:"flex", alignItems:"center"}}>
                            Cuadrilla:
                            <FormControl size="small">
                                <Select
                                    onClose={() => {
                                        setTimeout(() => {
                                        document.activeElement.blur();
                                        }, 0);
                                    }}
                                    sx={{width: 200, ml:1}}
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
                                    {cuadrilla !== 0 ?
                                    <>
                                        {datacuadrilla !== null ?
                                        <>
                                            <label><strong>Supervisor: {datacuadrilla.supervisor.nombre + " " 
                                                + datacuadrilla.supervisor.ap_paterno}</strong></label>
                                            <label><strong>Responsable:</strong> {datacuadrilla.responsable.nombre + " " 
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
                                    </>
                                    :
                                    ""
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
                            <Button color="success" variant="outlined" sx={{width:200}} onClick={asignarReportes}>
                                Confirmar Asignación
                            </Button>
                        }
                        </div>
                    </Box>
                </Box>
            </Modal>
        
            { isCharging && <LoaderIndicator /> }
        </div>
    );
}

export default MapReportesAlta;
