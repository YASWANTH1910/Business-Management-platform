import api from './api';

const inventoryService = {
    /**
     * Get all inventory items with pagination
     */
    async getItems(skip = 0, limit = 100) {
        const response = await api.get('/inventory', {
            params: { skip, limit },
        });
        return response.data;
    },

    /**
     * Get single inventory item by ID
     */
    async getItem(id) {
        const response = await api.get(`/inventory/${id}`);
        return response.data;
    },

    /**
     * Get low stock items
     */
    async getLowStock() {
        const response = await api.get('/inventory/low-stock');
        return response.data;
    },

    /**
     * Create new inventory item
     */
    async createItem(itemData) {
        const response = await api.post('/inventory', itemData);
        return response.data;
    },

    /**
     * Update inventory item (triggers alert if low stock)
     */
    async updateItem(id, itemData) {
        const response = await api.patch(`/inventory/${id}`, itemData);
        return response.data;
    },
};

export default inventoryService;
