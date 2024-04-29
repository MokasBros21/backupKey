import React, { useState } from "react";

import MenuModulos from '../layout/MenuModulos/MenuModulos';
import TopBar from '../layout/TopBar/TopBar';
import Mapa from '../components/Mapa/Mapa';

import './MapaDeepblue.scss'
import 'semantic-ui-css/semantic.min.css'
import geojson from "../assets/deepblue.json"
import KeyModal from "../components/KeyModal/KeyModal";

import auto from "../assets/graficas_deepblue/auto.png";
import bike from "../assets/graficas_deepblue/bike.png";
import bus from "../assets/graficas_deepblue/bus.png";
import heavy from "../assets/graficas_deepblue/heavy.png";
import motorBike from "../assets/graficas_deepblue/motorbike.png";
import people from "../assets/graficas_deepblue/people.png";

import auto2 from "../assets/graficas_deepblue/auto_2.png";
import bike2 from "../assets/graficas_deepblue/bike_2.png";
import bus2 from "../assets/graficas_deepblue/bus_2.png";
import heavy2 from "../assets/graficas_deepblue/heavy_2.png";
import motorBike2 from "../assets/graficas_deepblue/motorbike_2.png";


const MapaDeepblue = () => {

    const [ modalAbierto, setModalAbierto ] = useState(false);
    const [ datosSensor, setDatosSensor ] = useState({});

	//localStorage.setItem('token', token);
    const dibujaModal = (datos) => {
        console.log("en el rendererer", datos);
        setModalAbierto(true);
        setDatosSensor(datos);
    }

    const cierraModal = () => {
        setModalAbierto(false);
    }

	return (
		<div className="AppMapReports">
			<TopBar titulo={"Mapa Deteccion de tráfico"}/>
			<div className="work-areaMapReports">
				<MenuModulos /> 
				<Mapa 
                    latitudReporte={20.646162} 
                    longitudReporte={-87.065021} 
                    luminarias={false}
                    initialZoom={12.5}
                    marcadores={geojson}
                    markerClick={dibujaModal}
                    markerRadius={8} /> 
			</div>

            <KeyModal open={modalAbierto} onClose={cierraModal} title={ "Aforo registrado" } >
                {
                    datosSensor.location === 1 ?
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ fontDecoration: "italic" }}>Vehiculos (12/12/2023 - 13/12/2023)</div>
                        <img src={auto} alt="" style={{ width: "100%" }} />
                        <hr />
                        
                        <div style={{ fontDecoration: "italic" }}>Bicicletas (12/12/2023 - 13/12/2023)</div>
                        <img src={bike} alt="" />
                        <hr />

                        <div style={{ fontDecoration: "italic" }}>Autobuses (12/12/2023 - 13/12/2023)</div>
                        <img src={bus} alt="" />
                        <hr />

                        <div style={{ fontDecoration: "italic" }}>Tráfico pesado (12/12/2023 - 13/12/2023)</div>
                        <img src={heavy} alt="" />
                        <hr />

                        <div style={{ fontDecoration: "italic" }}>Motocicletas (12/12/2023 - 13/12/2023)</div>
                        <img src={motorBike} alt="" />
                        <hr />

                        <div style={{ fontDecoration: "italic" }}>Peatones (12/12/2023 - 13/12/2023)</div>
                        <img src={people} alt="" />
                        <hr />
                        
                    </div>
                    :
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ fontDecoration: "italic" }}>Vehiculos (13/12/2023 - 14/12/2023)</div>
                        <img src={auto2} alt="" style={{ width: "100%" }} />
                        <hr />
                        
                        <div style={{ fontDecoration: "italic" }}>Bicicletas (13/12/2023 - 14/12/2023)</div>
                        <img src={bike2} alt="" />
                        <hr />

                        <div style={{ fontDecoration: "italic" }}>Autobuses (13/12/2023 - 14/12/2023)</div>
                        <img src={bus2} alt="" />
                        <hr />

                        <div style={{ fontDecoration: "italic" }}>Tráfico pesado (13/12/2023 - 14/12/2023)</div>
                        <img src={heavy2} alt="" />
                        <hr />

                        <div style={{ fontDecoration: "italic" }}>Motocicletas (13/12/2023 - 14/12/2023)</div>
                        <img src={motorBike2} alt="" />
                        <hr />

                        
                    </div>
                }
            </KeyModal>
            
		</div>
	);
}

export default MapaDeepblue;