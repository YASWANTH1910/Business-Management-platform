
import api from './api';

const staffMembers = [
    { id: '1', name: 'Sarah Wilson', email: 'sarah@careops.com', status: 'Active', permissions: { inbox: true, bookings: true, forms: false, inventory: false } },
    { id: '2', name: 'Mike Chen', email: 'mike@careops.com', status: 'Active', permissions: { inbox: false, bookings: true, forms: true, inventory: true } }
];

const staffService = {
    async getStaff() {
        // Mock API call
        return new Promise(resolve => setTimeout(() => resolve([...staffMembers]), 500));
    },

    async addStaff(staff) {
        return new Promise(resolve => {
            const newStaff = { ...staff, id: Date.now().toString() };
            staffMembers.push(newStaff);
            setTimeout(() => resolve(newStaff), 500);
        });
    },

    async updateStaff(id, updates) {
        return new Promise(resolve => {
            const index = staffMembers.findIndex(s => s.id === id);
            if (index !== -1) {
                staffMembers[index] = { ...staffMembers[index], ...updates };
                setTimeout(() => resolve(staffMembers[index]), 500);
            }
        });
    },

    async deleteStaff(id) {
        return new Promise(resolve => {
            const index = staffMembers.findIndex(s => s.id === id);
            if (index !== -1) {
                staffMembers.splice(index, 1);
            }
            setTimeout(() => resolve(true), 500);
        });
    }
};

export default staffService;
