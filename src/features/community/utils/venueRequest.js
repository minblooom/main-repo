// src/features/community/utils/venueRequest.js
export const requestWholeDay = async (venueId, details = {}) => {
  return {
    success: true,
    requestId: `req-${Date.now()}`,
    venueId,
    status: 'pending',
    message: 'Your meeting spot inquiry has been submitted gently.',
  };
};
