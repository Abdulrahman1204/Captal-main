const axios = require('axios');

const getAddressFromCoords = async (lat, lng) => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'your-app-name'
      }
    });

    const { address, display_name } = res.data;
    return {
      fullAddress: display_name,
      street: address.road || '',
      city: address.city || address.town || address.village || '',
      country: address.country || '',
      postalCode: address.postcode || ''
    };
  } catch (error) {
    console.error('Error fetching address:', error.message);
    return null;
  }
};

module.exports = {
  getAddressFromCoords
};