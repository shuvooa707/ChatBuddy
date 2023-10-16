import React from 'react'
import ReactDOM from 'react-dom/client'
// import { Route, Switch, BrowserRouter} from 'react-router-dom';
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";

import App from './App.jsx';
import "./assets/css/chat.css";
import "./assets/css/index.css";

ReactDOM.createRoot(document.getElementById('root')).render(
	<BrowserRouter>
        <App />
	</BrowserRouter>
)
