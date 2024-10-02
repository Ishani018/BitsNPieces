import React, { useState } from 'react';
import './Menu.css'; // Import the Menu.css file

function Menu() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [userName, setUserName] = useState('');
  const [uniqueCode, setUniqueCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [order, setOrder] = useState([]);
  const [allOrders, setAllOrders] = useState([]); // Store all orders

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setUniqueCode(''); // Reset unique code when selecting a new restaurant
    setUserName(''); // Reset user name when selecting a new restaurant
    setPhoneNumber(''); // Reset phone number when selecting a new restaurant
    setOrder([]); // Reset order when selecting a new restaurant
  };

  const handleNameChange = (e) => {
    setUserName(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value); // Handle phone number input
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
        return prevOrder.filter((orderItem) => orderItem !== item); // Remove the item if already in the order
      } else {
        return [...prevOrder, item]; // Add the item
      }
    });
  };

  const submitOrder = () => {
    if (!uniqueCode || order.length === 0) {
      alert("Please generate a code and select at least one item to order.");
      return;
    }

    // Create an order object with all necessary details
    const newOrder = {
      code: uniqueCode,
      name: userName,
      phone: phoneNumber,
      restaurant: selectedRestaurant,
      items: order
    };

    // Store the order in the list of all orders
    setAllOrders((prevOrders) => [...prevOrders, newOrder]);

    // Reset fields for the next order
    setSelectedRestaurant(null);
    setUserName('');
    setPhoneNumber('');
    setUniqueCode('');
    setOrder([]);
  };

  const restaurantMenus = {
    "North Indian": ["Butter Chicken", "Paneer Tikka", "Naan", "Chole Bhature"],
    "South Indian": ["Dosa", "Idli", "Sambar", "Vada"],
    "Cantina": ["Burger", "Pizza", "Fries", "Cola"],
  };

  return (
    <div className="menu-container">
      {/* "Your Orders" section at the top */}
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

      {/* Restaurant Selection */}
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

      {/* Input for Name, Phone, and Generate Code */}
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

      {/* Display the generated unique code */}
      {uniqueCode && (
        <div className="unique-code-display">
          <h3>Your Unique Code: {uniqueCode}</h3>
        </div>
      )}

      {/* Display menu and allow item selection after the code is generated */}
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
    </div>
  );
}

export default Menu;
