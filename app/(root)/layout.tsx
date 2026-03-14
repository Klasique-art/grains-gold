import { Navbar, Footer } from "@/components"

const RootLayout = async ({children}: {children: React.ReactNode}) => {

// const isLoggedIn = true;
// const currentUser = { name: "John Doe" }; 
  
  // console.log('RootLayout - currentUser:', currentUser);
  // console.log('RootLayout - isLoggedIn:', isLoggedIn);

  return (
    <div>
        <Navbar />
        {children}
        <Footer />
    </div>
  )
}

export default RootLayout