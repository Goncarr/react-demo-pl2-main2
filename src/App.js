import './App.css';
import Header from './components/Header/Index';
import Hero from './components/Hero/Index';
import Formacao from './components/formacoes/Index';
import Investigacao from './components/investigacao/Index';
import Parcerias from './components/Parcerias/Index';
import Conquistas from './components/conquistas/Index';
import MapaEventos from './components/mapa/Index';
import NoticiasNewsletter from './components/newsletter/Index';
import GestaoEventos from './components/eventomanager/Index';
import Footer from './components/Footer/Index';
import NoticiasSection from './components/noticias';
import Login from './components/login/Index';
import Register from './components/registo/Index'; 
import Perfil from './components/perfil/Index';


function App() {

  const caminhoAcesso = window.location.pathname;


  if (caminhoAcesso === '/login') {
    return (
      <div className="container">
        <Header />
        <Login />
        <Footer />
      </div>
    );
  }

  if (caminhoAcesso === '/register') {
    return (
      <div className="container">
        <Header />
        <Register />
        <Footer />
      </div>
    );
  }

  if (caminhoAcesso === '/perfil') {
    return (
      <div className="container">
        <Header />
        <Perfil />
        <Footer />
      </div>
    );
  }


  return (
    <div className="container">
      <Header />
      <Hero id="Missao" title="A nossa Missão" description="Ser uma instituição académica com o intuito de apoiar a realização
        de projetos locais, promovendo a inovação e rigor a fim de inspirar
        boa fé e confiança no setor medicinal e farmacêutico." />
      <Hero id="objetivo" title="Objetivo" description="Apoiar os seus associados e servir como ponto de referência para estes,
        com um foco em instituições clínicas e académicas locais e em alunos
        com interesse nestas áreas." />
      
      <Investigacao/>
      <Parcerias/>
      <Conquistas/>
      <GestaoEventos />  
      <MapaEventos/>
      <NoticiasNewsletter/>
      <NoticiasSection/>
      <Footer/>
    </div>
  );
}

export default App;