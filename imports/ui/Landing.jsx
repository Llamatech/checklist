import React, { Component } from 'react';
/* eslint-enable no-unused-vars */

export default class Landing extends Component {
  render() {
    return (
      <div className='container-fluid landing'>
        <div className='row landing-welcome'>
          <h1>ActiveU</h1>
          <p>¡Bienvenido a <b>ActiveU</b>! El lugar donde el campus universitario
            se vuelve más interactivo. Buscamos conectar personas dentro del
            campus para realizar diferentes actividades y mejorar la experiencia
            universitaria.</p>
        </div>
        <div className='row landing-more'>
          <h2>Conoce Más</h2>
        </div>
      </div>
    );
  }
}
