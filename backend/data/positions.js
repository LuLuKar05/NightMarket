// Mock user positions data for MVP
const positions = [
    // Wallet Address 1: 0x1234567890abcdef1234567890abcdef12345678
    {
        id: "pos-1",
        marketId: "market-1",
        walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
        outcome: "YES",
        shares: 150,
        invested: 8500,
        currentValue: 9300,
        isPrivate: false,
        createdAt: "2025-03-15T10:30:00Z"
    },
    {
        id: "pos-2",
        marketId: "market-3",
        walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
        outcome: "YES",
        shares: 200,
        invested: 12000,
        currentValue: 14200,
        isPrivate: false,
        createdAt: "2025-04-02T14:20:00Z"
    },
    {
        id: "pos-3",
        marketId: "market-5",
        walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
        outcome: "YES",
        shares: 300,
        invested: 15000,
        currentValue: 24900,
        isPrivate: true,
        createdAt: "2025-05-10T09:15:00Z"
    },
    {
        id: "pos-4",
        marketId: "market-7",
        walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
        outcome: "NO",
        shares: 100,
        invested: 3200,
        currentValue: 3200,
        isPrivate: false,
        createdAt: "2025-06-18T16:45:00Z"
    },

    // Wallet Address 2: 0xabcdef1234567890abcdef1234567890abcdef12
    {
        id: "pos-5",
        marketId: "market-2",
        walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
        outcome: "NO",
        shares: 250,
        invested: 10000,
        currentValue: 13750,
        isPrivate: true,
        createdAt: "2025-03-22T11:00:00Z"
    },
    {
        id: "pos-6",
        marketId: "market-4",
        walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
        outcome: "NO",
        shares: 400,
        invested: 20000,
        currentValue: 28800,
        isPrivate: false,
        createdAt: "2025-04-15T13:30:00Z"
    },
    {
        id: "pos-7",
        marketId: "market-6",
        walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
        outcome: "YES",
        shares: 180,
        invested: 7560,
        currentValue: 7560,
        isPrivate: false,
        createdAt: "2025-05-20T10:10:00Z"
    },
    {
        id: "pos-8",
        marketId: "market-9",
        walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
        outcome: "YES",
        shares: 500,
        invested: 25000,
        currentValue: 27000,
        isPrivate: false,
        createdAt: "2025-07-01T08:25:00Z"
    },

    // Wallet Address 3: 0x9876543210fedcba9876543210fedcba98765432
    {
        id: "pos-9",
        marketId: "market-1",
        walletAddress: "0x9876543210fedcba9876543210fedcba98765432",
        outcome: "NO",
        shares: 120,
        invested: 4560,
        currentValue: 4560,
        isPrivate: false,
        createdAt: "2025-08-05T12:40:00Z"
    },
    {
        id: "pos-10",
        marketId: "market-3",
        walletAddress: "0x9876543210fedcba9876543210fedcba98765432",
        outcome: "YES",
        shares: 350,
        invested: 18000,
        currentValue: 24850,
        isPrivate: false,
        createdAt: "2025-08-12T15:20:00Z"
    },
    {
        id: "pos-11",
        marketId: "market-8",
        walletAddress: "0x9876543210fedcba9876543210fedcba98765432",
        outcome: "NO",
        shares: 280,
        invested: 14000,
        currentValue: 18200,
        isPrivate: true,
        createdAt: "2025-09-01T09:30:00Z"
    },
    {
        id: "pos-12",
        marketId: "market-10",
        walletAddress: "0x9876543210fedcba9876543210fedcba98765432",
        outcome: "YES",
        shares: 220,
        invested: 11000,
        currentValue: 12760,
        isPrivate: true,
        createdAt: "2025-10-15T14:50:00Z"
    }
];

module.exports = positions;
