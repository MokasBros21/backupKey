import MenuModulos from '../layout/MenuModulos/MenuModulos';
import TopBar from '../layout/TopBar/TopBar';
import Dashboard from '../components/Dashboard/Dashboard';

import './ReportesEventos.scss';
import 'semantic-ui-css/semantic.min.css'

const Indicadores = () => {
	return (
		<>
		<div className="App">
		<TopBar titulo={"Indicadores de reportes"}/>
			<div className="work-area">
				
				<MenuModulos/>
			   <div className='dimensiones'><Dashboard/></div>
			</div>
		</div>
		</>
	);
}

export default Indicadores;