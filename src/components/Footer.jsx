import React from 'react'
import Container from "react-bootstrap/Container"
import Card from "react-bootstrap/Card"
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Footer = () => {
    return (
        // <footer>
        <Card className={"footer shadow justify-content-around"}>
            <Row className={"d-flex"}>
                <Col sm={6} className={"text-center p-3"}>
                    624130
                    <br/>
                    Свердловская область, г. Новоуральск, ул. Фрунзе 7 - офис 204
                </Col>
                <Col sm={6} className={"text-center p-3"}>
                    8(34370) 7-87-87
                    <br/>
                    whatsapp: +7(965)547-66-13
                    <br/>
                    avista-1c@yandex.ru
                </Col>
            </Row>
        </Card>
            // </footer>
    )
}

export default Footer