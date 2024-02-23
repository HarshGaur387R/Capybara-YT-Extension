export default function rateLimiter(max_request, time_frame, message) {

    return (req, res, next) => {

        // 10 Request Per Minute
        const maxRequests = max_request; // Allow 10 requests
        const timeFrame = time_frame; // Per minute : 60*1000

        // Get the client's IP address
        const clientIP = req.ip;

        // Check if the IP address exists in the request counter object
        if (!req.session.requestCounter) {
            req.session.requestCounter = {};
        }

        if (!req.session.requestCounter[clientIP]) {
            req.session.requestCounter[clientIP] = {
                count: 1,
                lastRequest: Date.now(),
            };
        } else {
            const counter = req.session.requestCounter[clientIP];
            const elapsedTime = Date.now() - counter.lastRequest;

            // Check if the maximum number of requests within the time frame has been exceeded
            if (counter.count >= maxRequests && elapsedTime < timeFrame) {
                // Too many requests, send a response indicating rate limit exceeded
                return res.status(429).json({
                    success: false,
                    msg: message,
                });
            }

            // Reset the counter if the time frame has passed
            if (elapsedTime > timeFrame) {
                counter.count = 1;
                counter.lastRequest = Date.now();
            } else {
                counter.count++;
                counter.lastRequest = Date.now();
            }
        }

        // Proceed to the next middleware
        next();
    }
};