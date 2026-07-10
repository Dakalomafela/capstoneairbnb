require('dotenv').config();
const { sequelize } = require('./config/db');
const Accommodation = require('./models/Accommodation');

const seed = async () => {
  await sequelize.sync({ force: true });

  await Accommodation.bulkCreate([
    {
      title: 'Sandton City Hotel',
      location: 'Sandton, SA',
      description: 'Luxury stay in the heart of Sandton.',
      type: 'hotel',
      bedrooms: 2,
      bathrooms: 1,
      guests: 4,
      price: 120,
      images: JSON.stringify(['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400']),
      hostId: 1,
      hostName: 'Demo Host',
    },
    {
      title: 'Joburg City Hotel',
      location: 'Johannesburg, SA',
      description: 'Modern hotel near city center.',
      type: 'hotel',
      bedrooms: 1,
      bathrooms: 1,
      guests: 2,
      price: 95,
      images: JSON.stringify(['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400']),
      hostId: 1,
      hostName: 'Demo Host',
    },
  ]);

  console.log('Database seeded');
  process.exit();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
