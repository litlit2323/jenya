import axios from "@utils/axios"

import {useForm} from "react-hook-form"
import React, {useState} from "react"

import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import {useRouter} from "next/router";


const PasswordReset = () => {
    const {register, handleSubmit} = useForm()
    const [commonSuccessMessage, setCommonSuccessMessage] = useState()
    const [commonErrorMessage, setCommonErrorMessage] = useState()
    const router = useRouter()

    const onSubmit = (data) => {
        axios.post("/api/password-reset", {...data}).then(res => {
            setCommonSuccessMessage(res.data.success.message)
        }).catch(error => {
            setCommonErrorMessage(error.response.data.errors[0].message)
            setTimeout(() => setCommonErrorMessage(null), 3000)
        })
    }

    return (
        <div>
            {commonSuccessMessage && commonSuccessMessage}
            {commonErrorMessage && commonErrorMessage}
            <Row className={"justify-content-center align-items-center"} style={{height:"70vh"}}>
                <Col sm={7} md={6} lg={4}>
                    <Card className={"p-3 pt-5 pb-5 shadow"}>
                        <h1 style={{textAlign: "center", paddingBottom: "2rem"}}>Сброс пароля</h1>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className={"mb-3"}>
                                <FormControl
                                    aria-label="email"
                                    name="email"
                                    placeholder={"Почта"}
                                    ref={register({required: "Введите почту для сброса пароля."})}
                                />
                            </div>
                            <div style={{textAlign: "end"}}>
                                <Button onClick={() => router.back()}>Назад</Button>
                                <Button type="submit" className={"ml-2"}>Сбросить пароль</Button>
                            </div>
                        </form>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default PasswordReset