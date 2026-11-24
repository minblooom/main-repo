// src/features/community/hooks/useCommunitySpaces.js
import { useContext } from 'react';
import { CommunitySpacesContext } from '../context/CommunitySpacesContext';

export function useCommunitySpaces() {
  const context = useContext(CommunitySpacesContext);
  if (!context) {
    throw new Error('useCommunitySpaces must be used inside CommunitySpacesProvider');
  }
  return context;
}