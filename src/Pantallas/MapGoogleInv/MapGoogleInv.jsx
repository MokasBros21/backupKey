import MapGoogleInv from '../../components/Mapas Google/MapaGoogleInversion/MapGoogleInversion.jsx';
import MenuModulos from '../../layout/MenuModulos/MenuModulos.jsx';
import TopBar from '../../layout/TopBar/TopBar.jsx';

import './MapGoogleInv.scss'
import 'semantic-ui-css/semantic.min.css'

const MapaReportesFiltro = () => {
	return (
		<div className="AppMapInversiones">
			<TopBar titulo={"Inversiones"}/>
			<div className="work-areaMapInversiones">
				<MenuModulos />
				<MapGoogleInv />
			</div>
		</div>
	);
}

export default MapaReportesFiltro;