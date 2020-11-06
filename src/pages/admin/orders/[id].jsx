import React, {useEffect, useState} from 'react'
import {useRouter} from "next/router"

import axios from "@utils/axios"


import {useForm} from "react-hook-form"
import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button"
import FormControl from "react-bootstrap/FormControl"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import {ErrorMessage} from "@hookform/error-message"
import Card from "react-bootstrap/Card"
import ListGroup from "react-bootstrap/ListGroup"
import {redirectIfNotAdmin} from "@utils/privateRedirects";

const UserOrder = () => {
    const router = useRouter()

    const [order, setOrder] = useState()
    const [currentOrderStatus, setCurrentOrderStatus] = useState()
    const [orderStatuses, setOrderStatuses] = useState([])
    const [commonSuccessMessage, setCommonSuccessMessage] = useState()
    const [commonErrorMessage, setCommonErrorMessage] = useState()
    const {register, handleSubmit, errors, reset} = useForm()

    useEffect(() => {
        if (router.query.id) {
            axios.get(`/api/admin/orders/${router.query.id}`, {withCredentials: true}).then((res) => {

                reset(res.data.success.payload.order)
                setCurrentOrderStatus(res.data.success.payload.order.status._id)
                setOrder(res.data.success.payload.order)
            }).catch(err => console.log(err))
            axios.get(`/api/admin/orders/statuses`, {withCredentials: true}).then((res) => {
                setOrderStatuses(res.data.success.payload.ordresStatuses)
            }).catch(err => console.log(err))
        }

    }, [router])


    const onSubmit = (data, e) => {
        axios.put(`/api/admin/orders/${order._id}`, {...data}, {withCredentials: true})
            .then((res) => setCommonSuccessMessage(res.data.success.message))
            .catch(err => {
                const error = err.response.data.errors[0].message
                setCommonErrorMessage(error)
            })
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Container fluid className={"pb-4"}>
                    <Container fluid className={"pb-4"}>
                        {commonSuccessMessage && commonSuccessMessage}
                        {commonErrorMessage && commonErrorMessage}
                        <h2 className={"pb-3"}>О заказе</h2>
                        <h4>Статус: {order?.status.title}</h4>
                        <h3 className={"pt-2"}>Тема заказа</h3>
                        <ErrorMessage errors={errors} name={"title"}/>
                        <FormControl as="input" aria-label="Тема заказа"
                                     name={"title"}
                                     placeholder={"Тема заказа"}
                                     ref={register({required: "Тема заказа не может быть пустой."})}
                        />

                        <Row>
                            <Col sm={6}>
                                <h3 className={"pt-2"}>Статус заказа</h3>
                                <ErrorMessage errors={errors} name={"status"}/>
                                <FormControl as="select" aria-label="Описание заказа"
                                             name={"status"}
                                             placeholder={"Статус заказа"}
                                             ref={register({required: "Статус заказа не может быть пустым."})}
                                             onChange={(e) => setCurrentOrderStatus(e.target.value)}
                                             value={currentOrderStatus}
                                >
                                    {orderStatuses.map(orderStatus => {
                                        return <option key={orderStatus._id}
                                                       value={orderStatus._id}
                                        >
                                            {orderStatus.title}
                                        </option>
                                    })}
                                </FormControl>
                            </Col>
                            <Col sm={6}>
                                <h3 className={"pt-2"}>Цена</h3>
                                <ErrorMessage errors={errors} name={"price"}/>
                                <FormControl as="input" aria-label="Цена"
                                             name={"price"}
                                             placeholder={"Цена"}
                                             ref={register}
                                />
                            </Col>
                        </Row>


                        <h3 className={"pt-2"}>Описание заказа</h3>
                        <ErrorMessage errors={errors} name={"description"}/>
                        <FormControl as="textarea" aria-label="Описание заказа"
                                     style={{minHeight: '200px'}}
                                     name={"description"}
                                     placeholder={"Описание заказа"}
                                     ref={register({required: "Описание заказа не может быть пустым."})}
                        />

                    </Container>
                    {order &&
                    <Container fluid>
                        <Card >
                            <Card.Header><h2>О заказчике</h2></Card.Header>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    ФИО: {order.user.secondName} {order.user.firstName} {order.user.patronymicName}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Email: {order.user.email}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Телефон: {order.user.phoneNumber}
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                        <Row className={"justify-content-end"}>
                            <Col xs={12} md={5} lg={4} style={{textAlign:"end"}}>

                                <Button onClick={router.back}>Назад</Button>
                                <Button className={"ml-sm-3"}  type={"submit"}>Изменить данные</Button>
                            </Col>
                        </Row>
                    </Container>
                    }


                </Container>

            </form>
        </>
    )
}

//Обеспечивает приватность администраторской панели
export const getServerSideProps = async (ctx) => redirectIfNotAdmin(ctx)

export default UserOrder

