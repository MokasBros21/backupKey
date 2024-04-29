import TableReportesCliente from '../../components/Tables/Reportes/TableReportesCliente';
import MenuModulos from '../../layout/MenuModulos/MenuModulos';
import TopBar from '../../layout/TopBar/TopBar';
import './TReportesC.scss'

const TReportesC = () => {

    return(
        <div className="App_ReportesC">
		<TopBar titulo={"Reportes"}/>
			<div className="work-area_ReportesC">
				<MenuModulos />
				<TableReportesCliente/>
			</div>
        </div>
    );
}

export default TReportesC