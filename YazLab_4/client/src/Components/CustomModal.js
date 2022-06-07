import React from 'react';
import Popup from 'reactjs-popup';
import "./CustomModal.css"

// eslint-disable-next-line import/no-anonymous-default-export
export default ({keyElement}) => (
  <Popup
    open = {keyElement}
    modal
    nested
  >
    {close => (
      <div className="modal">
        <button className="close" onClick={close}>
          &times;
        </button>
        <div className="header"> Birden Fazla Hatalı Giriş </div>
        <div className="content">
          {' '}
          Hesabınıza birden fazla hatalı giriş yapılmıştır. Hesabınız güvenlik nedeniyle
          bloke edilmiştir.
        </div>
        <div className="actions">
         
          <button
            className="button"
            onClick={() => {
              console.log('modal closed ');
              close();
            }}
          >
            Close
          </button>
        </div>
      </div>
    )}
  </Popup>
);