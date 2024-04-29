import React, { useEffect, useState } from "react";
import GoogleMaps from "../components/GoogleMaps/GoogleMaps";
import axios from "axios";
import { Url } from '../constants/global'
import TopBar from "../layout/TopBar/TopBar";
import MenuModulos from "../layout/MenuModulos/MenuModulos";


const GoogleMapsTest = () => {
    const token = localStorage.getItem('token');
    const id_proyecto = localStorage.getItem('id_proyecto')
    const [ geojson, setGeojson ] = useState();

    useEffect( () => {
        let url = Url + "luminarias?proyecto=" + id_proyecto;
        console.log("inicia busqueda");
        axios.get(url, {
            headers: {
                Authorization : token,
            }
          })
        .then(res =>  {
            console.log( "responde geojson", res );
            setGeojson(res.data);
        }).catch( err => console.log(err) )
    }, []);

    const openModal = (data) => {
        console.log("asset", data)
    }
    
	return (
        <div className="AppMapReports">
			<TopBar titulo={"Mapa Deteccion de tráfico"}/>
			<div className="work-areaMapReports">
				<MenuModulos /> 
				<GoogleMaps 
                    latitud={19.0405639} 
                    longitud={-98.1984569} 
                    points={geojson}
                    onmarkerclic={openModal} />
			</div>
            
		</div>
	);
}

export default GoogleMapsTest;