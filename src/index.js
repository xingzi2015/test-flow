import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import MenuBar from "./front_end/components/MenuBar";
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Home from "./front_end/components/Home";
import TaskTracker from "./front_end/components/TaskTracker";

const root = ReactDOM.createRoot(document.getElementById('root'));

const AppRoutes = () => (
    <>
        <MenuBar />
        <Outlet />
    </>
);

const HomeWrapper = () => (
    <Home />
);

const TaskTrackerWrapper = () => (
    <TaskTracker />
);

const App = () => (
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<AppRoutes />}>
                    <Route index element={<HomeWrapper />} />
                    <Route path="task_tracker" element={<TaskTrackerWrapper />} />
                </Route>
            </Routes>
        </Router>
    </React.StrictMode>
);

root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
