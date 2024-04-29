import TableUsers from '../../components/Tables/Usuarios/TableUsuarios';
import MenuModulos from '../../layout/MenuModulos/MenuModulos';
import TopBar from '../../layout/TopBar/TopBar';
import './TUsuarios.scss'

const TUsuarios = () => {

    return(
        <div className="App_Users">
		<TopBar titulo={"Usuarios"}/>
			<div className="work-area_Users">
				<MenuModulos />
				<TableUsers/>
			</div>
        </div>
    );
}

export default TUsuarios