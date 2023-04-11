import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LogInPage from "./LogInPage";
import HomePage from "./HomePage";
import PageLayout from "./PageLayout";
import ProfilePage from "./ProfilePage";
import io from "socket.io-client";

const socket = io("http://localhost:3000", { autoConnect: false });
const code = new URLSearchParams(window.location.search).get("code");

document.body.style.overflow = "hidden";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/* check if user is already logged in, if not redirect to login page */}
				<Route path="login" element={<LogInPage />} />
				<Route path="/" element={<PageLayout />}>
					<Route index element={<HomePage socket={socket} />} />
					<Route path="profile" element={<ProfilePage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
