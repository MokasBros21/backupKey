import MenuModulos from '../layout/MenuModulos/MenuModulos';
import TopBar from '../layout/TopBar/TopBar';
import MapGoogle from '../components/MapGoogle/MapGoogle';

import './NewReporte.scss';
import 'semantic-ui-css/semantic.min.css'

const Main = () => {

	//localStorage.setItem('token', token);

	return (
		<div className="AppNewReport">
			<TopBar titulo={"Creación de Reportes"}/>
			<div className="work-areaNewReport">
				<MenuModulos />
				<MapGoogle />
			</div>
		</div>
	);
}

export default Main;