import React, { useEffect, useState,useRef} from "react";
import axios from 'axios';
import { Url } from '../../constants/global';

//Tarjetas de la cabecera
import Box from '@mui/material/Box';

//SCSS
import './Dashboard.scss';

//Importanción de la librería de gráficas
import ReactEcharts from "echarts-for-react";

//Responsive
import Grid from '@mui/material/Grid';

//Selector de fechas
import dayjs from 'dayjs';
import { DemoContainer} from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

//NUEVA SELECCIÓN CANAL DE ENTRADA
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

//CARDS JOY
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardActions from '@mui/joy/CardActions';
import Typography from '@mui/joy/Typography';


//CUADRILLAS
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

//CHIP
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';

//LINEAR PROGRESS
import LinearProgress from '@mui/material/LinearProgress';

//MAPA
import mapboxgl from "mapbox-gl";

//Echarts
import * as echarts from 'echarts/core';

//Componente de origen de averia
import GraficaOrigenAveria from "./OrigenAveria/GraficaOrigenAveria";


mapboxgl.accessToken = 'pk.eyJ1IjoibWlndWVsdHJhZmZpYyIsImEiOiJjbG01Z2U2cW0wajdiM3Bsb2N6ZGhrN2lxIn0.hMkzztmUbOf-N9uToXeBwA';

//----------- CHIP CUADRILLAS -----------------------

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}


//-------------------------------------------------

const DashboardTerminados = () =>{


   //coordenadas
   let [lat] = useState(19.043679178263694);
   let [lng] = useState(-98.1981651320212);
   let [zoom] = useState(10);

  //Obtener número de proyecto
  const id_proyect = localStorage.getItem('id_proyecto');

  //DEFINICIÓN DEL ARREGLO DE CUADRILLAS - NOMBRES DINÁMICOS
   const [listaCuadrillas, setListaCuadrillas] = useState([]);
   const [graficaOrigenAveriaIndividual, setGraficaOrigenAveriaIndividual] = useState([]);
   let names = [];
   var diccionarioCuadrilla = new Object();

   const informacionCuadrilla = () => {
    
    axios.get(Url + "users?roles=6&proyecto="+id_proyect, {
        headers: {
            Authorization : token,
        }
    })
    .then(res =>  {
      setListaCuadrillas(res.data);
      })
    .catch(err => console.log(err))

}

const obtenerCuadrillaNombres =(data_cuadrilla) =>{
   
  data_cuadrilla.map((nc) =>( 
     names.push(nc.nombre_completo)
  ));

  data_cuadrilla.map((nc) =>( 
    diccionarioCuadrilla[nc.nombre_completo] = nc.id
   ));

   return names;
  }

    //Peticiones para obtener la información

    //SECTORES
    const [dataSector, setDataSector] = useState([]);

   //TIEMPOS DE RESPUESTA

   const [dataTiempoRespuesta, setDataTiempoRespuesta] = useState([]);
    let tiempoRespuestaNombre = []
    let tiempoRespuestaValores = []

     //OBTENCIÓN DE FECHA ACTUAL
     let fecha_actual = dayjs();
     let fecha_actual_formateada_inicio = '';
     let fecha_actual_formateada_fin = '';
     let year_actual = fecha_actual.$y;
     let month_actual =fecha_actual.$M+1;
     let day_actual = fecha_actual.$D;
     
 
      if(month_actual < 10){
          month_actual = '0'+month_actual; 
      }
 
      if(day_actual < 10){
        day_actual= '0'+day_actual; 
    }
    
    fecha_actual_formateada_inicio = year_actual+'-'+month_actual+'-'+ '01'
    fecha_actual_formateada_fin = year_actual+'-'+month_actual+'-'+day_actual;
  
     //SELECTOR DE FECHAS
     const dataFechaInicial= useRef(fecha_actual_formateada_inicio);
     const dataFechaFinal = useRef(fecha_actual_formateada_fin);
     let fechaI = '';
     let fechaF = '';

    //ORIGEN DE AVERIA
    const [dataOrigenAveria, setDataOrigenAveria] = useState([]);

  //TOKEN LARAVEL
  const token = localStorage.getItem('token');

  //MAPA
  const mapContainer = useRef(null);
  const map = useRef(null);
  const geoMapa = useRef();

  
  //CANAL DE ENTRADA
  const statusCanal = useRef('');
  const [dataOrigenAveriaIndividual, setDataOrigenAveriaIndividual] = useState([]);

  const reportesOrigenAveriaIndividual = (fechaInicio,fechaFin,cuadrilla,canal,averia) =>{
        axios.get(Url + "dashboard/terminados/averiaIndividual?proyecto="+id_proyect+"&fecha_inicio="+fechaInicio+"&fecha_fin="
        +fechaFin+"&cuadrilla="+cuadrilla+"&canal="+canal+"&origen_averia="+averia, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
          setDataOrigenAveriaIndividual(res.data);
          setGraficaOrigenAveriaIndividual(<GraficaOrigenAveria data={res.data} tipo={averia}/>);
          })
        .catch(err => console.log(err)) 
      }


  const mostrarGraficasOrigenA = (nombreGrafica) =>{

    if(nombreGrafica == ''){
      setGraficaOrigenAveriaIndividual(<GraficaOrigenAveria data={''} tipo={''}/>);
    }

    if(nombreGrafica == 'ACCIDENTE AUTOMOVILÍSTICO'){
    reportesOrigenAveriaIndividual(dataFechaInicial.current,dataFechaFinal.current,cuadrillaGlobal.current,statusCanal.current,'ACCIDENTE AUTOMOVILÍSTICO');
    }
    if(nombreGrafica == 'CAIDA DE TENSION'){

      reportesOrigenAveriaIndividual(dataFechaInicial.current,dataFechaFinal.current,cuadrillaGlobal.current,statusCanal.current,'CAIDA DE TENSION');
    }
    if(nombreGrafica == 'CONEXIONES DEFICIENTES'){
      reportesOrigenAveriaIndividual(dataFechaInicial.current,dataFechaFinal.current,cuadrillaGlobal.current,statusCanal.current,'CONEXIONES DEFICIENTES');
    }
    if(nombreGrafica == 'CORTOCIRCUITO'){

    reportesOrigenAveriaIndividual(dataFechaInicial.current,dataFechaFinal.current,cuadrillaGlobal.current,statusCanal.current,'CORTOCIRCUITO');

    }
    if(nombreGrafica == 'DAÑOS POR TERCEROS'){
      reportesOrigenAveriaIndividual(dataFechaInicial.current,dataFechaFinal.current,cuadrillaGlobal.current,statusCanal.current,'DAÑOS POR TERCEROS');
    }
    if(nombreGrafica == 'DEFECTO DE ALGÚN MATERIAL'){
      reportesOrigenAveriaIndividual(dataFechaInicial.current,dataFechaFinal.current,cuadrillaGlobal.current,statusCanal.current,'DEFECTO DE ALGÚN MATERIAL');
      
    }
    if(nombreGrafica == 'DETERIORO DE ALGÚN MATERIAL'){
      reportesOrigenAveriaIndividual(dataFechaInicial.current,dataFechaFinal.current,cuadrillaGlobal.current,statusCanal.current,'DETERIORO DE ALGÚN MATERIAL');
    }
    if(nombreGrafica == 'MALA FIJACIÓN'){
      reportesOrigenAveriaIndividual(dataFechaInicial.current,dataFechaFinal.current,cuadrillaGlobal.current,statusCanal.current,'MALA FIJACIÓN');
    }
    if(nombreGrafica == 'PRESUNTO BANDALISMO'){
      reportesOrigenAveriaIndividual(dataFechaInicial.current,dataFechaFinal.current,cuadrillaGlobal.current,statusCanal.current,'PRESUNTO BANDALISMO');
    }
    if(nombreGrafica == 'SOBRECARGAS DE CIRCUITO'){
      
      reportesOrigenAveriaIndividual(dataFechaInicial.current,dataFechaFinal.current,cuadrillaGlobal.current,statusCanal.current,'SOBRECARGAS DE CIRCUITO');
    }
    if(nombreGrafica == 'OTROS'){
      reportesOrigenAveriaIndividual(dataFechaInicial.current,dataFechaFinal.current,cuadrillaGlobal.current,statusCanal.current,'OTROS');
    }
  }

  // PRUEBA - NUEVA SELECCIÓN CANAL DE ENTRADA
  
  const [state, setState] = React.useState({
    appCiudadana: false,
    callCenter: false,
    oficio: false,
    peticionDirecta: false,
    redesSociales: false,
    reporteEnCampo: false,
    rondasInspeccion: false,
    tasaAverias: false,

  });

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
     
    //AppCiudadana
    if(event.target.name === 'appCiudadana'){
      if(event.target.checked){
         if(statusCanal.current !== ''){
        if(!statusCanal.current.includes('2')){
          statusCanal.current = statusCanal.current + ',2';
        }
      }else{
        statusCanal.current = '2';
      }
      }else{
        if(statusCanal.current.includes(',2')){
          statusCanal.current = statusCanal.current.split(",2").join('');
        }
        if(statusCanal.current.includes('2,')){
          statusCanal.current = statusCanal.current.split("2,").join('');
        }
        if(statusCanal.current.includes('2')){
          statusCanal.current = statusCanal.current.split("2").join('');
        }     
      }
     
    }

    //CallCenter
    if(event.target.name === 'callCenter'){
      if(event.target.checked){
         if(statusCanal.current !== ''){
        if(!statusCanal.current.includes('3')){
          statusCanal.current = statusCanal.current + ',3';
        }
      }else{
        statusCanal.current = '3';
      }
      }else{
        if(statusCanal.current.includes(',3')){
          statusCanal.current = statusCanal.current.split(",3").join('');
        }
        if(statusCanal.current.includes('3,')){
          statusCanal.current = statusCanal.current.split("3,").join('');
        }
        if(statusCanal.current.includes('3')){
          statusCanal.current = statusCanal.current.split("3").join('');
        }     
      }
    }

    //Oficio
     if(event.target.name === 'oficio'){
      if(event.target.checked){
         if(statusCanal.current !== ''){
        if(!statusCanal.current.includes('4')){
          statusCanal.current = statusCanal.current + ',4';
        }
      }else{
        statusCanal.current = '4';
      }
      }else{
        if(statusCanal.current.includes(',4')){
          statusCanal.current = statusCanal.current.split(",4").join('');
        }
        if(statusCanal.current.includes('4,')){
          statusCanal.current = statusCanal.current.split("4,").join('');
        }
        if(statusCanal.current.includes('4')){
          statusCanal.current = statusCanal.current.split("4").join('');
        }     
      }
    }

   //Oficio
   if(event.target.name === 'peticionDirecta'){
    if(event.target.checked){
       if(statusCanal.current !== ''){
      if(!statusCanal.current.includes('6')){
        statusCanal.current = statusCanal.current + ',6';
      }
    }else{
      statusCanal.current = '6';
    }
    }else{
      if(statusCanal.current.includes(',6')){
        statusCanal.current = statusCanal.current.split(",6").join('');
      }
      if(statusCanal.current.includes('6,')){
        statusCanal.current = statusCanal.current.split("6,").join('');
      }
      if(statusCanal.current.includes('6')){
        statusCanal.current = statusCanal.current.split("6").join('');
      }     
    }
  }

    //Redes sociales
    if(event.target.name === 'redesSociales'){
      if(event.target.checked){
         if(statusCanal.current !== ''){
        if(!statusCanal.current.includes('7')){
          statusCanal.current = statusCanal.current + ',7';
        }
      }else{
        statusCanal.current = '7';
      }
      }else{
        if(statusCanal.current.includes(',7')){
          statusCanal.current = statusCanal.current.split(",7").join('');
        }
        if(statusCanal.current.includes('7,')){
          statusCanal.current = statusCanal.current.split("7,").join('');
        }
        if(statusCanal.current.includes('7')){
          statusCanal.current = statusCanal.current.split("7").join('');
        }     
      }
    }

   //Reporte Campo
   if(event.target.name === 'reporteEnCampo'){
    if(event.target.checked){
       if(statusCanal.current !== ''){
      if(!statusCanal.current.includes('8')){
        statusCanal.current = statusCanal.current + ',8';
      }
    }else{
      statusCanal.current = '8';
    }
    }else{
      if(statusCanal.current.includes(',8')){
        statusCanal.current = statusCanal.current.split(",8").join('');
      }
      if(statusCanal.current.includes('8,')){
        statusCanal.current = statusCanal.current.split("8,").join('');
      }
      if(statusCanal.current.includes('8')){
        statusCanal.current = statusCanal.current.split("8").join('');
      }     
    }
  }

    //Rondas de inspección
    if(event.target.name === 'rondasInspeccion'){
      if(event.target.checked){
         if(statusCanal.current !== ''){
        if(!statusCanal.current.includes('9')){
          statusCanal.current = statusCanal.current + ',9';
        }
      }else{
        statusCanal.current = '9';
      }
      }else{
        if(statusCanal.current.includes(',9')){
          statusCanal.current = statusCanal.current.split(",9").join('');
        }
        if(statusCanal.current.includes('9,')){
          statusCanal.current = statusCanal.current.split("9,").join('');
        }
        if(statusCanal.current.includes('9')){
          statusCanal.current = statusCanal.current.split("9").join('');
        }     
      }
    }

    //Tasa de averias
    if(event.target.name === 'tasaAverias'){
      if(event.target.checked){
         if(statusCanal.current !== ''){
        if(!statusCanal.current.includes('10')){
          statusCanal.current = statusCanal.current + ',10';
        }
      }else{
        statusCanal.current = '10';
      }
      }else{
        if(statusCanal.current.includes(',10')){
          statusCanal.current = statusCanal.current.split(",10").join('');
        }
        if(statusCanal.current.includes('10,')){
          statusCanal.current = statusCanal.current.split("10,").join('');
        }
        if(statusCanal.current.includes('10')){
          statusCanal.current = statusCanal.current.split("10").join('');
        }     
      }
    }

  //Llamado de las funciones que realizan peticiones en la API de KEYCITY
 peticionesAPIValoresIndicadores();
    
  };

  //RESUMEN
  const resumen = useRef(0);
  const mediana = useRef(0);
  const promedio = useRef(0);

  const [dataResumen, setDataResumen] = React.useState([]);
  const [dataMediana, setDataMediana] = React.useState([]);
  const [dataPromedio, setDataPromedio] = React.useState([]);

  //FUNCIONES CHIP CUADRILLA

  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);
  const cuadrillaChip = useRef();
  const cuadrilla= useRef('');
  const cuadrillaGlobal = useRef('');
  const [grafica, setGrafica] = React.useState("");
  const graficaSeleccionada= useRef();
  
  const handleChangeChip = (event) => {
     const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
      cuadrillaChip.current = typeof value === 'string' ? value.split(',') : value
    );
  
    peticionCuadrillaChip();
    cuadrilla.current = '';
  };


 //PETICIÓN DEL GEOJSON MAPA
  const geojsonMapa= (fechaInicio,fechaFin,cuadrilla,canal) => {
    axios.get(Url +"dashboard/terminados/geojson?proyecto="+id_proyect+"&fecha_inicio="+fechaInicio+"&fecha_fin="
    +fechaFin+"&cuadrilla="+cuadrilla+"&canal="+canal, {
        headers: {
            Authorization : token,
        }
    })
    .then(res =>  {
      
      geoMapa.current = res.data;
      map.current.getSource('museums').setData(geoMapa.current);
       
      })
    .catch(err => console.log(err))
    }
  
     //PETICIÓN DE RESUMEN
  const resumenConsulta = (fechaInicio,fechaFin,cuadrilla,canal) => {
    axios.get(Url + "dashboard/terminados/resumen?proyecto="+id_proyect+"&fecha_inicio="+fechaInicio+"&fecha_fin="
    +fechaFin+"&cuadrilla="+cuadrilla+"&canal="+canal, {
        headers: {
            Authorization : token,
        }
    })
    .then(res =>  {
      
        resumen.current = res.data.total;
        mediana.current = res.data.mediana;
        promedio.current = res.data.promedio;

        setDataResumen(res.data.total)
        setDataMediana(res.data.mediana)
        setDataPromedio(res.data.promedio)
       
      })
    .catch(err => console.log(err))
}

  //PETICIONES DE SECTOR 
  const reportesSector= (fechaInicio,fechaFin,cuadrilla,canal) => {
  axios.get(Url + "dashboard/terminados/sector?proyecto="+id_proyect+"&fecha_inicio="+fechaInicio+"&fecha_fin="
  +fechaFin+"&cuadrilla="+cuadrilla+"&canal="+canal, {
      headers: {
          Authorization : token,
      }
  })
  .then(res =>  {
    
    setDataSector(res.data);
    
    })
  .catch(err => console.log(err))
  }

  const obtenerSectoresNombres =() =>{
  let sectoresNombre = [] 
  dataSector.map((sector) =>( 
  sectoresNombre.push(sector.sector)
  ));
   
  return sectoresNombre;
  }

  const obtenerSectoresValores = () =>{
  let sectoresValores = []
   dataSector.map((sector) =>( 
  sectoresValores.push(sector.count)
  ));

  return sectoresValores;
  }

  //PETICIONES DE TIEMPOS DE RESPUESTA
  const reportesTiempoRespuesta =(fechaInicio,fechaFin,cuadrilla,canal) => {
  axios.get(Url + "dashboard/terminados/tiemporespuesta?proyecto="+id_proyect+"&fecha_inicio="+fechaInicio+"&fecha_fin="
  +fechaFin+"&cuadrilla="+cuadrilla+"&canal="+canal, {
    headers: {
        Authorization : token,
    }
  })
  .then(res =>  {

  setDataTiempoRespuesta(res.data); 
  
  })
  .catch(err => console.log(err))
  }

  const obtenerRangoTiempoRespuesta = () =>{

  dataTiempoRespuesta.map((tr) =>( 
  tiempoRespuestaNombre.push(tr.horas_transcurridas)
  ));

  return tiempoRespuestaNombre;
  }

  const obtenerValoresTiempoRespuesta = () =>{

  dataTiempoRespuesta.map((tr) =>( 
  tiempoRespuestaValores.push(tr.count)
  ));

  return tiempoRespuestaValores;
  }

  //ORIGEN DE AVERIA

  const reportesOrigenAveria = (fechaInicio,fechaFin,cuadrilla,canal) => {
  axios.get(Url + "dashboard/terminados/averia?proyecto="+id_proyect+"&fecha_inicio="+fechaInicio+"&fecha_fin="
  +fechaFin+"&cuadrilla="+cuadrilla+"&canal="+canal, {
      headers: {
          Authorization : token,
      }
  })
  .then(res =>  {
    
    setDataOrigenAveria(res.data);
    
    
    })
  .catch(err => console.log(err))
  
  }

  const obtenerOrigenAveriaNombre = () =>{

  let origenAveriaNombre = []

  dataOrigenAveria.map((dataOA) =>( 
    origenAveriaNombre.push(dataOA.origen_averia)
  ));

  if(origenAveriaNombre.length > 0){
    document.getElementById('select-origen-averia').style.display = 'grid';
  }

  return origenAveriaNombre;
  }

  const obtenerOrigenAveriaValores = () =>{
  let origenAveriaTotal = []

  dataOrigenAveria.map((dataOA) =>( 
    origenAveriaTotal.push(dataOA.count)
  ));

  return origenAveriaTotal;
  }


  //Llamado de peticiones

  const peticionesAPIValoresIndicadores = () =>{

    let lineaProgreso= document.getElementById('lineaDeProgreso');
    lineaProgreso.style.display = 'block';

    //GRAFICA ORIGEN DE AVERIA INDIVIDUAL
    setTimeout(() => {
      mostrarGraficasOrigenA('');
     }, "15000"); 
     
    setTimeout(() => {
      //SECTOR
     reportesSector(dataFechaInicial.current,dataFechaFinal.current,cuadrillaGlobal.current,statusCanal.current)
    }, "1000");

    setTimeout(() => {
       //MÁXIMO TIEMPO DE RESPUESTA
    reportesTiempoRespuesta(dataFechaInicial.current,dataFechaFinal.current,cuadrillaGlobal.current,statusCanal.current)
    }, "1000");
    
    setTimeout(() => {
      //RESUMEN
      resumenConsulta(dataFechaInicial.current,dataFechaFinal.current,cuadrillaGlobal.current,statusCanal.current)
    }, "1000");
    
    setTimeout(() => {
       //ORIGEN DE AVERIA
    reportesOrigenAveria(dataFechaInicial.current,dataFechaFinal.current,cuadrillaGlobal.current,statusCanal.current)
    }, "1000");
   
    setTimeout(() => {
      //MAPA
     geojsonMapa(dataFechaInicial.current,dataFechaFinal.current,cuadrillaGlobal.current,statusCanal.current)
    }, "1000");  
     
    //LÍNEA DE PROGRESO
    setTimeout(() => {
      lineaProgreso.style.display = 'none';
     }, "15000");   
     
  }
  
//PINTAMOS EL MAPA
    useEffect(() => {

      switch (id_proyect) {
        case "2":
            lng = -116.596191
            lat = 31.866396
            zoom = 10
            break;
        
        case "3":
            lng = -87.074004
            lat = 20.629081
            zoom = 10
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
    
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/navigation-night-v1',
      center: [lng, lat],
      zoom: zoom
    });
   

    //MÉTODO ONLOAD
    map.current.on('load', () => {
    
       //CAPA DE PRUEBA
       map.current.addSource('museums', {
        type: 'geojson',
        data: ''
        });
        map.current.addLayer({
        'id': 'museums',
        'type': 'circle',
        'source': 'museums',
        'layout': {
        // Make the layer visible by default.
        'visibility': 'visible'
        },
        'paint': {
          'circle-radius': 6,
          'circle-stroke-width': 2,
          'circle-color': 'rgba(18, 230, 143, 0.8)',
          'circle-stroke-color': 'white'
        },
       
        })
      }); //OnLoad

    }
  );
  
  //OBTENCIÓN DE CUADRILLAS PARA LA PETICIÓN

  const peticionCuadrillaChip = () =>{

    for(let k=0;k<names.length;k++){
      //PRUEBA
    if(cuadrillaChip.current.includes(names[k])){
      if(cuadrilla.current != ''){
        if(!cuadrilla.current.includes(JSON.stringify(diccionarioCuadrilla[names[k]]))){
          cuadrilla.current = cuadrilla.current+','+JSON.stringify(diccionarioCuadrilla[names[k]]);
        
        }
      }else{
        cuadrilla.current = JSON.stringify(diccionarioCuadrilla[names[k]]);
      }
    }
    }
  
    cuadrillaGlobal.current = cuadrilla.current;

  //Llamado de las funciones que realizan peticiones en la API de KEYCITY
  peticionesAPIValoresIndicadores();

  }

   //MÉTODOS DE FECHA

     const setDataFechaInicialMethod = (newDate) =>{
      let year = newDate.$y;
      let month = newDate.$M+1;
      let day = newDate.$D;
     

      if(month < 10){
          month = '0'+month; 
      }

      if(day < 10){
        day= '0'+day; 
    }
    
      fechaI = year+'-'+month+'-'+day;
      
     dataFechaInicial.current = fechaI;

      if(dataFechaFinal.current != ''){  
      
      //Llamado de las funciones que realizan peticiones en la API de KEYCITY
      peticionesAPIValoresIndicadores(); 

      map.current.getSource('museums').setData(geoMapa.current);
      }else{
        console.log('Método: SetDataFechaInicial - el parámetro dataFechaFinal no tiene un valor establecido.')
      }
      }

      const setDataFechaFinalMethod = (newDate) =>{
        
        let year = newDate.$y;
        let month = newDate.$M+1;
        let day = newDate.$D;
       
  
        if(month < 10){
            month = '0'+month; 
        }
  
        if(day < 10){
          day= '0'+day; 
      }
      
        fechaF = year+'-'+month+'-'+day;
        dataFechaFinal.current = fechaF;
     
     if(dataFechaInicial.current !=''){
   
      //Llamado de las funciones que realizan peticiones en la API de KEYCITY
      peticionesAPIValoresIndicadores();
  
     }else{
      console.log('setDataFechaFinalMethod: No se ha ingresado una fecha inicial.')
     }
        }


    let graficaTiemposDeRespuesta = {
        title: {
            text: 'Reportes atendidos de acuerdo al tiempo de respuesta',
            subtext: 'HORAS DE TIEMPO DE RESPUESTA',
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
        xAxis: {
          
          type: 'category',
          data: obtenerRangoTiempoRespuesta(),
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#A2D9CE' },
            { offset: 0.5, color: '#73C6B6' },
            { offset: 1, color: '#45B39D' }
          ]),
            data: obtenerValoresTiempoRespuesta(),
            type: 'bar'
          }
        ]
      };

    //REPORTES TERMINADOS
      let sector= {
        title: {
          text: 'Reportes atendidos por sector',
          subtext: 'SECTOR',
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
        xAxis: {
          
          type: 'category',
          axisLabel: {
            interval: 0,
            rotate: 30,
            fontSize: 10
          },
          data: obtenerSectoresNombres(),
        },
        yAxis: {
          type: 'value',
          
        },
        series: [
          { 
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#A2D9CE' },
              { offset: 0.5, color: '#73C6B6' },
              { offset: 1, color: '#45B39D' }
            ]),
            data: obtenerSectoresValores(),
            type: 'bar'
          }
        ]
      };

      //ORIGEN DE AVERIA - REPORTES TERMINADOS 

      let graficaOrigenAveria= {
        title: {
          text: 'ORIGEN DE AVERIA',
          // subtext: 'HORAS DE TIEMPO DE RESPUESTA',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
      xAxis: {
        
        type: 'category',
        axisLabel: {
          interval: 0,
          rotate: 27,
          fontSize: 8.5
        },
        data: obtenerOrigenAveriaNombre(),
      },
      yAxis: {
        type: 'value'
      },
      series: [
        { 
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#A2D9CE' },
            { offset: 0.5, color: '#73C6B6' },
            { offset: 1, color: '#45B39D' }
          ]),
          data: obtenerOrigenAveriaValores(),
          type: 'bar'
        }
      ]
        };


      useEffect(() => {
   //Llamado de las funciones que realizan peticiones en la API de KEYCITY
   peticionesAPIValoresIndicadores();
   
   //Obtener lista de cuadrillas
   informacionCuadrilla();

         }, [])
  
    // const [age, setAge] = React.useState('');

    const seleccionarGrafica = (event) => {
      const {
       target: { value },
     } = event;
     setGrafica(
       // On autofill we get a stringified value.
       typeof value === 'string' ? value.split(',') : value,
       graficaSeleccionada.current = typeof value === 'string' ? value.split(',') : value
       
     );
     
     mostrarGraficasOrigenA(graficaSeleccionada.current);
   }

   
    return(

         
        <div>
            <Box sx={{ flexGrow: 1 }}>
           <div id="lineaDeProgreso"><LinearProgress/></div>

       <div>
        <Grid container spacing={3}>
        <Grid item xs={4}>
           <Grid item xs={12}>
             <div className='contenedorFechas'> 
            
          <LocalizationProvider dateAdapter={AdapterDayjs}>

          <DemoContainer components={['DatePicker', 'DatePicker']}>
            <Grid item xs={8}>
            <DatePicker
              label="Fecha inicial"
              format="YYYY-MM-DD"
              value={dayjs(dataFechaInicial.current)}
              onChange={(newValue) => setDataFechaInicialMethod(newValue)}
            />
            </Grid>
            <Grid item xs={8}>
            <DatePicker 
              label="Fecha final"
              format="YYYY-MM-DD"
              value={dayjs(dataFechaFinal.current)}
              onChange={(newValue) => setDataFechaFinalMethod(newValue)}
            />     
          </Grid>
          </DemoContainer>

        </LocalizationProvider>
        </div>
        </Grid>
          <Grid item xs={10}>
             
          <div className='contenedorTarjeta'>
          <Card variant="solid" color="primary" invertedColors>
            <CardContent orientation="horizontal">
          
              <CardContent>
                <Typography level="h2" >Resumen</Typography>
                <Typography level="h1">{dataResumen}</Typography>
              </CardContent>
            </CardContent>
            <CardActions>
              <CardContent variant="soft" size="sm">
                <Typography level="h2">{dataMediana}</Typography>
                  <Typography level="h5">Mediana tiempo respuesta en horas</Typography>
              </CardContent>
              <CardContent variant="solid" size="sm">
                <Typography level="h2">{dataPromedio}</Typography>
                  <Typography level="h5">Promedio tiempo respuesta en horas</Typography>
              </CardContent>
            </CardActions>
          </Card>
          </div>
          </Grid>
        </Grid>

        <Grid item xs={3}>
        <div className='contenedorTabla' id="menu">
         
        <FormControl component="fieldset" variant="standard">
      <FormLabel component="legend">Seleccione el canal de entrada</FormLabel>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch checked={state.appCiudadana} onChange={handleChange} name="appCiudadana"/>
          }
          label="App Ciudadana"
        />
        <FormControlLabel
          control={
            <Switch checked={state.callCenter} onChange={handleChange} name="callCenter" />
          }
          label="Call center"
        />
        <FormControlLabel
          control={
            <Switch checked={state.oficio} onChange={handleChange} name="oficio" />
          }
          label="Oficio"
        />
        <FormControlLabel
          control={
            <Switch checked={state.peticionDirecta} onChange={handleChange} name="peticionDirecta" />
          }
          label="Petición directa"
        />
        <FormControlLabel
          control={
            <Switch checked={state.redesSociales} onChange={handleChange} name="redesSociales" />
          }
          label="Redes sociales"
        />
        <FormControlLabel
          control={
            <Switch checked={state.reporteEnCampo} onChange={handleChange} name="reporteEnCampo" />
          }
          label="Reporte en campo"
        />
        <FormControlLabel
          control={
            <Switch checked={state.rondasInspeccion} onChange={handleChange} name="rondasInspeccion" />
          }
          label="Rondas de inspección"
        />
        <FormControlLabel
          control={
            <Switch checked={state.tasaAverias} onChange={handleChange} name="tasaAverias" />
          }
          label="Tasa de averias"
        />
      </FormGroup>
    </FormControl>
       
       </div>


      <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-chip-label">Responsable</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={personName}
          onChange={handleChangeChip}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          { obtenerCuadrillaNombres(listaCuadrillas).map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, personName, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>

    </Grid> 
     <Grid item xs={5}>
        <div ref={mapContainer} className="map-container-dashboard-reportes "></div>
     </Grid>
         
        <Grid item xs={6}>
        <div className='contenedorTabla'><ReactEcharts option={sector} /></div>
        </Grid>
        <Grid item xs={6}>
        <div className='contenedorTabla'><ReactEcharts option={graficaTiemposDeRespuesta} /></div>
        </Grid>
        <Grid item xs={12}>
        <Grid item xs={3}>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small" id="select-origen-averia">
        <InputLabel id="demo-select-small-label">Gráfica</InputLabel>
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          value={grafica}
          label="Gráfica"
          onChange={seleccionarGrafica}
        > 
       
          { obtenerOrigenAveriaNombre().map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, grafica, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
        </Grid>
        <div><ReactEcharts option={graficaOrigenAveria} /></div>
        </Grid>

       <Grid item xs={12} id='otros'><div className='contenedorTabla'>{graficaOrigenAveriaIndividual}</div></Grid>

      </Grid>
      </div> 
        </Box>
        </div> 
    );
   }

export default DashboardTerminados;