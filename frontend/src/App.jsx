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
						{/* Error handeling routes */}
						<Route path="*" element={<PageNotFound errorType="404" />} />
						<Route path="/404" element={<PageNotFound errorType="404" />} />
						<Route path="/400" element={<PageNotFound errorType="400" />} />
						<Route path="/500" element={<PageNotFound errorType="500" />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</AppContextProvider>
	);
}

export default App;
