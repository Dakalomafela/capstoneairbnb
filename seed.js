require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require('./models/Listing');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Listing.deleteMany();
  await Listing.insertMany([
    { title: 'Sandton City Hotel', location: 'Sandton, SA', price: 120, images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'] },
    { title: 'Joburg City Hotel', location: 'Johannesburg, SA', price: 95, images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400'] },
    { title: 'Hyde Park Hotel', location: 'Hyde Park, SA', price: 150, images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400'] },
    { title: 'Woodmead Hotel', location: 'Woodmead, SA', price: 110, images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400'] }
  ]);
  console.log('Database seeded');
  process.exit();
};
seed();