# CryptoCoin - Cryptocurrency Tracker

A modern React application for tracking cryptocurrency prices and market data. Built with Vite, Redux Toolkit, and React Router.

## Features

- 📊 Real-time cryptocurrency price tracking
- 📈 Interactive price charts using Google Charts
- 🏠 Home page with top cryptocurrencies
- 💰 Detailed coin pages with comprehensive data
- 🎨 Modern and responsive UI design
- ⚡ Fast performance with Vite build tool

## Tech Stack

- **Frontend**: React 19, Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Charts**: React Google Charts
- **Styling**: CSS3 with modern features
- **Linting**: ESLint

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cryptocoin.git
cd cryptocoin
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/
│   └── store.js          # Redux store configuration
├── components/
│   ├── LineChart/        # Chart components
│   └── Navbar/           # Navigation component
├── features/
│   └── cryptoSlice.js    # Redux slice for crypto data
├── pages/
│   ├── Home/             # Home page
│   └── Coin/             # Individual coin page
└── assets/               # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
