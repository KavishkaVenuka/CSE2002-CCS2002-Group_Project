import express from 'express';
import { getAdminDashboardStats, getCustomerDashboardStats } from '../controllers/dashboardController.js';
import { requireAuth } from '../middleware/auth.js';

const dashboardRouter = express.Router();

dashboardRouter.get('/admin-stats', requireAuth, getAdminDashboardStats);
dashboardRouter.get('/customer-stats', requireAuth, getCustomerDashboardStats);

export default dashboardRouter;
