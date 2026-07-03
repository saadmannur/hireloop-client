import LeftSideBar from "@/components/dashboard/LeftSideBar";


const DashboardLayout = ({children}) => {
    return (
        <div className=" flex min-h-screen container mx-auto">
            <LeftSideBar></LeftSideBar>
            <div className="flex-1">{children}</div>
        </div>
    );
};

export default DashboardLayout;