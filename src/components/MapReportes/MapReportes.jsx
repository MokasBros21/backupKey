import React, { useRef, useState, useEffect} from "react";
import mapboxgl from "mapbox-gl";
//import TopBar  from "../../layout/TopBar/TopBar";
import axios from 'axios'
import "./MapReportes.scss";
import classNames from "classnames";
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import Chip from '@mui/material/Chip';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';  

//Para probar diferentes filtros
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import GroupsIcon from '@mui/icons-material/Groups';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';

import LoaderIndicator from '../../layout/LoaderIndicator/LoaderIndicator';
import Reporte from '../Tables/Reportes/Reportes/Reporte';
import Panel from "../Panel Lateral/Panel";
import { Url } from "../../constants/global";
import { Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Comentarios from "../Comentarios/Comentario";

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: "20%",
      width: 250,
    },
  },
};

mapboxgl.accessToken = 'pk.eyJ1IjoibWlndWVsdHJhZmZpYyIsImEiOiJjbG01Z2U2cW0wajdiM3Bsb2N6ZGhrN2lxIn0.hMkzztmUbOf-N9uToXeBwA';

const MapReportes = () => {

    const mapReportes = useRef(null);
    const map = useRef(null);
    let [lat] = useState(19.0409511);
    let [lng] = useState(-98.221976);
    let [zoom] = useState(15);
    const [showPanel, setShowPanel] = useState(false);
    const [Reporteporid, setReporteporid] = useState([])
    
    const [cuadrilla2, setcuadrilla2] = React.useState([])
    const [isCharging, setisCharging ] = useState(false);
    
    const [markers] = useState([])
    const [showFilterCuadrillas, setshowFilterCuadrillas] = useState(false)
    const [showFilterReportes, setshowFilterReportes] = useState(false)

    const token = localStorage.getItem('token');
    const id_proyect = localStorage.getItem('id_proyecto')
    const user = JSON.parse(localStorage.getItem('user_datos'));
    const marker = new mapboxgl.Marker()
    
    const [total, settotal] = useState(0)
    const [cuadrilla, setcuadrilla] = React.useState([]);
    var [estados] = useState([]) 
    var estadofinal = ''

    const [state, setState] = React.useState({
        Nuevo: false,
        Asignado: false,
        EnProceso: false,
        Incompleto: false,
        Terminado: false,
      });
    
    const { Nuevo, Asignado, EnProceso, Incompleto, Terminado } = state;

    const formControlLabelStyle = {
        "& .MuiFormControlLabel-label": {
          fontSize: "12px",
        }
      }

    const [valueTab, setValueTab] = React.useState('InfoReportes');
    const handleChangeTab = (event, newValue) => {
        setValueTab(newValue);
      };

    const handleChangeReporte = (event) => {
    state[event.target.name] = event.target.checked
    setState({
        ...state,
        [event.target.name]: event.target.checked,
    });

    let new_name = "";

    switch (event.target.name) {
        case "Nuevo":
                new_name = "CREADO"
            break;

        case "Asignado":
                new_name = "ASIGNADO"
            break;

        case "EnProceso":
                new_name = "EN PROCESO"
            break;
            
        case "Incompleto":
                new_name = "INCOMPLETO"
            break;

        case "Terminado":
                new_name = "TERMINADO"
            break;
        
        default:
            break;
        }

    if (event.target.checked) {
        estados.push(new_name)
    }else{
        let index = estados.indexOf(new_name)
        estados.splice(index,1)
    }

    estadofinal = estados.toString()

    if (estadofinal === "" && cuadrilla.length === 0) {
        estadofinal = null
    }

    setisCharging(true)
    var urlestados = ""

    if (user.rol !== 5) {
        urlestados = Url + 'reportes/geojson?proyecto='+id_proyect+'&supervisor='+
            '&cuadrillas=&estados='
    }else{
        urlestados = Url + 'reportes/geojson?proyecto='+id_proyect+'&supervisor='+ user.id + 
            '&cuadrillas=&estados='
    }

    axios.get(urlestados + estadofinal, {
        headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            setisCharging(false);
            //console.log(coordenadas_proyect)
            map.current.setCenter([lng, lat])
            map.current.setZoom(12.5)
            settotal(res.data.features.length)
            map.current.getSource('xample_points').setData(res.data);
            map.current.setPaintProperty('xample_points', 'circle-color', [
                'match',
                ['get', 'reincidencia'],
                0, [   'match',
                            ['get', 'estado'],
                            'CREADO','#2B88EB',
                            'ASIGNADO', '#D35400',
                            'EN PROCESO', '#F4D03F',
                            'INCOMPLETO', '#8E44AD',
                            'TERMINADO', '#28B463',
                            'yellow'
                        ],
                'red'
            ]);
        })
        .catch(err => {
            setisCharging(false);
            console.log(err)
        })
    };

    const handleChange = (event) => {

      var {
        target: { value },
      } = event;

      setcuadrilla(value)

      if(value.length === 0 && estados.length === 0)
      {
        value = null
      }

      setisCharging(true)

      var urlcompleta = Url + "reportes/geojson?proyecto="+id_proyect+"&responsables=" + value
      + "&estados=" + estados

      axios.get(urlcompleta, {
        headers: {
            Authorization : token,
        }
      })
    .then(res =>  {
        setisCharging(false);
        settotal(res.data.features.length)

        map.current.setCenter([lng, lat])
        map.current.setZoom(12.5)

        map.current.getSource('xample_points').setData(res.data);
      })
    .catch(err => {
        setisCharging(false);
        console.log(err)
    })
    };

    const traerCuadrilla = () => {
        var urlsupervisores = Url + 'users?roles=6&proyecto='+id_proyect
        
        axios.get(urlsupervisores, {
            headers: {
                Authorization : token,
            }
            })
            .then(res =>  {
                setcuadrilla2(res.data)
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
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
                
            default:
                break;
        }

        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapReportes.current,
            style: 'mapbox://styles/mapbox/navigation-night-v1',
            center: [lng, lat],
            zoom: zoom,
            boxZoom: true,
            });

            map.current.on('load', function() {

                var url = Url + 'reportes/geojson?proyecto='+id_proyect+'&estados=""'

                axios.get(url, {
                    headers: {
                        Authorization : token,
                    }
                  })
                .then(res =>  {

                    traerCuadrilla()
    
                    map.current.addSource('xample_points', {
                        type: 'geojson',
                        data: res.data
                        });

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
                                                'TERMINADO', '#28B463',
                                                'yellow'
                                            ],
                                    'red'
                                ],
                              'circle-stroke-color': 'white'
                              }  
                            });
                  })
                .catch(err => {
                    console.log(err)
                })

                map.current.on('mouseenter', 'xample_points', () => {
                    map.current.getCanvas().style.cursor = 'pointer'
                  })
                  map.current.on('mouseleave', 'xample_points', () => {
                    map.current.getCanvas().style.cursor = 'default'
                  })
    
                map.current.on('click', 'xample_points', (e) => {
    
                    const coordinates = e.features[0].geometry.coordinates;
                    const description = e.features[0].properties;
                    
                    marker.setLngLat(coordinates)
                    marker.addTo(map.current);

                    markers.push(marker)
    
                    markerClicked(description)
                });
            })
    })

    const closePanel = () => {
        setShowPanel(false);
        //borrarMarkers()
    }

    const borrarMarkers = () => {
        if (markers!==null) {
            for (var i = markers.length - 1; i >= 0; i--) {
                markers[i].remove();
            }
        }
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
    const markerClicked  = async(datos) => {
        setValueTab("InfoReportes")

        await axios.get(Url + "reportes/" + datos.id, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            setReporteporid(res.data);
        })
        .catch(err => console.log(err))

        setShowPanel(true);
    };

    const styleCheck = (idCuad) => {
        var checkstyle = null

        switch (idCuad) {
            case 7:
                checkstyle = {
                '&.Mui-checked' : {
                    color: '#4472C4',
                }}
                break;

            case 8:
                checkstyle = {
                '&.Mui-checked' : {
                    color: '#ED7D31',
                }}
                break;

            case 16:
                checkstyle = {
                '&.Mui-checked' : {
                    color: '#FFC000',
                }}
                break;

            case 23:
                checkstyle = {
                '&.Mui-checked' : {
                    color: '#C00000',
                }}
                break;

            case 25:
                checkstyle = {
                '&.Mui-checked' : {
                    color: '#70AD47',
                }}
                break;
        
            default:
                break;
        }

        return checkstyle
    }

    const mostrarcuadrilla = () =>{
        setshowFilterCuadrillas(true)
        setshowFilterReportes(false)
    }

    const mostrarreportes = () =>{
        setshowFilterCuadrillas(false)
        setshowFilterReportes(true)
    }

    const hideall = async () =>{
            setisCharging(true)
            axios.get(Url + "reportes/geojson?proyecto="+id_proyect+"&cuadrillas=''", {
            headers: {
                Authorization : token,
            }
            })
        .then(res =>  {
            setisCharging(false);
            settotal(res.data.features.length)
    
            map.current.setCenter([lng, lat])
            map.current.setZoom(12.5)

            borrarMarkers()
    
            map.current.getSource('xample_points').setData(res.data);
            /*
            map.current.setPaintProperty('xample_points', 'circle-color', [
                'match',
                ['get', 'cuadrilla'],
                1, '#4472C4',
                2, '#ED7D31',
                3, "#FFC000",
                4, '#C00000',
                5, '#70AD47',
                6, '#FF8686', 
                'red'
                ]);*/
            })
        .catch(err => {
            setisCharging(false);
            console.log(err)
        })

        setshowFilterReportes(false)
        setshowFilterCuadrillas(false)
    }

    return (           
        <div ref={mapReportes} className={classNames("mapReportes-container")}>
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
            
            {showFilterCuadrillas &&
             <Box sx={{zIndex:1, backgroundColor:"white", width:"20%", height:80, m:1, 
                borderRadius:2, position:"absolute", right:0}}>
                <FormControl sx={{m:1, width:"92%"}} size="small">
                    <FormLabel id="radio-buttons-group">Cuadrilla</FormLabel>
                        <Select
                        onClose={() => {
                            setTimeout(() => {
                            document.activeElement.blur();
                            }, 0);
                        }}
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={cuadrilla}
                        onChange={handleChange}
                        renderValue={(selected) => 
                            selected.map(id => cuadrilla2.find(item => item.id === id).nombre_completo).join(', ')
                          }
                        MenuProps={MenuProps}
                        >
                        {cuadrilla2.map((name) => (
                            <MenuItem key={name.id} value={name.id}>
                                <Checkbox checked={cuadrilla.includes(name.id)} sx={styleCheck(name.id)}/>
                                <ListItemText primary={name.nombre_completo} />
                            </MenuItem>
                        ))}
                        </Select>
                </FormControl>
            </Box>
            }

            {showFilterReportes &&
             <Box sx={{zIndex:1, backgroundColor:"white", m:1, 
             borderRadius:2, position:"absolute", right:0, display:"flex", flexDirection:"column"}}>
                <FormControl sx={{m:1}}>
                    <FormLabel id="radio-buttons-group">Estado</FormLabel>
                        <FormGroup>
                                <FormControlLabel sx={{...formControlLabelStyle, mt:-0.5}}
                                    control={
                                    <Checkbox checked={Nuevo} onChange={handleChangeReporte} name="Nuevo" 
                                    size="small"/>
                                    }
                                    label="Nuevo"
                                />
                                <FormControlLabel sx={{...formControlLabelStyle, mt:-0.5}}
                                    control={
                                    <Checkbox checked={Asignado} onChange={handleChangeReporte} name="Asignado" 
                                    size="small"  sx={{
                                                    '&.Mui-checked': {
                                                    color: '#D35400',
                                                    },
                                                }}/>
                                    }
                                    label="Asignado"
                                />
                                <FormControlLabel sx={{...formControlLabelStyle, mt:-0.5}}
                                    control={
                                    <Checkbox checked={EnProceso} onChange={handleChangeReporte} name="EnProceso"
                                    size="small" sx={{
                                                    '&.Mui-checked': {
                                                    color: '#F4D03F',
                                                    },
                                                }}/>
                                    }
                                    label="En Proceso"
                                />
                                <FormControlLabel sx={{...formControlLabelStyle, mt:-0.5}}
                                    control={
                                    <Checkbox checked={Incompleto} onChange={handleChangeReporte} name="Incompleto"
                                    size="small" sx={{
                                                    '&.Mui-checked': {
                                                    color: '#8E44AD',
                                                    },
                                                }}/>
                                    }
                                    label="Incompleto"
                                />
                                <FormControlLabel sx={{...formControlLabelStyle, mt:-0.5}}
                                    control={
                                    <Checkbox checked={Terminado} onChange={handleChangeReporte} name="Terminado"
                                    size="small" sx={{
                                                    '&.Mui-checked': {
                                                    color: '#28B463',
                                                    },
                                                }}/>
                                    }
                                    label="Terminado"
                                />
                        </FormGroup>
                </FormControl>
            </Box>
            }

            <Box>
                <SpeedDial
                    ariaLabel="SpeedDial basic example"
                    sx={{ position: 'absolute', bottom: 16, right: 16 }}
                    icon={<FilterAltIcon/>}
                    direction="left"
                >
                    <SpeedDialAction
                        icon = {<ReportGmailerrorredIcon/>}
                        tooltipTitle="Reportes"
                        sx={{mr:0}}
                        onClick={mostrarreportes}
                    />
                    <SpeedDialAction
                        icon = {<GroupsIcon/>}
                        tooltipTitle="Cuadrillas"
                        onClick={mostrarcuadrilla}
                    />
                    <SpeedDialAction
                        icon = {<CleaningServicesIcon/>}
                        tooltipTitle="Limpiar"
                        //sx={{marginTop:0, marginBottom:0}}
                        onClick={hideall}
                    />
                </SpeedDial>
            </Box>
        
            <Box sx={{zIndex:1, backgroundColor:"white", width:"10%", 
                borderRadius:2, position:"absolute", m:1}}>
                <b style={{fontSize:16, marginLeft:"25%"}}>Total:{total}</b>
            </Box>
            { isCharging && <LoaderIndicator /> }
        </div>
    );
}

export default MapReportes;