
import { getUserSession } from "@/lib/core/session";
import { Bell, Envelope, Gear, House, Briefcase, Person } from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import Link from "next/link";
import { BiBriefcase, BiCreditCard } from "react-icons/bi";
import { BsCreditCard } from "react-icons/bs";
import { FaUserSecret } from "react-icons/fa";
import { FaBuildingShield, FaMagnifyingGlass } from "react-icons/fa6";
import { FiFileText } from "react-icons/fi";
import { IoBagCheck } from "react-icons/io5";
import { MdLibraryAdd } from "react-icons/md";
import { PiBookmarkSimple, PiSquaresFour, PiSquaresFourBold } from "react-icons/pi";
import { VscLayoutSidebarLeftDock } from "react-icons/vsc";

const LeftSideBar = async () => {

    const user = await getUserSession()

    const seekerNavItems = [
        { icon: PiSquaresFour, href: "/dashboard/seeker", label: "Dashboard" },
        { icon: FaMagnifyingGlass, href: "/dashboard/seeker/jobs", label: "Jobs" },
        { icon: PiBookmarkSimple, href: "/dashboard/seeker/saved-jobs", label: "Saved Jobs" },
        { icon: FiFileText, href: "/dashboard/seeker/applications", label: "Applications" },
        { icon: BiCreditCard, href: "/dashboard/seeker/billing", label: "Billing" },
        { icon: Gear, href: "/dashboard/seeker/settings", label: "Settings" },
    ];

    const recruiterNavItems = [
        { icon: House, href: '/dashboard/recruiter', label: "Home" },
        { icon: IoBagCheck, href: '/dashboard/recruiter/jobs', label: "Jobs" },
        { icon: MdLibraryAdd, href: '/dashboard/recruiter/jobs/new', label: "Post A Job" },
        { icon: BiBriefcase, href: '/dashboard/recruiter/company', label: "Company Profile" },
        { icon: Envelope, href: '/dashboard/recruiter', label: "Messages" },
        { icon: Person, href: '/dashboard/recruiter', label: "Profile" },
        { icon: Gear, href: '/dashboard/recruiter', label: "Settings" },
    ];

    const adminNavItems = [
        { icon: PiSquaresFourBold, href: "/dashboard/admin", label: "Dashboard" },
        { icon: FaUserSecret, href: "/dashboard/admin/users", label: "Users" },
        { icon: FaBuildingShield, href: "/dashboard/admin/companies", label: "Companies" },
        { icon: Briefcase, href: "/dashboard/admin/jobs", label: "Jobs" },
        { icon: BsCreditCard, href: "/dashboard/admin/payments", label: "Payments" },
        { icon: Gear, href: "/dashboard/admin/settings", label: "Settings" },
    ]

    const navLinkMap = {
        seeker: seekerNavItems,
        recruiter: recruiterNavItems,
        admin : adminNavItems,
    }

    const navItems = navLinkMap[user?.role || 'seeker']

    const navContent = <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
            <Link
                key={item.label}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"
                href={item.href}
            >
                <item.icon className="size-5 text-muted" />
                {item.label}
            </Link>
        ))}
    </nav>


    return (
        <div className="relative">
            <div className=" sticky top-1">

                <aside className="hidden w-64 shrink-0 border-r border-default p-4 lg:block min-h-screen">
                    {navContent}
                </aside>

                <Drawer>
                    <Button variant="secondary" className={'lg:hidden text-violet-600 m-2'}>
                        <VscLayoutSidebarLeftDock />
                        Sidebar
                    </Button>
                    <Drawer.Backdrop>
                        <Drawer.Content placement="left">
                            <Drawer.Dialog>
                                <Drawer.CloseTrigger />
                                <Drawer.Header>
                                    <Drawer.Heading>Navigation</Drawer.Heading>
                                </Drawer.Header>
                                <Drawer.Body>
                                    {navContent}
                                </Drawer.Body>
                            </Drawer.Dialog>
                        </Drawer.Content>
                    </Drawer.Backdrop>
                </Drawer>
            </div>
        </div>
    );
};

export default LeftSideBar;