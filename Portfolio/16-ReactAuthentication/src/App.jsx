import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MoviePage from './pages/MoviePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthForm from './components/AuthForm';
import { Navbar, Container, Nav, Modal } from 'react-bootstrap';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from './store';

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

function AppContent() {
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [showLogin, setShowLogin] = React.useState(false);
  const [showSignup, setShowSignup] = React.useState(false);

  const handleAuth = ({ token, username }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    dispatch({ type: 'LOGIN_SUCCESS', payload: { token, username } });
    setShowLogin(false);
    setShowSignup(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">Star Wars Fandom</Navbar.Brand>
          <Nav className="ms-auto">
            {!auth.token ? (
              <>
                <Nav.Link onClick={() => setShowLogin(true)}>Login</Nav.Link>
                <Nav.Link onClick={() => setShowSignup(true)}>Sign Up</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                <Nav.Link disabled>Welcome, {auth.username}</Nav.Link>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>
      <Modal show={showLogin} onHide={() => setShowLogin(false)} centered>
        <Modal.Body>
          <AuthForm onAuth={handleAuth} mode="login" />
        </Modal.Body>
      </Modal>
      <Modal show={showSignup} onHide={() => setShowSignup(false)} centered>
        <Modal.Body>
          <AuthForm onAuth={handleAuth} mode="signup" />
        </Modal.Body>
      </Modal>
      <Routes>
        <Route path="/" element={<Home auth={auth} />} />
        <Route path="/movie/:id" element={<MoviePage auth={auth} />} />
      </Routes>
    </Router>
  );
}

export default App;
