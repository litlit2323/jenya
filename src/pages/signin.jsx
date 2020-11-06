import React, {useCallback, useState} from 'react'
import InputGroup from "react-bootstrap/InputGroup"
import FormControl from "react-bootstrap/FormControl"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"

import axios from "@utils/axios"
import {withRouter} from "next/router"
import {useForm} from "react-hook-form"
import {ErrorMessage} from "@hookform/error-message";
import Link from "next/link";
import useUser from "@utils/useUser";



const SignIn = ({router}) => {
    const {register, handleSubmit, errors, setError} = useForm()
    const [commonErrorMessage, setCommonErrorMessage] = useState()
    const [commonSuccessMessage, setCommonSuccessMessage] = useState()

    const onSubmit = (data) => {
        axios.post('/api/signin', {...data})
            .then(async (res) => {
                setCommonSuccessMessage(res.data.success.message)
                router.push("/account")
            })
            .catch((err) => {
                const errors = err.response.data.errors
                let message
                if (errors?.length) {
                    message = err?.response?.data?.errors[0].message
                } else {
                    message = err?.response?.data?.errors?.message
                }

                console.log(err.response.data.errors[0].message)
                message && setCommonErrorMessage(message)
                setCommonErrorMessage(message)
            })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Container fluid className={"pt-5"}>
                <Row className={"justify-content-center"}>
                    <Col sm={7} md={6} lg={4}>
                        <Container fluid>
                            <Card className={"p-3 pt-5 pb-5 shadow"}>
                                <div className={"pb-2"} style={{textAlign: "center"}}>
                                    <div className="logo"/>
                                </div>

                                <h2 className={"pb-5"} style={{textAlign: "center"}}>Авторизация</h2>
                                <div className={"pb-3"}>
                                    {commonErrorMessage && commonErrorMessage}
                                    {commonSuccessMessage && commonSuccessMessage}
                                    {errors.name && errors.name.type === "required" && <span>This is required</span>}
                                    <ErrorMessage errors={errors} name={"email"}/>
                                    <FormControl
                                        placeholder={"Email"}
                                        aria-label="email"
                                        aria-describedby="email"
                                        name="email"
                                        error={errors.email}
                                        ref={register({required: "Пожалуйста, укажите email."})}
                                    />
                                </div>
                                <div className={"pb-4"}>
                                    <ErrorMessage errors={errors} name={"password"}/>
                                    <FormControl
                                        aria-label="Password"
                                        aria-describedby="basic-addon1"
                                        name="password"
                                        type={"password"}
                                        placeholder={"Пароль"}
                                        ref={register({required: "Пожалуйста, укажите пароль."})}
                                    />
                                </div>
                                <div style={{textAlign: "center"}}>
                                    <Button type="submit">Войти</Button>
                                    <div className={"pt-3"}>
                                        <Link href={"/password-reset"}>
                                            <a>Забыли пароль?</a>
                                        </Link>
                                    </div>
                                </div>

                            </Card>
                            <Card className={"p-3 mt-2 shadow text-center"}>
                                <div className={"text-black-50"}>Нет аккаунта?</div>
                                <Link href={"/signup"}>
                                    <a>Зарегистрируйтесь.</a>
                                </Link>
                            </Card>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </form>
    )
}

export async function getServerSideProps(ctx) {
    const user = ctx.req?.session?.get("authToken")
    return {
        props: {
            user: user ? user : null
        }
    }
}

// export default SignIn
export default withRouter(SignIn)