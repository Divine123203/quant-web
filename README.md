# QuantBet AI - Advanced Football Analytics Platform

QuantBet AI is a production-grade machine learning system for predicting football match outcomes, detecting market edge, and optimizing betting tickets.

## Features

- **Automated Data Pipeline**: Daily fixtures, historical stats, odds, and feature engineering.
- **Ensemble ML Models**: XGBoost, CatBoost, Neural Networks for probability estimation.
- **Edge Detection**: Compare model probabilities vs bookmaker implied odds.
- **Smart Ticket Builder**: Risk-adjusted accumulator generator.
- **Backtesting Engine**: validate strategies against 3 years of data.
- **Modern Dashboard**: Next.js + Tailwind CSS with premium dark theme.

## Architecture

- **Backend**: Python 3.11, FastAPI, SQLAlchemy, Alembic
- **ML/Data**: Scikit-Learn, Pandas, PyTorch, Celery, Redis
- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Database**: PostgreSQL 15
- **Infrastructure**: Docker Compose

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local frontend dev)
- Python 3.11 (for local backend dev)

### Run with Docker (Recommended)

```bash
# Build and start all services
docker-compose up --build
```

Access the application:

- **Frontend Dashboard**: [http://localhost:3000](http://localhost:3000)
- **Backend API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

### Local Development

#### Backend

```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
quant-web/
├── backend/            # FastAPI Application
│   ├── app/
│   │   ├── api/        # API Routes
│   │   ├── core/       # Config & Security
│   │   ├── db/         # Database Models & Session
│   │   ├── ml/         # Machine Learning Models
│   │   └── services/   # Business Logic
│   └── alembic/        # Database Migrations
├── frontend/           # Next.js Application
│   ├── app/            # App Router Pages
│   ├── components/     # Reusable UI Components
│   └── lib/            # Utilities
└── docker-compose.yml  # Container Orchestration
```

## License

Proprietary software. for personal use only.
