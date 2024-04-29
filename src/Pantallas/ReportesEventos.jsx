import TableReportesEventos from '../components/Tables/ReportesEvento/TableReportesEventos';
import MenuModulos from '../layout/MenuModulos/MenuModulos';
import TopBar from '../layout/TopBar/TopBar';

import './Reportes.scss';
import 'semantic-ui-css/semantic.min.css'

const ReportesEventos = () => {
	return (
		<>
		<div className="App">
		<TopBar titulo={"Reportes Origen"}/>
			<div className="work-area">
				<MenuModulos />
				<TableReportesEventos/>
			</div>
		</div>
		</>
	);
}

export default ReportesEventos;