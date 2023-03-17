import LoginBtn from '@/components/login-btn'

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
        <a class="navbar-brand" href="#">Zitate-App</a>
        <LoginBtn />  
        </div>
        </nav>
    );
}
