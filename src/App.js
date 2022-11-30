import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Layout from "./components/Layout/Layout";
import SignIn from "./pages/SignIn/SignIn";
import KokoCalc from "./pages/KokoCalc/KokoCalc";
import BarcodeGen from "./pages/BarcodeGen/BarcodeGen";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

function App() {
  return (
    <div className="app vh_100">
      <ScrollToTop>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/kokocalc"
            element={
              <Layout>
                <KokoCalc />
              </Layout>
            }
          />
          <Route
            path="/barcodegen"
            element={
              <Layout>
                <BarcodeGen />
              </Layout>
            }
          />
        </Routes>
      </ScrollToTop>
    </div>
  );
}

export default App;
