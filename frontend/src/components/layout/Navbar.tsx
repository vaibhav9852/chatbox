import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {  useSelector} from 'react-redux';
import { logout} from '../../redux/features/authentication/authSlice'
import { useDispatch } from 'react-redux'; 
import { Rootstate } from 'src/redux/store';
const Navbar: React.FC = () => { 
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
// const [mobileMenuOpen, setMobileMenuOpen] = useState(false);     
  const dropdownRef = useRef<HTMLDivElement>(null); 
  const dispatch = useDispatch()     
  const loginUser  = useSelector((state : Rootstate) => state.auth.loginUser)
  const isAuthenticated =  useSelector((state : Rootstate) => state.auth.isAuthenticated)
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  };

  
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout())  
    navigate('/login') 
  };

  return (
    <nav className="bg-gradient-to-r from-cyan-500 to-blue-500   text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <Link to="/chat" className="text-2xl font-bold">
          ChatApp
        </Link>

       
        {/* <button 
          className="md:hidden "
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle Menu"
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button> */}

        {/* Links & Dropdown */}
        <div>
          {isAuthenticated ? (  
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}  
                aria-expanded={dropdownOpen} 
                className="flex items-center space-x-2 px-4 py-2 bg-cyan-500 rounded-full "
              >
                <span>{loginUser?.name}</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded-md shadow-lg">
              { isAuthenticated &&    <Link to={`/profile/${loginUser?.id}`} className="block px-4 py-2 hover:bg-gray-100" >
                    Profile
                  </Link> }
             {  isAuthenticated && <button  onClick={handleLogout}  className="block w-full text-left px-4 py-2 hover:bg-gray-100" >
                    Logout
                  </button> }
                </div>
              ) }
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-200"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
