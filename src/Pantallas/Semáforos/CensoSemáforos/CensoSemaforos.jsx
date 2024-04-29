import MapSemaforos from '../../../components/MapaSemáforos/MapSemáforos';
import MenuModulos from '../../../layout/MenuModulos/MenuModulos';
import TopBar from '../../../layout/TopBar/TopBar';

import './CensoSemaforos.scss';
import 'semantic-ui-css/semantic.min.css'

const CensoSemaforos = () => {

	//localStorage.setItem('token', token);

	return (
		<div className="CensoSemaforos">
			<TopBar titulo={"Semáforos"}/>
			<div className="work-area_CensoSemaforos">
				<MenuModulos />
				<MapSemaforos />
			</div>
		</div>
	);
}

export default CensoSemaforos;