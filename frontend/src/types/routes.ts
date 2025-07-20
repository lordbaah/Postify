import React from 'react';

// Interface for defining application routes
export interface AppRoute {
  path: string;
  component: React.ComponentType;
  layout?: React.ComponentType<{ children: React.ReactNode }>;
  isProtected?: boolean; // NEW: True if authentication is required
  isAdminOnly?: boolean; // NEW: True if admin role is required (implies isProtected)
  isPublicOnly?: boolean;
}
