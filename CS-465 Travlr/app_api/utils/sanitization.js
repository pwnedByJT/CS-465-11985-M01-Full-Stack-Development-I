/**
 * SECURITY ENHANCEMENT: Input Sanitization & Validation Utility
 * 
 * This module provides sanitization and validation functions to prevent
 * NoSQL Injection attacks and other input-based vulnerabilities.
 * 
 * SECURITY PRINCIPLE: Input Validation
 * - Sanitizes strings to remove or escape potentially dangerous characters
 * - Validates pagination parameters (page, limit) are within acceptable ranges
 * - Ensures sortBy parameters only allow whitelisted fields
 * 
 * OWASP Top 10 Mitigation:
 * - A3: Injection vulnerabilities prevention
 * - Validates all user-supplied input before database queries
 */

/**
 * Sanitizes a string to prevent NoSQL injection attacks.
 * Removes special characters that could be interpreted as operators.
 * 
 * @param {string} str - Input string to sanitize
 * @returns {string} Sanitized string
 */
const sanitizeString = (str) => {
    if (typeof str !== 'string') {
        return '';
    }
    // Remove NoSQL injection-prone characters: $, {, }
    return str.replace(/[${}]/g, '');
};

/**
 * Validates and sanitizes pagination parameters.
 * Ensures page and limit are positive integers within safe bounds.
 * 
 * @param {number} page - Requested page number
 * @param {number} limit - Requested limit per page
 * @returns {Object} {page, limit} - Validated pagination parameters
 */
const validatePaginationParams = (page, limit) => {
    const MAX_LIMIT = 100;
    const DEFAULT_LIMIT = 10;
    const DEFAULT_PAGE = 1;

    let validPage = parseInt(page) || DEFAULT_PAGE;
    let validLimit = parseInt(limit) || DEFAULT_LIMIT;

    // Security bounds: prevent excessively large queries
    if (validPage < 1) validPage = DEFAULT_PAGE;
    if (validLimit < 1) validLimit = DEFAULT_LIMIT;
    if (validLimit > MAX_LIMIT) validLimit = MAX_LIMIT;

    return { page: validPage, limit: validLimit };
};

/**
 * Validates sortBy parameter against whitelist of allowed fields.
 * Prevents NoSQL injection through sort parameter manipulation.
 * 
 * @param {string} sortBy - Sort field from request
 * @param {Array<string>} allowedFields - Whitelisted fields for sorting
 * @returns {string} Validated sort field or default
 */
const validateSortField = (sortBy, allowedFields = ['start', 'name', 'code']) => {
    if (!sortBy || typeof sortBy !== 'string') {
        return 'start'; // Default sort field
    }

    const sanitized = sanitizeString(sortBy);
    
    // Only allow whitelisted fields
    if (allowedFields.includes(sanitized)) {
        return sanitized;
    }

    return 'start'; // Default if not in whitelist
};

/**
 * Sanitizes request body data to prevent NoSQL injection in updates.
 * Recursively sanitizes all string values in the object.
 * 
 * @param {Object} data - Request body data
 * @returns {Object} Sanitized data object
 */
const sanitizeObjectData = (data) => {
    if (!data || typeof data !== 'object') {
        return {};
    }

    const sanitized = {};
    
    for (const [key, value] of Object.entries(data)) {
        // Sanitize the key
        const sanitizedKey = sanitizeString(key);
        
        // Sanitize string values
        if (typeof value === 'string') {
            sanitized[sanitizedKey] = sanitizeString(value);
        } else if (Array.isArray(value)) {
            // Recursively sanitize array elements
            sanitized[sanitizedKey] = value.map(item =>
                typeof item === 'string' ? sanitizeString(item) : item
            );
        } else if (value !== null && typeof value === 'object') {
            // Recursively sanitize nested objects
            sanitized[sanitizedKey] = sanitizeObjectData(value);
        } else {
            // Keep non-string values as-is (numbers, booleans, null)
            sanitized[sanitizedKey] = value;
        }
    }

    return sanitized;
};

module.exports = {
    sanitizeString,
    validatePaginationParams,
    validateSortField,
    sanitizeObjectData
};
