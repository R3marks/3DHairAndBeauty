import React from 'react'
import Scene from './Scene'
import Test from './Test'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' exact element={<Scene />} />
                <Route path='/test' exact element={<Test />} />
            </Routes>
        </Router>
    )
}

export default App