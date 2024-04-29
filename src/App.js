import './App.css';
import 'semantic-ui-css/semantic.min.css'

import {
	Routes, Route, HashRouter, Navigate
} from "react-router-dom";

import { rutas } from './services/routes';


function App() {
	//Algo
	return (
		<HashRouter>
			<Routes>
				<Route
					path="/"
					element={<Navigate to="/login" replace />}
				/>
				{
					rutas.map(
						(ruta, indice) => {
							return (
								<Route 
									path={ruta.ruta} 
									key={indice}
									element={ruta.component}
									//element={ruta.isPrivate && !localStorage.getItem('token') ? <Navigate to="/" /> : ruta.component}
									/>
							)
						}
					)

				}
			</Routes>
	  	</HashRouter>
	);
  }

export default App;

