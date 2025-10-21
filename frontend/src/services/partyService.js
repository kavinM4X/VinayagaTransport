import { api, cachedGet, clearCache } from './apiClient';

export const partyService = {
  // Get all parties with optional filters
  async getParties(filters = {}) {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const url = queryString ? `/parties?${queryString}` : '/parties';
    
    return await cachedGet(url, {}, 30000); // Cache for 30 seconds
  },
  
  // Get single party by ID
  async getParty(id) {
    if (!id) throw new Error('Party ID is required');
    return await cachedGet(`/parties/${id}`, {}, 60000); // Cache for 1 minute
  },
  
  // Create new party
  async createParty(partyData) {
    const response = await api.post('/parties', partyData);
    // Clear cache after creating new party
    clearCache('parties');
    return response;
  },
  
  // Update party
  async updateParty(id, partyData) {
    if (!id) throw new Error('Party ID is required');
    const response = await api.put(`/parties/${id}`, partyData);
    // Clear cache after updating party
    clearCache('parties');
    clearCache(`/parties/${id}`);
    return response;
  },
  
  // Delete party
  async deleteParty(id) {
    if (!id) throw new Error('Party ID is required');
    const response = await api.delete(`/parties/${id}`);
    // Clear cache after deleting party
    clearCache('parties');
    clearCache(`/parties/${id}`);
    return response;
  },
  
  // Get party history/audit log
  async getPartyHistory(id) {
    if (!id) throw new Error('Party ID is required');
    return await cachedGet(`/parties/${id}/history`);
  },
  
  // Search parties with advanced filters
  async searchParties(searchParams) {
    const {
      query = '',
      place = '',
      phone = '',
      fromDate = '',
      toDate = '',
      reminder = '',
      minNetWeight = '',
      maxNetWeight = '',
      limit = 100,
      offset = 0,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = searchParams;
    
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (place) params.append('place', place);
    if (phone) params.append('phone', phone);
    if (fromDate) params.append('from', fromDate);
    if (toDate) params.append('to', toDate);
    if (reminder) params.append('reminder', reminder);
    if (minNetWeight) params.append('minNetWeight', minNetWeight);
    if (maxNetWeight) params.append('maxNetWeight', maxNetWeight);
    params.append('limit', limit);
    params.append('offset', offset);
    params.append('sortBy', sortBy);
    params.append('sortOrder', sortOrder);
    
    return await cachedGet(`/parties?${params.toString()}`, {}, 30000);
  },
  
  // Get parties due for reminder
  async getDueReminders() {
    return await cachedGet('/parties?reminder=due', {}, 60000);
  },
  
  // Export parties data
  async exportParties(format = 'csv', filters = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    queryParams.append('format', format);
    
    const response = await api.get(`/parties/export?${queryParams.toString()}`, {
      responseType: 'blob'
    });
    
    return response;
  },
  
  // Bulk operations
  async bulkUpdate(partyIds, updateData) {
    return await api.post('/parties/bulk-update', {
      ids: partyIds,
      data: updateData
    });
  },
  
  async bulkDelete(partyIds) {
    return await api.post('/parties/bulk-delete', { ids: partyIds });
  },
  
  // Get statistics
  async getStatistics() {
    return await cachedGet('/stats', {}, 60000); // Cache for 1 minute
  },
  
  // Validate party data before submission
  validatePartyData(data) {
    const errors = {};
    
    if (!data.partyName?.trim()) {
      errors.partyName = 'Party name is required';
    }
    
    if (data.quantity && data.quantity < 0) {
      errors.quantity = 'Quantity must be a positive number';
    }
    
    if (data.batchFrom && data.batchTo && new Date(data.batchFrom) > new Date(data.batchTo)) {
      errors.batchTo = 'Batch end date must be after start date';
    }
    
    if (data.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(data.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

