import Button from "react-bootstrap/Button"
import BootstrapTable from 'react-bootstrap-table-next'
import cellEditFactory, {Type} from 'react-bootstrap-table2-editor'
import filterFactory, {textFilter} from 'react-bootstrap-table2-filter'
import paginationFactory from 'react-bootstrap-table2-paginator'
import axios from "@utils/axios"
import {useEffect, useState} from "react"

import {useRouter, withRouter} from "next/router"
import AdminPanelWrapper from "@components/admin/AdminPanelWrapper"
import {redirectIfNotAdmin} from "@utils/privateRedirects"
import Row from "react-bootstrap/Row"
import FormControl from "react-bootstrap/FormControl"
import Col from "react-bootstrap/Col"


// const rowEvents = {
//     onClick: (e, row, rowIndex) => {
//         router.push({pathname: `/account/orders/${row._id}`, query: {id: row._id}})
//     },
// }



const NoDataIndication = () => {
    return (
        <span>Заказов пока нет.</span>
    )
}


const AdminOrders = () => {

    const router = useRouter()

    const [page, setPage] = useState(1)
    const [sizePerPage, setSizePerPage] = useState(10)


    const [orders, setOrders] = useState([])
    const [totalSize, setTotalSize] = useState()
    const [error, setError] = useState(null)
    const [node, setNode] = useState()
    const [searchQuery, setSearchQuery] = useState()


    const onColumnClick = (e, column, columnIndex, row, rowIndex) => {
        console.log(row)
        router.push({pathname: `/admin/orders/${row._id}`, query: {id: row._id}})
    }

    const columns = [
        {
            dataField: '_id',
            text: 'ID заказа',
            onClick: onColumnClick,
            editable: false,
            events:{
                onClick:onColumnClick
            }
        },
        {
            dataField: 'title',
            text: 'Тема заказа',
            editable: false,
            events:{
                onClick:onColumnClick
            }
        },
        {
            dataField: 'status.title',
            text: 'Статус',
            editor: {
                type: Type.SELECT,
                getOptions: (setOptions) => {
                    axios.get(`/api/admin/orders/statuses`, {withCredentials: true}).then((res) => {
                        const optionsToSet = res.data.success.payload.ordresStatuses.map(option => {
                            return {value: option._id, label: option.title}
                        })
                        setOptions(optionsToSet)
                    }).catch(err => console.log(err))

                }
            }
        },
        {
            dataField: 'price',
            text: 'Оплата'
        },
        {
            dataField: 'user.fullName',
            text: 'Заказчик',
            editable: false,
            events:{
                onClick:onColumnClick
            }
        },
    ]

    async function handleTableChange(type, {page, sizePerPage, cellEdit}) {
        if (cellEdit) {
            axios.put(`/api/admin/orders/${cellEdit.rowId}`, {
                    //Некоторые поля имеют иерархическое название типа: status.title это нам не подходит, поэтому мы разбиваем строку по точке,
                    // потому что нам необходима только первая часть (status)
                    [cellEdit.dataField.split(".")[0]]: cellEdit.newValue,
                },
                {withCredentials: true},
            )
                .then(res => {

                    const responseOrder = res.data.success.payload.order
                    const resultOrder = {
                        ...responseOrder,
                        user: {
                            ...responseOrder,
                            fullName: `${responseOrder.user.secondName} ${responseOrder.user.firstName} ${responseOrder.user.patronymicName}`
                        }
                    }
                    setError(null)
                    setOrders(orders => orders.map(order => order._id === resultOrder._id ? resultOrder : order))
                })
                .catch(function (error) {
                    if (Array.isArray(error.response.data.errors[0].message)) {
                        setError(error.response.data.errors[0].message[0])
                        setTimeout(() => setError(null), 2500)
                    } else {
                        setError(error.response.data.errors[0].message)
                        setTimeout(() => setError(null), 2500)
                    }

                })
        }

        setPage(parseInt(page))
        setSizePerPage(parseInt(sizePerPage))
    }

    async function fetchData(value) {
        axios.get("/api/admin/orders", {
            params: {
                pageNumber: page,
                pagination: sizePerPage,
                search: value
            },
            withCredentials: true,
        })
            .then(res => {
                const orders = res.data.success.payload.orders.map(order => {
                    return {
                        ...order,
                        user: {
                            ...order.user,
                            fullName: `${order.user.secondName} ${order.user.firstName} ${order.user.patronymicName}`
                        }
                    }
                })
                setOrders(orders)
                setTotalSize(res.data.success.payload.totalSize)
            })
            .catch(error => {
                console.log(error.response.data)
            })

    }

    useEffect(() => {
        fetchData()
    }, [page, sizePerPage])

    const removeHandler = () => {
        axios.post('/api/admin/orders/deleteOrders', {recordsToDelete: node.selectionContext.selected}, {withCredentials: true}).catch(error => {
            console.log(error.response.data)
        })
        setOrders(orders => {
            return orders.filter(order => !node.selectionContext.selected.includes(order._id))
        })
    }


    const onTypingSearch = (value) => {
        setSearchQuery(query => clearTimeout(query))
        setSearchQuery(setTimeout(() => fetchData(value), 1500))
    }


    return (
        <AdminPanelWrapper>
            <Row>
                <Col sm={12} md={8} className={"p-5"}>
                    <FormControl placeholder={"Поиск"} onChange={e => onTypingSearch(e.target.value)}/>
                </Col>
            </Row>
            <Button variant="danger" onClick={removeHandler}>Danger</Button>
            <BootstrapTable
                remote
                ref={n => setNode(n)}
                keyField='_id'
                bodyClasses={'defis'}
                data={orders}
                columns={columns}
                cellEdit={cellEditFactory({mode: 'click', autoSelectText: true, blurToSave: true, errorMessage: error})}
                filter={filterFactory()}
                pagination={paginationFactory({page, sizePerPage, totalSize})}
                onTableChange={handleTableChange}
                noDataIndication={() => <NoDataIndication/>}
                selectRow={
                    {
                        mode: 'checkbox',
                    }
                }
            />
        </AdminPanelWrapper>
    )
}

//Обеспечивает приватность администраторской панели
export const getServerSideProps = async (ctx) => redirectIfNotAdmin(ctx)

export default AdminOrders
