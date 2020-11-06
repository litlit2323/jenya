import React from 'react'
import AdminPanelWrapper from "@components/admin/AdminPanelWrapper"
import {redirectIfNotAdmin} from "@utils/privateRedirects"

const AdminIndex = () => {
    return (
        <AdminPanelWrapper>
            <h1>Вы находитесь в административной панели</h1>
        </AdminPanelWrapper>
    )
}

//Обеспечивает приватность администраторской панели
export const getServerSideProps = async (ctx) => redirectIfNotAdmin(ctx)

export default AdminIndex