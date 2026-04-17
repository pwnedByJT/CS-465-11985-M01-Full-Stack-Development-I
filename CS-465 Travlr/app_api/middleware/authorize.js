/**
 * SECURITY ENHANCEMENT: Role-Based Access Control (RBAC) Middleware
 * 
 * This middleware implements authorization checks to ensure that only users
 * with the 'admin' role can perform sensitive operations (create, update, delete).
 * 
 * SECURITY PRINCIPLE: Defense in Depth
 * - Verifies JWT payload contains role information
 * - Ensures only authorized users can modify trip data
 * - Returns 403 Forbidden for unauthorized access attempts
 * 
 * @param {Request} req - Express request object with JWT payload
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
const authorize = (req, res, next) => {
    // Security Check: Verify JWT payload exists and contains role
    if (!req.payload || !req.payload.role) {
        return res.status(401).json({
            "message": "Unauthorized: Invalid or missing authentication token"
        });
    }

    // Security Check: Verify user has admin role
    if (req.payload.role !== 'admin') {
        return res.status(403).json({
            "message": "Forbidden: Admin privileges required for this operation"
        });
    }

    // Authorization passed, proceed to next middleware/handler
    next();
};

module.exports = authorize;
