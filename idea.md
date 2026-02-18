# BitBuzz – Pop Culture Prediction Market
## Project Overview
BitBuzz is a Full Stack Prediction Market platform where users trade virtual "shares" on the outcomes of real-world pop culture events. From movie box office performance to celebrity social media trends, BitBuzz turns cultural intuition into a competitive trading experience.

The system allows users to:
- Browse Markets: Explore trending topics in movies, music, and tech.
- Trade Shares: Buy and sell "Yes" or "No" positions using virtual "Buzz Credits."
- Dynamic Pricing: Experience real-time price shifts driven by an Automated Market Maker (AMM).
- Portfolio Tracking: Monitor gains, losses, and active positions.
- Leaderboard: Compete with others to become the top "Trend Prophet."

The backend is the core focus of this project, emphasizing high-concurrency handling and transactional integrity.

---

## Key Features
1. User Authentication: Secure JWT-based login and session management.
2. Role-Based Access (RBAC): - User: Trade, view portfolio, and track leaderboard.
3. Admin (Oracle): Create markets and settle outcomes based on real-world results.
4. Automated Market Maker (AMM): A backend engine that ensures liquidity and calculates prices dynamically using the Logarithmic Market Scoring Rule (LMSR).
5. Virtual Ledger System: A robust credit management system to handle bets and payouts.
6. Trade Execution Engine: Handles the atomic logic of share allocation and credit deduction.
7. Real-Time "Buzz" Updates: Uses WebSockets to push price changes to the frontend instantly.
8. Market Settlement Logic: Automated distribution of winnings when an event concludes.
9. Global Leaderboard: Ranks users based on their total portfolio value and accuracy.

---

## Backend Architecture
The BitBuzz backend follows a layered, scalable architecture:
- Controller Layer: Handles RESTful endpoints for trading and market discovery.
- Service Layer: Contains the business logic for price calculation and trade validation.
- Repository Layer: Manages data persistence for users, markets, and ledgers.
- DTO (Data Transfer Object) Pattern: Ensures secure and optimized data flow between layers.
- Global Exception Handling: Robust error management for insufficient funds or expired markets.
--- 

## OOP Principles Used
- Encapsulation: Protecting user balances and internal market states.
- Abstraction: Using abstract Market classes to handle different outcome types (Binary vs. Multiple Choice).
- Inheritance: Specialized market types inheriting core logic from a base BaseMarket class.
- Polymorphism: Utilizing a single execute() method that behaves differently depending on the trade strategy.
---

## Design Patterns
- Strategy Pattern: For different pricing algorithms (e.g., LMSR vs. Constant Product).
- Factory Pattern: To instantiate different types of markets (Movie, Music, Tech).
- Singleton Pattern: For the core Matching Engine to ensure a single source of truth for prices.
- Observer Pattern: To notify the Leaderboard and Portfolio services whenever a trade is completed.
--- 
## Tech Stack
- Backend: Node.js (Express) or Spring Boot (Finalized implementation)
- Database: PostgreSQL (for relational integrity of financial transactions)
- Real-time: WebSockets (Socket.io)
- Authentication: JWT
- Frontend: React
- Containerization: Docker (for isolated pricing engine execution)