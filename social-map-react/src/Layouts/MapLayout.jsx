import { Outlet } from "react-router-dom"
import MapHeader from "@components/layout/MapHeader"

export default function MainLayout() {

    return (
        <>
            <MapHeader />
            <main>
                <Outlet />
            </main>
        </>
    )
}
