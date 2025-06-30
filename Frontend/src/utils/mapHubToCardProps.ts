// src/utils/mapHubToCardProps.ts
export interface Hub {
  _id: string;
  name: string;
  description: string;
  creator: string;
  members: string[];
  newPosts?: number;
  lastActive?: string;
  activeUsers?: number;
  category?: string;
  bannerUrl?: string;
}

export interface HubCardProps {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  newPosts: number;
  lastActive: string;
  activeUsers: number;
  isJoined?: boolean;
  isPrivate?: boolean;
  isCreator?: boolean;
  category: string;
  bannerUrl?: string;
}

export const mapHubToCardProps = (
  hub: Hub,
  currentUserId: string
): HubCardProps => ({
  id: hub._id,
  name: hub.name,
  description: hub.description,
  memberCount: hub.members.length,
  newPosts: hub.newPosts || 0,
  lastActive: hub.lastActive || 'unknown',
  activeUsers: hub.activeUsers || 0,
  isJoined: hub.members.includes(currentUserId),
  isCreator: hub.creator === currentUserId,
  category: hub.category || 'General',
  bannerUrl: hub.bannerUrl,
});
