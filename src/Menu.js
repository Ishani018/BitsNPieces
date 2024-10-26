import React, { useState, useEffect } from 'react';
import './Menu.css';

function Menu() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [userName, setUserName] = useState('');
  const [uniqueCode, setUniqueCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [order, setOrder] = useState([]);
  const [allOrders, setAllOrders] = useState([]); // Store all orders
  const [isProcessing, setIsProcessing] = useState(false); // For processing payment
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false); // For order submission

  useEffect(() => {
    // Load orders from session storage on component mount
    const storedOrders = sessionStorage.getItem('allOrders');
    if (storedOrders) {
      setAllOrders(JSON.parse(storedOrders));
    }
  }, []);

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setUniqueCode('');
    setUserName('');
    setPhoneNumber('');
    setOrder([]);
    setIsOrderSubmitted(false);
  };

  const handleNameChange = (e) => {
    setUserName(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const generateUniqueCode = () => {
    const phoneRegex = /^\d{10}$/;
    if (!selectedRestaurant || !userName || !phoneRegex.test(phoneNumber)) {
      if (!phoneRegex.test(phoneNumber)) {
        alert('Please enter a valid phone number (10 digits).');
      }
      return;
    }
    const prefix = selectedRestaurant === 'North Indian' ? 'NI' :
                   selectedRestaurant === 'South Indian' ? 'SI' :
                   'CA';
    const fourDigits = phoneNumber.replace(/\D/g, '').slice(-4);
    const code = `${prefix}${fourDigits}${userName.slice(0, 3).toUpperCase()}`;
    setUniqueCode(code);
  };

  const handleOrderChange = (item) => {
    setOrder((prevOrder) => {
      if (prevOrder.includes(item)) {
        return prevOrder.filter((orderItem) => orderItem !== item);
      } else {
        return [...prevOrder, item];
      }
    });
  };

  const submitOrder = () => {
    if (!uniqueCode || order.length === 0) {
      alert("Please generate a code and select at least one item to order.");
      return;
    }

    const newOrder = {
      code: uniqueCode,
      name: userName,
      phone: phoneNumber,
      restaurant: selectedRestaurant,
      items: order
    };

    setAllOrders((prevOrders) => {
      const updatedOrders = [...prevOrders, newOrder];
      // Store updated orders in session storage
      sessionStorage.setItem('allOrders', JSON.stringify(updatedOrders));
      return updatedOrders;
    });

    setIsOrderSubmitted(true);
    setSelectedRestaurant(null);
    setUserName('');
    setPhoneNumber('');
    setUniqueCode('');
    setOrder([]);
  };

  const handlePayment = () => {
    setIsProcessing(true);
    window.open("https://rzp.io/rzp/uJhY941", "_blank");

    setTimeout(() => {
      alert("Payment Successful! Your order is being processed.");
      setIsProcessing(false);
    }, 2000);
  };

  const restaurantMenus = {
    "North Indian": ["Butter Chicken", "Paneer Tikka", "Naan", "Chole Bhature"],
    "South Indian": ["Dosa", "Idli", "Sambar", "Vada"],
    "Cantina": ["Burger", "Pizza", "Fries", "Cola"],
  };

  return (
    <div className="menu-container">
      <div className="your-orders">
        <h2>Your Orders</h2>
        {allOrders.length === 0 ? (
          <p>No orders placed yet.</p>
        ) : (
          <ul>
            {allOrders.map((order, index) => (
              <li key={index}>
                <strong>{order.name}</strong> (Phone: {order.phone}) - 
                Code: {order.code}, Restaurant: {order.restaurant}, 
                Items: {order.items.join(', ')}
              </li>
            ))}
          </ul>
        )}
      </div>

      <h2>Select a Restaurant</h2>
      <div className="restaurant-list">
        <button className="restaurant-btn" onClick={() => handleRestaurantClick('North Indian')}>
          North Indian
        </button>
        <button className="restaurant-btn" onClick={() => handleRestaurantClick('South Indian')}>
          South Indian
        </button>
        <button className="restaurant-btn" onClick={() => handleRestaurantClick('Cantina')}>
          Cantina
        </button>
      </div>

      {selectedRestaurant && (
        <div className="phone-number-input">
          <h3>You selected: {selectedRestaurant}</h3>
          <input
            type="text"
            value={userName}
            onChange={handleNameChange}
            placeholder="Enter your name"
            className="phone-number-field" 
          />
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder="Enter your phone number"
            className="phone-number-field" 
          />
          <button onClick={generateUniqueCode} className="generate-code-btn">Generate Code</button>
        </div>
      )}

      {uniqueCode && (
        <div className="unique-code-display">
          <h3>Your Unique Code: {uniqueCode}</h3>
        </div>
      )}

      {selectedRestaurant && uniqueCode && (
        <div className="menu">
          <h3>Menu for {selectedRestaurant}</h3>
          <ul>
            {restaurantMenus[selectedRestaurant].map((item) => (
              <li key={item}>
                <label>
                  <input
                    type="checkbox"
                    value={item}
                    checked={order.includes(item)}
                    onChange={() => handleOrderChange(item)}
                  />
                  {item}
                </label>
              </li>
            ))}
          </ul>
          <button onClick={submitOrder} className="submit-order-btn">Submit Order</button>
        </div>
      )}

      {isOrderSubmitted && !isProcessing && (
        <div className="payment-section">
          <button onClick={handlePayment} className="pay-btn">Pay to Confirm</button>
        </div>
      )}

      {isProcessing && (
        <div className="processing-message">
          <h3>Your order is being processed...</h3>
        </div>
      )}
    </div>
  );
}

export default Menu;
