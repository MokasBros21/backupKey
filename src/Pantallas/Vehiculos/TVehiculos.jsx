import TopBar from '../../layout/TopBar/TopBar';
import MenuModulos from '../../layout/MenuModulos/MenuModulos';
import TableVehiculos from '../../components/Tables/Vehiculos/TableVehiculos';

import './TVehiculos.scss';
//import 'semantic-ui-css/semantic.min.css'

const TVehiculos = () => {

	return (
		<>
		<div className="App_Vehiculos">
		<TopBar titulo={"Vehiculos"}/>
			<div className="work-area_Vehiculos">
				<MenuModulos />
				<TableVehiculos/>
			</div>
		</div>
		</>
	);
}

export default TVehiculos;