import './App.css'
import Header from './components/layout/header.jsx';
import { Outlet, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './components/layout/footer.jsx';
import { useEffect } from 'react';
import { setNavigate } from './utils/axiosCustomize.jsx';

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return (
    <div className="app-container">
      <div className='header-container'>
        <Header />
      </div>
      <div className='main-container'>
        <div className='sidenav-container'>

        </div>
        <div className="app-content">
          <Outlet />
        </div>

      </div>
      <div className='footer-container'>
        <Footer />
      </div>
    </div>
  )
}

export default App;