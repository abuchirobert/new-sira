import { Response } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Generates a JWT token.
 * @param {string} userId - The user ID.
 * @returns {string} - The generated token.
 */

export const generateToken = (res: Response, user: { _id: string }): string => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '30d' });

    if (!token) {
        throw new Error('Token not generated');
    }
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        partitioned: true,
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
    console.log(`Token generated for user ${user._id}`);

    return token;
};
