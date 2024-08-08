import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider, Layout, theme } from "antd";
import AppHeader from "./components/Header/AppHeader";
import Home from "./components/Home/Home";

const { Content } = Layout;
const { darkAlgorithm } = theme;

function App() {
  return (
    <div className="App">
      <Router>
        <ConfigProvider
          theme={{
            algorithm: darkAlgorithm,
          }}
        >
          <Layout className="layout">
            <AppHeader />
            <Content>
              <Routes>
                <Route path="/" element={<Home />} />
                {/* <Route path="/history" element={<History />} />
                <Route path="/favourites" element={<Favourites />} /> */}
              </Routes>
            </Content>
          </Layout>
        </ConfigProvider>
      </Router>
    </div>
  );
}

export default App;
