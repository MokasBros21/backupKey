import TableRecorridos from '../components/Tables/Recorridos/TableRecorridos';
import MenuModulos from '../layout/MenuModulos/MenuModulos';
import TopBar from '../layout/TopBar/TopBar';

import './ReportesEventos.scss';
import 'semantic-ui-css/semantic.min.css'

const Recorridos = () => {
	return (
		<>
		<div className="App">
		<TopBar titulo={"Recorridos"}/>
			<div className="work-area">
				<MenuModulos />
				<div className='dimensiones_recorrido'><TableRecorridos/></div>
			</div>
		</div>
		</>
	);
}

export default Recorridos;