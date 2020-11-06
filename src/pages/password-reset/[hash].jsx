import React, {useEffect, useState} from 'react'
import {useRouter} from "next/router"

import InputGroup from "react-bootstrap/InputGroup"
import FormControl from "react-bootstrap/FormControl"

import {useForm} from "react-hook-form"

import axios from "@utils/axios"
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";


const PasswordResetHash = () => {
    const router = useRouter()
    const {register, handleSubmit, watch, errors} = useForm()
    const [commonSuccessMessage, setCommonSuccessMessage] = useState()
    const [commonErrorMessage, setCommonErrorMessage] = useState()
    const newPassword = watch("newPassword")


    const onSubmit = (data, e) => {
        axios.post("/api/password-reset/confirmation", {
            ...data,
            hash: router.query.hash
        }).then(res => {
            setCommonSuccessMessage(res.data.success.message)
            router.push("/signin")
        }).catch(error => {
            setCommonErrorMessage(error.response.data.errors[0].message)
            setCommonErrorMessage(null)
        })
    }

    const newErrors = {
        newPassword: {
            required: "Введите новый пароль.",
            minLength: "Пароль слишком короткий.",
            pattern: "Слишком простой пароль (пароль должен содержать цифры, а также латинские буквы верхнего и нижнего регистра)."
        },
        newPasswordConfirm: {
            required: "Подтвердите новый пароль.",
            validate: "Пароли должны совпадать."
        }
    }

    return (
        <Row className={"justify-content-center align-items-center"} style={{height:"70vh"}}>
            <Col sm={7} md={6} lg={4} >
                <Card className={"p-3 pt-5 pb-5 shadow"}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h1  style={{textAlign: "center", paddingBottom:"2rem"}}>Новый пароль</h1>
                    {commonSuccessMessage && commonSuccessMessage}
                    {commonErrorMessage && commonErrorMessage}
                    {newErrors.newPassword[errors.newPassword?.type] && newErrors.newPassword[errors.newPassword?.type]}
                    <InputGroup className="mb-3">
                        <FormControl
                            as={"input"}
                            aria-label="newPassword"
                            name="newPassword"
                            style={{textAlign: "center"}}
                            placeholder={"Новый пароль"}
                            ref={register(
                                {
                                    required: true,
                                    minLength: 5,
                                    pattern: /.*([a-z]+[A-Z]+[0-9]+|[a-z]+[0-9]+[A-Z]+|[A-Z]+[a-z]+[0-9]+|[A-Z]+[0-9]+[a-z]+|[0-9]+[a-z]+[A-Z]+|[0-9]+[A-Z]+[a-z]+).*/
                                }
                            )}
                        />
                    </InputGroup>

                    {newErrors.newPasswordConfirm[errors.newPasswordConfirm?.type] && newErrors.newPasswordConfirm[errors.newPasswordConfirm?.type]}
                    <div className="d-flex mb-3 justify-items-center">
                        <FormControl
                            as={"input"}
                            placeholder={"Подтверждение"}
                            style={{textAlign: "center"}}
                            ref={register(
                                {
                                    required: true,
                                    validate: (value) => {
                                        return value === newPassword
                                    }
                                }
                            )}
                            aria-label="newPasswordConfirm"
                            name="newPasswordConfirm"
                        />
                    </div>
                    <div style={{textAlign:"center"}}>
                        <Button type="submit">Установить новый пароль</Button>
                    </div>
                </form>
                </Card>
            </Col>
        </Row>

    )
}

export default PasswordResetHash