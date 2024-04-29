import MapReportes from '../components/MapReportes/MapReportes';
import MapGoogleReportes from '../components/MapReportesGoogle/MapGoogleReportes';
import MenuModulos from '../layout/MenuModulos/MenuModulos';
import TopBar from '../layout/TopBar/TopBar';

import './MapaReportesFiltro.scss'
import 'semantic-ui-css/semantic.min.css'

const MapaReportesFiltro = () => {

	//localStorage.setItem('token', token);

	return (
		<div className="AppMapReportsFiltro">
			<TopBar titulo={"Reportes"}/>
			<div className="work-areaMapReportsFiltro">
				<MenuModulos />
				{/*<MapReportes />*/}
				<MapGoogleReportes />
			</div>
		</div>
	);
}

export default MapaReportesFiltro;