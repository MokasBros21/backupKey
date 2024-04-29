import React, { useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import axios from "axios";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from "@mui/x-date-pickers";
import { Button } from "@mui/material";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import MenuModulos from '../../layout/MenuModulos/MenuModulos';
import TopBar from '../../layout/TopBar/TopBar';
import KeyModal from "../../components/KeyModal/KeyModal";
import GoogleMaps from "../../components/GoogleMaps/GoogleMaps";

import { Url, tiposDeepblue } from "../../constants/global";
import { darkStyleClean } from "../../components/GoogleMaps/GoogleMapsStyle";

import 'semantic-ui-css/semantic.min.css';
import "./TraficoSensores.scss";

const graficaDefault = {
    title: {
      text: 'Aforo total',
    },
    tooltip: {},
    legend: {
        orient: 'vertical',
        right: 0,
        height: '630px',
    },
    xAxis: {
      data: []
    },
    yAxis: {
        name: 'Volumen'
    },
    series: []
};

const TraficoSensores = () => {

    const proyectoId = localStorage.getItem('id_proyecto')
    const token = localStorage.getItem('token');
    const defaultLatitud = parseFloat( localStorage.getItem('pr_lat') ) || 19.041147;
    const defaultLongitud = parseFloat( localStorage.getItem('pr_lng') ) || -98.2026809;
    
    const [ modalAbierto, setModalAbierto ] = useState(false);
    const [ datosSensor, setDatosSensor ] = useState({});
    const [ datosGrafica, setDatosGrafica ] = useState(graficaDefault);

    const [ inicio, setInicio ] = useState( dayjs( new Date() ) );
    const [ fin, setFin ] = useState( dayjs( new Date() ) );

    const [ sensor, setSensor ] = useState({ id: "1", etiquete: "Sensor incorrecto"});
    const [ tag, setTag ] = useState("all");

    useEffect( () => {
        var url = Url + 'trafico-sensores?proyecto=' + proyectoId;
        axios.get(url, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            console.log( res );
            setDatosSensor(res.data);
        })
        .catch(err => {
            console.log("No se pudo consultar el punto de sensor de trafico. ", err);
        })

    }, [ proyectoId, token ] );

    const cierraModal = () => {
        setModalAbierto(false);
    }


    const construyeSeries = (datos) => {
        let series = [];
        datos.forEach( (item) => {
            let valores = [];
            item.datos.forEach( (itemDato) => {
                valores.push(itemDato[0]);
            } );
            series.push(
                {
                    name: item.nombre,
                    type: 'line',
                    data: valores,
                    smooth: true,
                }
            )
        });
        return series;
    }

    const getTag = (currTag) => {
        let text = "";
        switch ( currTag ) {
            case tiposDeepblue.AUTOBUS: text="Autobus"; break;
            case tiposDeepblue.BICICLETA: text="Bicicleta"; break;
            case tiposDeepblue.CAMION: text="Camión"; break;
            case tiposDeepblue.ESCOOTER: text="Escooter"; break;
            case tiposDeepblue.MOTOCICLETA: text="Motocicleta"; break;
            case tiposDeepblue.MOTONETA: text="Motoneta"; break;
            case tiposDeepblue.MOTORIZADOS: text="Vehículos motorizados"; break;
            case tiposDeepblue.PEATON: text="Peatón"; break;
            case tiposDeepblue.TODOS: text="Todos"; break;
            case tiposDeepblue.VAN: text="Van"; break;
            case tiposDeepblue.VEHICULO: text="Vehículos"; break;
            default: break;
        }
        return text;
    }

    const contruyeGrafica = (datos) => {
        let series = construyeSeries(datos.data);
        let grafica = {
            title: {
              text: 'Aforo total ' + getTag(tag),
            },
            tooltip: {},
            legend: {
                orient: 'vertical',
                right: 0,
                height: '630px',
            },
            xAxis: {
              data: datos.dates
            },
            yAxis: {
                name: 'Volumen'
            },
            series: series
        };
        setDatosGrafica(grafica);
    }

    const muestraGrafica = (data) => {
        setSensor(data);
        actualizaGrafica();
    }

    const actualizaGrafica = () => {
        setDatosGrafica(graficaDefault);
        setModalAbierto(true);
        let fechaInicio = dayjs(inicio).format("YYYY-MM-DD HH:mm:ss");
        let fechaFin = dayjs(fin).format("YYYY-MM-DD HH:mm:ss");
        var url = Url + 'trafico-sensores/' + sensor.id + '/stats?inicio=' + fechaInicio + '&fin=' + fechaFin + '&tags=' + tag;
        axios.get(url, {
            headers: {
                Authorization : token,
            }
        })
        .then(res =>  {
            console.log( res );
            contruyeGrafica( res.data );
        })
        .catch(err => {
            console.log("No se pudo consultar el punto de sensor de trafico. ", err);
        })
    }

    const selectTag = (event) => {
        setTag(event.target.value);
    };

	return (
		<div className="AppMapReports TraficoSensores">
			<TopBar titulo={"Mapa Deteccion de tráfico"}/>
			<div className="work-areaMapReports">
				<MenuModulos /> 
				<GoogleMaps 
                    latitud={defaultLatitud} 
                    longitud={defaultLongitud} 
                    points={datosSensor}
                    zoom={13.5}
                    tamano={30}
                    onmarkerclic={muestraGrafica}
                    mapStyle={darkStyleClean}
                    defaultIcon={"https://maps.google.com/mapfiles/kml/pal4/icon7.png"} /> 
			</div>

            <KeyModal open={modalAbierto} onClose={cierraModal} title={ "Aforo registrado - "+sensor.etiqueta } width={80} height={85} >
                <div className="filtros-grafica">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker 
                            label="Desde" 
                            value={inicio}
                            onChange={ (newValue) => setInicio(newValue) }
                            format={"YYYY-MM-DD HH:mm:ss"} />
                    </LocalizationProvider>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker 
                            label="Hasta" 
                            value={fin}
                            onChange={ (newValue) => setFin(newValue) }
                            format={"YYYY-MM-DD HH:mm:ss"} />
                    </LocalizationProvider>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={tag}
                                label="Tipo"
                                onChange={selectTag}>

                                <MenuItem value={tiposDeepblue.TODOS}>Todos</MenuItem>
                                <MenuItem value={tiposDeepblue.AUTOBUS}>Autobus</MenuItem>
                                <MenuItem value={tiposDeepblue.VEHICULO}>Automóviles</MenuItem>
                                <MenuItem value={tiposDeepblue.BICICLETA}>Bicicleta</MenuItem>
                                <MenuItem value={tiposDeepblue.CAMION}>Camiones</MenuItem>
                                <MenuItem value={tiposDeepblue.ESCOOTER}>Escooter</MenuItem>
                                <MenuItem value={tiposDeepblue.MOTOCICLETA}>Motocicleta</MenuItem>
                                <MenuItem value={tiposDeepblue.MOTONETA}>Motoneta</MenuItem>
                                <MenuItem value={tiposDeepblue.PEATON}>Peatones</MenuItem>
                                <MenuItem value={tiposDeepblue.VAN}>Van</MenuItem>
                                <MenuItem value={tiposDeepblue.MOTORIZADOS}>Vehiculos motorizados</MenuItem>
                                
                            </Select>
                        </FormControl>
                        </Box>
                    <Button onClick={actualizaGrafica}>Ver gráfica</Button>
                </div>
                <div className="grafica-container">
                    <ReactEcharts option={datosGrafica} />
                </div>
            </KeyModal>
            
		</div>
	);
}

export default TraficoSensores;