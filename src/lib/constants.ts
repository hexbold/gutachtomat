/**
 * Show the development warning banner only in production.
 * In local development, the original layout without banner is shown.
 */
export const SHOW_DEV_BANNER = process.env.NODE_ENV === 'production';
