import React from "react";
import { Container } from "react-bootstrap";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Meta from "./components/Meta";

const App = () => {
  const location = useLocation();

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
