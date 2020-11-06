
//Нормально работает только в save функции
const dbErrorCompile = (err, res) => {
    const requestErrors = []
    const uniqueContstraintFieldsMessages = {
        email: {
            name: "email",
            message: "Введённая почта уже существует, пожалуйста, попробуйте указать другую."
        },
        phoneNumber: {
            name: "phoneNumber",
            message: "Введённый телефон уже существует, пожалуйста, введите другой."
        }
    }

    const errorsKeys = Object.keys(err.errors)
    for (let i = 0; i < errorsKeys.length; i++) {
        if (err.errors[errorsKeys[i]].kind === "unique") {
            requestErrors.push(uniqueContstraintFieldsMessages[errorsKeys[i]])
        } else {
            requestErrors.push({
                name: errorsKeys[i],
                message: err.errors[errorsKeys[i]].message
            })
        }
    }
    return res.status(400).send({errors: requestErrors})
}

export default dbErrorCompile

