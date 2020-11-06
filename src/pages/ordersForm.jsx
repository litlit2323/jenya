import Container from "react-bootstrap/Container"
import FormGroup from "react-bootstrap/FormGroup"
import Card from "react-bootstrap/Card"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import FormControl from "react-bootstrap/FormControl"
import InputGroup from "react-bootstrap/InputGroup"


import MainWrapper from "@components/MainWrapper"
import axios from "@utils/axios"
import {useForm} from "react-hook-form"
import { ErrorMessage } from '@hookform/error-message'

import {useRouter} from "next/router"
import {useState} from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";


const OrdersForm = ({cookie}) => {

    const router = useRouter()
    const [commonSuccessMessage, setCommonSuccessMessage] = useState()
    const [commonErrorMessage, setCommonErrorMessage] = useState()
    const {register, handleSubmit, setError, errors} = useForm()


    const onSubmit = (data, e) => {
        let requestState = {
            ...data,
        }
        setCommonErrorMessage(null)
        setCommonSuccessMessage(null)
        axios.post("/api/user/orders/create", {...data}, {withCredentials: true})
            .then((res) => {
                e.target.reset()
                setCommonSuccessMessage(res.data.success.message)
            })
            .catch(err => {
                const error = err.response.data.errors[0].message
                setCommonErrorMessage(error)
            })
    }


    return <MainWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Container className={"pt-5"}>
                <h1 className={"pb-3"}>Сделать заказ</h1>
                {commonErrorMessage && commonErrorMessage}
                {commonSuccessMessage && commonSuccessMessage}
                <Card className={"p-3 pb-5"}>
                    <FormGroup className={'row g-3'}>
                        {!cookie &&
                        <Container fluid className={"pb-4"}>
                            <h3 className={"pb-3"}>Кто вы?</h3>

                            <ErrorMessage errors={errors} name={"user.secondName"}/>
                            <div className={"pb-3"}>
                                <FormControl as="input" aria-label="Фамилия"
                                             name={"user.secondName"}
                                             placeholder={"Фамилия"}
                                             ref={register({required: "Введите вашу фамилию"})}/>
                            </div>

                            <ErrorMessage errors={errors} name={"user.firstName"}/>
                            <div className={"pb-3"}>
                                <FormControl as="input" aria-label="Имя"
                                             name={"user.firstName"}
                                             placeholder={"Имя"}
                                             ref={register({required: "Введите ваше имя."})}/>
                            </div>

                            <ErrorMessage errors={errors} name={"user.patronymicName"}/>
                            <div className={"pb-5"}>
                                <FormControl as="input" aria-label="Отчество"
                                             placeholder={"Отчество"}
                                             name={"user.patronymicName"}
                                             ref={register({required: "Введите ваше отчество."})}/>
                            </div>


                            <h3 className={"pb-3"}>Контактные данные</h3>
                            <ErrorMessage errors={errors} name={"user.phoneNumber"}/>
                            <div className={"pb-3"}>
                                <FormControl as="input" aria-label="Телефон"
                                             name={"user.phoneNumber"}
                                             placeholder={"Телефон"}
                                             ref={register({required: "Введите ваш сотовый телефон (это необходимо, чтобы связаться с вами)."})}/>
                            </div>

                            <ErrorMessage errors={errors} name={"user.email"}/>
                            <div className={"pb-3"}>
                                <FormControl as="input" aria-label="Почта"
                                             name={"user.email"}
                                             placeholder={"Email"}
                                             ref={register({required: "Введите вашу почту (это необходимо, чтобы связаться с вами)."})}/>
                            </div>
                        </Container>
                        }

                        <Container fluid className={"pb-4"}>
                            <h3 className={"pb-2"}>Ваш заказ:</h3>

                            <ErrorMessage errors={errors} name={"title"}/>
                            <div className={"pb-3"}>
                                <FormControl as="input" aria-label="Тема заказа"
                                             name={"title"}
                                             placeholder={"Тема заказа"}
                                             ref={register({required: "Введите тему заказа"})}/>
                            </div>

                            <ErrorMessage errors={errors} name={"description"}/>
                            <div>
                                <FormControl as="textarea" aria-label="Описание заказа"
                                             name={"description"}
                                             placeholder={"Описание"}
                                             ref={register({required: "Опишите ваш заказ."})}/>
                            </div>
                        </Container>
                        <Container fluid>
                            <Row className="justify-content-md-end text-xs-center text-md-end">


                                <Col xs={12} md={4} className={"text-sm-center "}>

                                    <ButtonGroup aria-label="order-actions">
                                        {cookie &&
                                        <Button onClick={() => router.back()} className={"w-100"}>
                                            Назад
                                        </Button>
                                        }
                                        <Button type="submit" className={"w-100 ml-md-3"}>Оформить заказ</Button>
                                    </ButtonGroup>
                                </Col>
                            </Row>
                        </Container>

                    </FormGroup>
                </Card>
            </Container>
        </form>

    </MainWrapper>
}

export async function getServerSideProps(ctx) {
    if (ctx.req) {
        axios.defaults.headers.get.Cookie = ctx.req.headers.cookie
    }
    const {cookie} = ctx.req.headers

    return {
        props: {
            cookie: cookie || ''
        }
    }
}

export default OrdersForm