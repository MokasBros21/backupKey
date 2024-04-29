import Usuario from '../../components/NewUsuario/Usuario';
import MenuModulos from '../../layout/MenuModulos/MenuModulos';
import TopBar from '../../layout/TopBar/TopBar';
import './NewUser.scss';

const NewUser = () => {

    return(
		<div className="App_Register">
		<TopBar titulo={"Registrar Usuario"}/>
			<div className="work-area_Register">
				<MenuModulos />
				<Usuario/>
			</div>
		</div>
    );
}

export default NewUser
