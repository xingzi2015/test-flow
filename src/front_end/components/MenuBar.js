import React, {useEffect, useState} from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Menu,Layout } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './css/common.css'
const { Header, Content, Footer, Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    const item: MenuItem = {
        key,
        icon,
        children,
        label,
        type,
    };

    return item;
}

const MenuBar: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                const response = await axios.get('http://localhost:8888/api/menu_bar');
                const menuData = response.data;
                const items = convertToMenuItems(menuData);
                setMenuItems(items);
                console.log(items);
            } catch (error) {
                console.error('Error fetching menu data:', error);
            }

        };

        fetchMenuData();
    }, []); // Fetch menu data on component mount

    // Helper function to convert JSON data to MenuItem array
    const convertToMenuItems = (data: any[]): MenuItem[] => {
        return data.map(item => {
            let childrenItems = item.children && item.children.length > 0 ? convertToMenuItems(item.children) : null;

            if (item.name && item.uri) {
                return getItem(<Link to={item.uri}>{item.name}</Link>, item.uri, null, childrenItems);
            } else {
                // 如果有一个为空，可以选择返回一个不带链接的字符串，或者根据需要进行其他处理
                return getItem(item.name, item.uri, null, childrenItems);
            }
        });
    };
    return (
        <div style={{ width: 200}}>
            {/*<Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>*/}
            {/*    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}*/}
            {/*</Button>*/}

            <Sider
                style={{ overflow: 'auto' ,height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }}
            >
                <div className="demo-logo-vertical" />
                <Menu
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                    theme="dark"
                    style={{height:'100vh'}}
                    inlineCollapsed={collapsed}
                    items={menuItems}
                />
            </Sider>
        </div>
    );
};

export default MenuBar;