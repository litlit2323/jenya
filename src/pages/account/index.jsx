import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import ListGroup from "react-bootstrap/ListGroup"
import Spinner from "react-bootstrap/Spinner"
import Button from "react-bootstrap/Button"

import axios from "@utils/axios"

import BootstrapTable from 'react-bootstrap-table-next'


import MainWrapper from "@components/MainWrapper"
import {useCallback, useEffect, useState} from "react"

import filterFactory from "react-bootstrap-table2-filter"
import paginationFactory from "react-bootstrap-table2-paginator"
import overlayFactory from 'react-bootstrap-table2-overlay'

import tableDateFormatter from "@utils/tableDateFormatter"
import {useRouter} from "next/router"


import Link from "next/link"
import {redirectIfNotAuth} from "@utils/privateRedirects";



const columns = [{
    dataField: 'title',
    text: 'Тема',
}, {
    dataField: 'createdAt',
    text: 'Дата заказа',
    formatter: tableDateFormatter
}, {
    dataField: 'status.title',
    text: 'Статус'
}, {
    dataField: 'price',
    text: 'Цена'
}
]

const NoDataIndication = () => {
    return (
        <p>Ваш список заказов до сих пор. Вы можете сделать его <Link href={"/ordersForm"}><a>здесь</a></Link>.</p>
    )
}


const Account = ({user}) => {
    const [page, setPage] = useState(1)
    const [userAccount, setUserAccount] = useState()
    const [sizePerPage, setSizePerPage] = useState(10)
    const [orders, setOrders] = useState([])
    const [totalSize, setTotalSize] = useState()
    const [error, setError] = useState(null)
    const router = useRouter()

    const [node, setNode] = useState()

    async function handleTableChange(type, {page, sizePerPage}) {
        setPage(parseInt(page))
        setSizePerPage(parseInt(sizePerPage))
    }

    async function fetchData() {
        axios.get("/api/user/orders", {
            params: {
                pageNumber: page,
                pagination: sizePerPage,
            },
            withCredentials: true,
        })
            .then(res => {
                setOrders(res.data.success.payload.orders)
                setTotalSize(res.data.success.payload.totalSize)
            })
            .catch(error => {
                if (error.response) {
                    console.error(error.response.data)
                }
            })
    }

    async function fetchUser() {
        axios.get("/api/user/account").then(res => {
            setUserAccount(res.data.success.payload.user)
        }).catch(err =>{
            console.log(err.response.data)
        })
    }

    const removeHandler = () => {
        const removeConfirm = confirm("Вы уверены, что хотите отказаться от указанных заказов?")

        if (removeConfirm && node.selectionContext.selected) {
            axios.post('/api/user/orders/deleteOrders', {recordsToDelete: node.selectionContext.selected}, {withCredentials: true})
            setOrders(orders => {
                return orders.filter(order => !node.selectionContext.selected.includes(order._id))
            })
        }
    }

    const rowEvents = {
        onClick: (e, row, rowIndex) => {
            router.push({pathname: `/account/orders/${row._id}`, query: {id: row._id}})
        },
    }

    useEffect(() => {
        fetchUser()
    }, [])

    useEffect(() => {
        fetchData()
    }, [page, sizePerPage])


    if (!user || user.isLoggedIn === false) {
        return <MainWrapper>loading...</MainWrapper>
    }


    return (
        <MainWrapper>
            <Container className={"p-4"} fluid>
                <Row>
                    <Col md={4}>
                        <Container fluid>
                            <Card>
                                <Card.Header
                                    as={"h1"}>{userAccount?.secondName} {userAccount?.firstName} {userAccount?.patronymicName}</Card.Header>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>E-mail: {userAccount?.email}</ListGroup.Item>
                                    <ListGroup.Item>Телефон: {userAccount?.phoneNumber}</ListGroup.Item>
                                    <ListGroup.Item className={"d-flex flex-column"}>
                                        <h4>Хотите поменять пароль?</h4>
                                        <Link href={"/password-reset"}>
                                            <a> Вы можете сделать это здесь.</a>
                                        </Link>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Container>
                    </Col>
                    <Col md={8}>
                        <Container fluid>
                            <Card>
                                <Card.Header as={"h3"}>Ваши заказы</Card.Header>
                                <Row className={"justify-content-end pt-3 px-3"}>
                                    <Col sm={4}>
                                        <Button onClick={removeHandler}>Отказаться от выделенных заказов</Button>
                                    </Col>
                                </Row>

                                <div className="pb-3 px-3">
                                    <BootstrapTable
                                        remote
                                        keyField='_id'
                                        bodyClasses={'defis'}
                                        data={orders}
                                        columns={columns}
                                        ref={n => setNode(n)}
                                        selectRow={
                                            {
                                                mode: 'checkbox',
                                            }
                                        }
                                        rowEvents={rowEvents}
                                        overlay={overlayFactory({
                                            spinner: true,
                                            styles: {
                                                overlay: (base) => ({
                                                    ...base,
                                                    background: 'rgba(206,206,206,0.5)'
                                                })
                                            }
                                        })}
                                        filter={filterFactory()}
                                        pagination={paginationFactory({page, sizePerPage, ...orders})}
                                        onTableChange={handleTableChange}
                                        noDataIndication={() => <NoDataIndication/>}
                                    />
                                </div>
                            </Card>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </MainWrapper>
    )
}

//Обеспечивает приватность
export const getServerSideProps = async (ctx) => redirectIfNotAuth(ctx)


export default Account