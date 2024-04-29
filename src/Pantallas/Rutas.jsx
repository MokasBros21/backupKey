import MapRoute from '../components/MapRoutes/MapRoute';
import MenuModulos from '../layout/MenuModulos/MenuModulos';
import TopBar from '../layout/TopBar/TopBar';

import './Rutas.scss';
import 'semantic-ui-css/semantic.min.css'

const Main = () => {

	//localStorage.setItem('token', token);

	return (
		<div className="AppRutas">
			<TopBar titulo={"A"}/>
			<div className="work-areaRutas">
				<MenuModulos />
				<MapRoute />
			</div>
		</div>
	);
}

export default Main;