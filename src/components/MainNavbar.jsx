import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import Container from "react-bootstrap/Container"
import Link from "next/link"


import NavDropdown from "react-bootstrap/NavDropdown"
import {useRouter} from "next/router";

import useUser from "@utils/useUser"
import axios from "@utils/axios"

import franchRed from "@images/franchise/1C_Red.svg"
import avista from "@images/avista.jpg"



const MainNavbar = () => {
    const {user} = useUser()

    const router = useRouter()
    return (
        <Navbar collapseOnSelect expand="md" style={{boxShadow: "0 0 5px #117382"}}>

            <Container className={""} fluid>
                <Link href={"/"}>
                    <a>
                        <Navbar.Brand className={"navbar-logo"}>
                            <div className={"d-flex align-items-center"}>
                                <img src={franchRed} alt={"1C franchise logo"} className="mr-2 navbar-logo__image"/>
                                <img src={avista} alt={"avista logo"} className="mr-2 navbar-logo__image"/>
                                Ависта 1C
                            </div>


                        </Navbar.Brand>
                    </a>
                </Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>

                <Navbar.Collapse id="responsive-navbar-nav " className="justify-content-end">
                    <Container>
                        <Nav className={"w-100 justify-content-md-end main-navbar"}>
                            <Link href={"/company"}>
                                <Nav.Link href={"/company"} className={"main-navbar__item"}>
                                    О компании
                                </Nav.Link>
                            </Link>
                            <Link href={"/service"}>
                                <Nav.Link href={"/service"} className={"main-navbar__item"}>
                                    Об услугах
                                </Nav.Link>
                            </Link>
                            <Link href={"/products"}>
                                <Nav.Link href={"/products"} className={"main-navbar__item "}>
                                    О товарах
                                </Nav.Link>
                            </Link>
                            <div className={"ml-md-5"}>
                                {
                                    user?.isLoggedIn ?
                                        <NavDropdown title="Аккаунт" id="account"
                                                     className={"justify-content-center"}>

                                            <NavDropdown.Item eventKey="account"
                                                              onClick={() => router.push("/account")}>
                                                <a>
                                                    Просмотр
                                                </a>
                                            </NavDropdown.Item>
                                            <NavDropdown.Item eventKey="accountEdit"
                                                              onClick={() => router.push("/account/edit")}>
                                                <a>
                                                    Редактирование
                                                </a>
                                            </NavDropdown.Item>
                                            <NavDropdown.Item eventKey="accountLogout" onClick={() => {
                                                axios.post("/api/logout", {}, {withCredentials: true}).then(() => {
                                                    router.push("/")
                                                })
                                            }

                                            }>
                                                <a>
                                                    Выйти
                                                </a>
                                            </NavDropdown.Item>
                                        </NavDropdown>
                                        :
                                        <Link href={"/signin"}>
                                            <Nav.Link href={"/signin"} className={"main-navbar__item "}>
                                                Войти
                                            </Nav.Link>
                                        </Link>
                                }
                            </div>


                        </Nav>
                    </Container>

                </Navbar.Collapse>


            </Container>
        </Navbar>
    )
}

export default MainNavbar

