import TableReportes from '../components/Tables/Reportes/TableReportes';
import MenuModulos from '../layout/MenuModulos/MenuModulos';
import TopBar from '../layout/TopBar/TopBar';

import './Reportes.scss';
//import 'semantic-ui-css/semantic.min.css'

const Reportes = () => {
	return (
		<>
		<div className="AppReporte">
		<TopBar titulo={"Reportes"}/>
			<div className="work-areaReporte">
				<MenuModulos />
				<TableReportes/>
			</div>
		</div>
		</>
	);
}

export default Reportes;