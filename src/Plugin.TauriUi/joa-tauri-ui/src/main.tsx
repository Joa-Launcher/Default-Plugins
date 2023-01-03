import React from "react";
import ReactDOM from "react-dom/client";
import "./style.css";
import SearchWrapper from "./components/SearchWrapper";
import SettingsWrapper from "./components/SettingsWrapper";

const router = () => {
    if(window.location.pathname == "/settings"){
        return <SettingsWrapper/>
    }else if(window.location.pathname == "/search"){
        return <SearchWrapper/>
    }
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
    .render(router());

