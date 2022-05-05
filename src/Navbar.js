import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import './stylesheets/Navbar.css'

function Navbar() {

    const [click, setClick] = useState(false);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    return (
        <>
            <nav className="navbar" >
                <div className="navbar-container">
                    <Link to="/" className="navbar-jaden" >
                        JADEN
                    </Link>
                    <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                        <li className="nav-item">
                            <Link to='/test' className='nav-links' onClick={closeMobileMenu}>
                                Test
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}

export default Navbar