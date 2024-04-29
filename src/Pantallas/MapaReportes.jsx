import MapReportesAlta from '../components/MapReportesAlta/MapReportesAlta';
import MenuModulos from '../layout/MenuModulos/MenuModulos';
import TopBar from '../layout/TopBar/TopBar';

import './MapaReportes.scss'
import 'semantic-ui-css/semantic.min.css'

const MapaReportes = () => {

	//localStorage.setItem('token', token);

	return (
		<div className="AppMapReports">
			<TopBar titulo={"Mapa Reportes"}/>
			<div className="work-areaMapReports">
				<MenuModulos />
				<MapReportesAlta />
			</div>
		</div>
	);
}

export default MapaReportes;