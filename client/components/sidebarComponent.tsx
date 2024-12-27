 
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
  } from "@/components/ui/sidebar"
import { AddCar, SalesCar, SoldCar, Statistiche } from "./icone_mie"
import SidebarLogoutButton from "./logoutButton"


  const items = [
    {
      title: "Veicoli in Vendita",
      url: "/admin/dashboard/in_vendita",
      icon: SoldCar,
    },
    {
      title: "Veicoli Venduti",
      url: "/admin/dashboard/venduti",
      icon: SalesCar,
    },
    {
      title: "Aggiungi Veicolo",
      url: "/admin/dashboard/aggiungi",
      icon: AddCar,
    },
    {
      title: "Statistiche",
      url: "/admin/dashboard/statistiche",
      icon: Statistiche,
    },
    
  ]

  export function SidebarComponent() {
    return (
      <Sidebar>
        <SidebarHeader />
        <SidebarContent>
          <SidebarGroup />
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} >
                  <SidebarMenuButton asChild size="lg">
                    <div className="h-full w-full">
                        <a
                            href={item.url}
                            className="flex flex-row items-center justify-center w-full gap-3"
                        >
                            <item.icon width={35} height={35} />
                            <p className="mt-1 text-base font-medium w-full">{item.title}</p>
                        </a>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarGroup />
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter >
            <SidebarMenu>
                <SidebarMenuItem> 
                  <SidebarLogoutButton />                                
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    )
  }
  

  