"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.claimCoupon = void 0;
const circularQueue_1 = require("../utils/circularQueue");
const coupons = [
    { code: 'COUPON1', claimed: false },
    { code: 'COUPON2', claimed: false },
    { code: 'COUPON3', claimed: false }
];
const queue = new circularQueue_1.CircularQueue(coupons);
const ipClaims = new Map(); // IP tracking
const TIME_LIMIT = 60 * 60 * 1000; // 1 hour in milliseconds
const claimCoupon = (req, res) => {
    const ip = req.ip;
    if (!ip) {
        return res.status(400).json({ message: 'Could not determine client IP address' });
    }
    const existingClaim = ipClaims.get(ip);
    if (existingClaim) {
        const timeElapsed = Date.now() - existingClaim.timestamp;
        if (timeElapsed < TIME_LIMIT) {
            const remaining = Math.ceil((TIME_LIMIT - timeElapsed) / 1000);
            return res.status(429).json({
                message: `Please wait ${remaining} seconds before claiming again`
            });
        }
    }
    const coupon = queue.getNext();
    ipClaims.set(ip, { timestamp: Date.now(), couponCode: coupon.code });
    res.cookie('lastClaim', Date.now().toString(), { maxAge: TIME_LIMIT, httpOnly: true });
    res.json({ message: 'Coupon claimed successfully', coupon: coupon.code });
};
exports.claimCoupon = claimCoupon;
