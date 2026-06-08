import React from 'react';
import { useApp } from '../../context/AppContext';

export default function FiltersRow() {
  const { 
    flt, 
    setFlt, 
    catFlt, 
    setCatFlt, 
    priFlt, 
    setPriFlt 
  } = useApp();

  const handleBtnFlt = (val) => {
    setFlt(val);
    setCatFlt('');
    setPriFlt('');
  };

  const handleCatSelectChange = (val) => {
    if (!val) {
      handleBtnFlt('all');
    } else {
      setFlt(val);
      setCatFlt(val);
      setPriFlt('');
    }
  };

  const handlePriSelectChange = (val) => {
    if (!val) {
      handleBtnFlt('all');
    } else {
      setFlt(val);
      setPriFlt(val);
      setCatFlt('');
    }
  };

  const isBtnOn = (val) => flt === val && !catFlt && !priFlt;

  return (
    <div className="filters-row">
      <button 
        className={`flt ${isBtnOn('all') ? 'on' : ''}`} 
        onClick={() => handleBtnFlt('all')}
      >
        All
      </button>
      <button 
        className={`flt ${isBtnOn('active') ? 'on' : ''}`} 
        onClick={() => handleBtnFlt('active')}
      >
        Active
      </button>
      <button 
        className={`flt ${isBtnOn('in-progress') ? 'on' : ''}`} 
        onClick={() => handleBtnFlt('in-progress')}
      >
        In Progress
      </button>
      <button 
        className={`flt ${isBtnOn('completed') ? 'on' : ''}`} 
        onClick={() => handleBtnFlt('completed')}
      >
        Completed
      </button>
      <button 
        className={`flt ${isBtnOn('mine') ? 'on' : ''}`} 
        onClick={() => handleBtnFlt('mine')}
      >
        Mine
      </button>
      <button 
        className={`flt ${isBtnOn('hers') ? 'on' : ''}`} 
        onClick={() => handleBtnFlt('hers')}
      >
        Hers
      </button>

      {/* Category Dropdown Pill */}
      <select 
        className={`flt ${catFlt === flt && catFlt ? 'on' : ''}`}
        value={catFlt} 
        onChange={(e) => handleCatSelectChange(e.target.value)}
        style={{
          outline: 'none',
          cursor: 'pointer',
          paddingRight: '0.5rem',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          appearance: 'none',
          textAlign: 'center'
        }}
      >
        <option value="">📁 Category</option>
        <option value="general">📋 General</option>
        <option value="sms">📱 SMS</option>
        <option value="date">🌹 Date</option>
        <option value="shopping">🛍️ Shopping</option>
        <option value="travel">✈️ Travel</option>
        <option value="food">🍽️ Food</option>
        <option value="home">🏠 Home</option>
        <option value="health">💊 Health</option>
        <option value="learning">📚 Learning</option>
      </select>

      {/* Priority Dropdown Pill */}
      <select 
        className={`flt ${priFlt === flt && priFlt ? 'on' : ''}`}
        value={priFlt} 
        onChange={(e) => handlePriSelectChange(e.target.value)}
        style={{
          outline: 'none',
          cursor: 'pointer',
          paddingRight: '0.5rem',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          appearance: 'none',
          textAlign: 'center'
        }}
      >
        <option value="">👑 Priority</option>
        <option value="urgent">🔴 Urgent</option>
        <option value="high">🟠 High</option>
        <option value="medium">🟡 Medium</option>
        <option value="low">⚪ Low</option>
      </select>
    </div>
  );
}
