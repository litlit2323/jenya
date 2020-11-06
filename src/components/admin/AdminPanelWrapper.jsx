import React from 'react'
import useAdmin from "@utils/useAdmin"
import Nav from "react-bootstrap/Nav"
import {useRouter} from "next/router"
import axios from "@utils/axios";

import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container";

const AdminPanelWrapper = ({children}) => {
    const {isAdmin} = useAdmin({redirectTo: '/signin'})
    const router = useRouter()
    if (!isAdmin || typeof isAdmin === "undefined") {
        return <div>
            <h1>У вас нет прав, чтобы продолжить.</h1>
        </div>
    }

    return (
        <div>
            <Row>
                <Col sm={12} md={2} >
                    <div className={"admin-nav"} >
                        <Nav defaultActiveKey="/home" className="d-flex flex-column" fill>
                            <Nav.Link onClick={()=>router.push("/admin")}>Стартовая</Nav.Link>
                            <Nav.Link onClick={()=>router.push("/admin/orders")}>Заказы</Nav.Link>
                            <Nav.Link onClick={()=>router.push("/")}>На сайт</Nav.Link>
                            <Nav.Link eventKey="accountLogout" onClick={() => {
                                axios.post("/api/logout", {}, {withCredentials: true}).then(() => {
                                    router.push("/")
                                })
                            }}>Выйти</Nav.Link>
                        </Nav>
                    </div>

                </Col>
                <Col sm={12} md={10}>
                    <Container>
                        {children}
                    </Container>
                </Col>
            </Row>

        </div>
    )
}

export default AdminPanelWrapper