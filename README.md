# SMA - Stock Market Analyzer

A full-stack web application for tracking and analyzing stock market data using the Finage API. The application features a React frontend for data visualization and an Express.js backend for API handling and data persistence.

## Features

- Real-time stock data retrieval from Finage API
- Historical stock data tracking
- Upward trend analysis
- Interactive stock price charts
- HTTPS-secured API endpoints
- MongoDB integration for data persistence

## Tech Stack

### Frontend
- React.js
- Chart.js for data visualization
- React Bootstrap for UI components
- Axios for API calls

### Backend
- Express.js
- MongoDB for database
- HTTPS server with SSL certification
- Winston for logging

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (v14 or higher)
- MongoDB installed and running
- SSL certificate for HTTPS
- Finage API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Mousse789/SMA-Stock-Market-Analyzer.git
cd SMA-Stock-Market-Analyzer
```

2. Install backend dependencies:
```bash
cd ExpressJS
npm install
```

3. Install frontend dependencies:
```bash
cd ../my-stock-app
npm install
```

4. Set up environment variables:
   - Copy `.env.example` to `.env` in the ExpressJS directory
   - Fill in the following variables:
     ```
     FINAGE_API_KEY=your_finage_api_key
     MONGO_DB_NAME=your_mongo_db_name
     MONGO_DB_USERNAME=your_mongo_db_username
     MONGO_DB_PASSWORD=your_mongo_db_password
     ```

5. Set up SSL:
   - Place your SSL certificates in the `ExpressJS/ssl` directory:
     - `key.key` for the private key
     - `cert.pem` for the certificate

## Running the Application

1. Start the backend server:
```bash
cd ExpressJS
npm start
```
The server will start on port 6060 with HTTPS enabled.

2. Start the frontend application:
```bash
cd my-stock-app
npm start
```
The React application will start on port 3000.

## API Endpoints

- `GET /usstock/get-stock-data`: Retrieve default stock data
- `POST /usstock/stock-data-overview`: Get detailed stock data for a specific symbol and date
- `POST /usstock/upward-trend-stocks`: Analyze and store stocks showing upward trends
- `GET /usstock/list-stock-history`: Retrieve stock search history
- `DELETE /usstock/delete-stock-history`: Remove stock history for a specific symbol

## Security

- HTTPS encryption enabled
- Environment variables for sensitive data
- SSL certificate implementation
- Secure MongoDB connection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 