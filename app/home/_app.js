import '../styles/globals.css'; // Importa los estilos globales
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

function MyApp({ Component, pageProps }) {
  const user = {
    avatar: "/path/to/avatar.jpg",
    name: "Nombre del Usuario"
  };

  return (
    <div className="app-container flex">
      <Navbar user={user} />
      <Sidebar user={user} />
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
    </div>
  );
}

export default MyApp;
