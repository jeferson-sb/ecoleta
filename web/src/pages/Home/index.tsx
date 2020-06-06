import React from 'react';
import { FiLogIn } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import logo from '../../assets/logo.svg';
import illustration from '../../assets/home-bg.svg';
import './styles.css';

const Home: React.FC = () => {
  return (
    <div id="page-home">
      <div className="container">
        <header>
          <img src={logo} alt="Ecoleta logo" />
        </header>
        <main>
          <div className="content">
            <h1>Seu marketplace de coleta de resíduos</h1>
            <p>
              Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente
            </p>
            <Link to="/create-point">
              <span>
                <FiLogIn />
              </span>
              <strong>Cadastre um ponto de coleta</strong>
            </Link>
          </div>
          <img src={illustration} alt="Ilustração Pessoas reciclando" />
        </main>
      </div>
    </div>
  );
};

export default Home;
