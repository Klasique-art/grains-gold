import { Navbar, Footer } from "@/components"
import { currentUser } from "@/data/dummyUser"

const RootLayout = async ({children}: {children: React.ReactNode}) => {

  return (
    <div>
        <Navbar currentUser={currentUser} />
          <main id="main-content">{children}</main>
        <Footer />
    </div>
  )
}

export default RootLayout
