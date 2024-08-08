import { Layout, Menu } from "antd";
import { Link } from 'react-router-dom';
import { HomeOutlined, HistoryOutlined, StarOutlined } from "@ant-design/icons";

const { Header } = Layout;

const AppHeader = () => (
  <Header className="header">
    <div className="logo" />
    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["home"]}>
      <Menu.Item key="home" icon={<HomeOutlined />}>
        <Link to="/">Home</Link>
      </Menu.Item>
      <Menu.Item key="history" icon={<HistoryOutlined />}>
        <Link to="/history">History</Link>
      </Menu.Item>
      <Menu.Item key="favourites" icon={<StarOutlined />}>
        <Link to="/favourites">Favourites</Link> 
      </Menu.Item>
    </Menu>
  </Header>
);

export default AppHeader;
