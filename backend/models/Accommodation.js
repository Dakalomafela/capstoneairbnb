const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Accommodation = sequelize.define('Accommodation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
  bedrooms: { type: DataTypes.INTEGER, allowNull: false },
  bathrooms: { type: DataTypes.INTEGER, allowNull: false },
  guests: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  images: { type: DataTypes.TEXT, defaultValue: '[]' },
  amenities: { type: DataTypes.TEXT, defaultValue: '[]' },
  rating: { type: DataTypes.FLOAT, defaultValue: 0 },
  reviews: { type: DataTypes.INTEGER, defaultValue: 0 },
  weeklyDiscount: { type: DataTypes.INTEGER, defaultValue: 0 },
  cleaningFee: { type: DataTypes.INTEGER, defaultValue: 0 },
  serviceFee: { type: DataTypes.INTEGER, defaultValue: 0 },
  occupancyTaxes: { type: DataTypes.INTEGER, defaultValue: 0 },
  enhancedCleaning: { type: DataTypes.BOOLEAN, defaultValue: false },
  selfCheckIn: { type: DataTypes.BOOLEAN, defaultValue: false },
  specificRatings: { type: DataTypes.TEXT, defaultValue: '{}' },
  hostId: { type: DataTypes.INTEGER, allowNull: false },
  hostName: { type: DataTypes.STRING }
});

module.exports = Accommodation;
