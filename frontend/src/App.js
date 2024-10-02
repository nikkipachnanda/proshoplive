import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import { Container } from 'react-bootstrap';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import { Outlet } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <div>
         <ToastContainer />
      <Header />
      <main>
        <Container>
           <Outlet />
        </Container>
      </main>
      <Footer />

    </div>
  );
}

export default App;
