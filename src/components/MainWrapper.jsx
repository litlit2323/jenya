import MainNavbar from "./MainNavbar"
import Footer from "@components/Footer";


const MainWrapper = ({children}) => {
    return (
        <div className={"d-flex flex-column justify-content-sm-between w-100"}>
            <MainNavbar/>
            {children}
            <div className={"clearfix"}/>
            <Footer/>
        </div>
    )
}

export default MainWrapper