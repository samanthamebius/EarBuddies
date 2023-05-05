import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LogInPage from "./login/LogInPage";
import HomePage from "./home/HomePage";
import PageLayout from "./PageLayout";
import StudioPage from "./studio/StudioPage";
import PageNotFound from "./PageNotFound";
import io from "socket.io-client";
import { AppContextProvider } from "./AppContextProvider";

const socket = io("http://localhost:3000", { autoConnect: false });

document.body.style.overflow = "hidden";

function App() {
	return (
		<AppContextProvider>
			<BrowserRouter>
				<Routes>
					<Route path="login" element={<LogInPage />} />
					<Route path="/" element={<PageLayout />}>
						<Route index element={<HomePage socket={socket} />} />
						<Route path="studio/:id" element={<StudioPage socket={socket} />} />
						<Route path="*" element={<PageNotFound />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</AppContextProvider>
	);
}

export default App;
