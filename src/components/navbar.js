import Link from 'next/link'
import LoginBtn from '@/components/login-btn'

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
        <Link class="navbar-brand" href="/">Zitate-App</Link>
        <LoginBtn />  
        </div>
        </nav>
    );
}
