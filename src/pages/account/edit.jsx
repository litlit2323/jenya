import React, {useEffect, useState} from 'react'

import FormControl from "react-bootstrap/FormControl"
import {useForm} from "react-hook-form"
import {ErrorMessage} from "@hookform/error-message"
import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button"
import axios from "@utils/axios";
import useUser from "@utils/useUser";
import {useRouter} from "next/router";
import MainWrapper from "@components/MainWrapper"
import {redirectIfNotAuth} from "@utils/privateRedirects";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";


const removeEqualsObjectFields = (newObj, oldObj) => {
    const newObjCopy = Object.assign({}, newObj)
    for (let key in newObjCopy) {
        oldObj[key] === newObjCopy[key] && delete newObjCopy[key]
    }
    return newObjCopy
}

const EditAccount = () => {
    const [accountData, setAccountData] = useState()
    const [commonSuccessMessage, setCommonSuccessMessage] = useState()
    const [commonErrorMessage, setCommonErrorMessage] = useState()


    useUser({redirectTo: "/signin"})
    const router = useRouter()


    const {register, handleSubmit, errors, setError, reset} = useForm()
    useEffect(() => {
        axios.get("/api/user/account", {withCredentials: true}).then(res => {
            setAccountData({...res.data.success.payload.user})
            reset({...res.data.success.payload.user})
        })
    }, [])


    const onSubmit = (data, e) => {
        setCommonErrorMessage(null)
        setCommonSuccessMessage(null)

        const filteredData = removeEqualsObjectFields(data, accountData)

        axios.post("/api/user/account", {...filteredData}, {withCredentials: true})
            .then((res) => {
                setCommonSuccessMessage(res.data.success.message)
                router.push("/account")
            })
            .catch(err => {
                if (err.response.data.errors[0].name !== "common") {
                    err.response.data.errors.map(error => setError(error.name, {
                        message: error.message,
                        type: "server"
                    }))
                } else {
                    setCommonErrorMessage(err.response.data.errors[0].message)
                }
            })
    }

    return (
        <MainWrapper>
            <Row className={"justify-content-center align-items-center mt-3"}>
                <Col sm={8} md={7} lg={5}>
                    <Card className={"p-3 pt-5 pb-5 shadow"}>
                        <h1 style={{textAlign: "center", paddingBottom: "2rem"}}>Изменить данные</h1>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Container fluid className={"pb-4"}>
                                {commonSuccessMessage && commonSuccessMessage}
                                {commonErrorMessage && commonErrorMessage}
                                <ErrorMessage errors={errors} name={"secondName"}/>
                                <div className={"pb-3"}>
                                    <b>Фамилия</b>
                                    <FormControl as="input" aria-label="Фамилия"
                                                 name={"secondName"}
                                                 placeholder={"Фамилия"}
                                                 ref={register({required: "Введите вашу фамилию."})}

                                    />
                                </div>

                                <ErrorMessage errors={errors} name={"firstName"}/>
                                <div className={"pb-3"}>
                                    <b>Имя</b>
                                    <FormControl as="input" aria-label="Имя"
                                                 name={"firstName"}
                                                 placeholder={"Имя"}
                                                 ref={register({required: "Введите ваше имя."})}/>
                                </div>

                                <ErrorMessage errors={errors} name={"patronymicName"}/>
                                <div className={"pb-5"}>
                                    <b>Отчество</b>
                                    <FormControl as="input" aria-label="Отчество"
                                                 name={"patronymicName"}
                                                 placeholder={"Отчество"}
                                                 ref={register({required: "Введите ваше отчество."})}/>
                                </div>

                                <ErrorMessage errors={errors} name={"phoneNumber"}/>
                                <div className={"pb-3"}>
                                    <b>Телефонный номер</b>
                                    <FormControl as="input" aria-label="Телефон"
                                                 name={"phoneNumber"}
                                                 placeholder={"Телефонный номер"}
                                                 ref={register({required: "Введите ваш сотовый телефон (это необходимо, чтобы связаться с вами)."})}/>
                                </div>

                                <ErrorMessage errors={errors} name={"email"}/>
                                <div className={"pb-5"}>
                                    <b>Email</b>
                                    <FormControl as="input" aria-label="Почта"
                                                 name={"email"}
                                                 placeholder={"Email"}
                                                 ref={register({required: "Введите вашу почту (это необходимо, чтобы связаться с вами)."})}/>
                                </div>
                                <div style={{textAlign: "end"}}>
                                    <Button onClick={router.back} >Назад</Button>
                                    <Button type={"submit"} className={"ml-3"}>Изменить данные</Button>

                                </div>

                            </Container>
                        </form>
                    </Card>
                </Col>
            </Row>
        </MainWrapper>

    )
}

//Обеспечивает приватность
export const getServerSideProps = async (ctx) => redirectIfNotAuth(ctx)

export default EditAccount