// ============================================================================
// Mock User Data
// ============================================================================

import type { User, UserInfo, UserChartData } from "@/types";

export const mockUsers: User[] = [
  {
    id: 1,
    uuid: "user-uuid-1",
    username: "John Doe",
    email: "john@example.com",
    avatar: "https://picsum.photos/seed/user1/100/100.jpg",
    role: "admin",
    status: 1,
    signature: "Web developer and tech enthusiast",
    address: "San Francisco, CA",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    uuid: "user-uuid-2",
    username: "Jane Smith",
    email: "jane@example.com",
    avatar: "https://picsum.photos/seed/user2/100/100.jpg",
    role: "user",
    status: 1,
    signature: "TypeScript enthusiast",
    address: "New York, NY",
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
  },
  {
    id: 3,
    uuid: "user-uuid-3",
    username: "Bob Wilson",
    email: "bob@example.com",
    avatar: "https://picsum.photos/seed/user3/100/100.jpg",
    role: "user",
    status: 1,
    signature: "Full-stack developer",
    address: "Austin, TX",
    created_at: "2024-01-03T00:00:00Z",
    updated_at: "2024-01-03T00:00:00Z",
  },
  {
    id: 4,
    uuid: "user-uuid-4",
    username: "Alice Johnson",
    email: "alice@example.com",
    avatar: "https://picsum.photos/seed/user4/100/100.jpg",
    role: "user",
    status: 1,
    signature: "UI/UX designer",
    address: "Seattle, WA",
    created_at: "2024-01-04T00:00:00Z",
    updated_at: "2024-01-04T00:00:00Z",
  },
  {
    id: 5,
    uuid: "user-uuid-5",
    username: "Charlie Brown",
    email: "charlie@example.com",
    avatar: "https://picsum.photos/seed/user5/100/100.jpg",
    role: "user",
    status: 0, // Frozen
    signature: "Mobile app developer",
    address: "Boston, MA",
    created_at: "2024-01-05T00:00:00Z",
    updated_at: "2024-01-05T00:00:00Z",
  },
];

export const mockUserChartData: UserChartData = {
  date_list: [
    "2024-03-08",
    "2024-03-09",
    "2024-03-10",
    "2024-03-11",
    "2024-03-12",
    "2024-03-13",
    "2024-03-14",
  ],
  login_data: [45, 52, 38, 65, 59, 72, 68],
  register_data: [5, 8, 3, 12, 7, 9, 6],
};

export const mockLoginResponse: UserInfo = {
  user: mockUsers[0],
  access_token: "mock-access-token-12345",
  access_token_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

export const mockRegisterResponse: UserInfo = {
  user: mockUsers[1],
  access_token: "mock-access-token-67890",
  access_token_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};
