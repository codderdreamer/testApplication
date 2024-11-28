import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Home from "../Pages/Home"

const RouteList = () => {

    return (
        // <Router>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        // </Router>
    );
};

export default RouteList;
