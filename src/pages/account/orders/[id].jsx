import React, {useEffect, useLayoutEffect, useState} from 'react'
import {useRouter} from "next/router"
import axios from "@utils/axios"
import {redirectIfNotAuth} from "@utils/privateRedirects";
import MainWrapper from "@components/MainWrapper";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

const UserOrder = () => {
    const router = useRouter()
    const [order, setOrder] = useState()

    useEffect(() => {
        if(router.query.id){
            axios.get(`/api/user/orders/${router.query.id}`, {withCredentials:true}).then((res) => {
                setOrder(res.data.success.payload.order)
            }).catch(err => console.log(err))
        }

    }, [router])
    return(
        <MainWrapper>
            {order &&
            <Row className={"justify-content-center align-items-center p-3"}>
                <Col sm={10} md={9}>
                    <Card className={"p-3 pt-5 pb-5 shadow"}>
                        <h2 ><b>Ваш заказ № {order._id}</b></h2>
                        <hr className={"py-1"}/>
                        <div className={"pb-2"}>
                            <h4><b>Статус:</b> {order.status}</h4>
                        </div>
                        <hr className={"py-2"}/>



                        <div className={"pb-2"}>
                            <h3>Тема заказа</h3>
                            <p>{order.title}</p>
                        </div>
                        <div className={"pb-2"}>
                            <h3>Описание</h3>
                            <p>{order.description}</p>
                        </div>
                        <div style={{textAlign: "end"}}>
                            <Button onClick={() => router.back()}>Назад</Button>
                        </div>
                    </Card>
                </Col>
            </Row>
            }


            <pre>{order ? JSON.stringify(order, null, 4) : "Заказ не найден."}</pre>
        </MainWrapper>

    )
}

//Обеспечивает приватность
export const getServerSideProps = async (ctx) => redirectIfNotAuth(ctx)

export default UserOrder

