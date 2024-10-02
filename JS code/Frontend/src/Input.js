import React, {} from 'react';
import './public_css/Input.css';

const Input = ({ area, setArea,area_office, setAreaOffic, isResidential, setIsResidential, handleSubmit }) => {
  return (
    <div className="inf-section">
      <form onSubmit={handleSubmit}>
        <h2>Введите площадь (кв.м):</h2>
        <h3>
          <center>Жилая площадь:</center>
        </h3>
        <input type="number" value={area} defaultValue={0} onChange={(e) => setArea(e.target.value)} required/>
        <h3>
        <center>Рабочая/Офисная площадь:</center>
        </h3>
        <input type="number" value={area_office} defaultValue={0} onChange={(e) => setAreaOffic(e.target.value)} required/>
        <h2>Настройте тип помещения:</h2>
        <h3>
          <center>Жилые помещения:</center>
        </h3>
        <select value={isResidential} onChange={(e) => setIsResidential(e.target.value)} >
            <option value="1">Эконом</option>
            <option value="2">Комфорт</option>
            <option value="3">Элитное</option>
            <option value="2">Отсутствует</option>
        </select>
        <h3>
        <center>Рабочие/Офисные помещение:</center>
        </h3>
        <select>
            <option value="1">Присутствует</option>
            <option value="2">Отсутствует</option>
        </select>
        <center>
        <button type="submit" className='submit-button'>Рассчитать</button>
        </center>
      </form>
    </div>
  );
};

export default Input;
