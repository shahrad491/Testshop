import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Meta from "./components/Meta";
import { useProfileMutation } from "./slices/userApi.slice";
import { logout } from "./slices/auth.slice";

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const [profile] = useProfileMutation();

  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      profile().then((res) => (res.error ? dispatch(logout()) : null));
    }
  }, [profile, dispatch]);
  return (
    <>
      <Header />
      <Meta />
      <main className="py-3">
        <Container>
          {location.pathname === "/" ? <h1>Welcome to ProShop</h1> : ""}
          <Outlet />
        </Container>
      </main>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default App;
