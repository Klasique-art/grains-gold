import { Navbar, Footer } from "@/components"

const RootLayout = async ({children}: {children: React.ReactNode}) => {

  return (
    <div>
        <Navbar currentUser={null} />
          <main id="main-content">{children}</main>
        <Footer />
    </div>
  )
}

export default RootLayout
