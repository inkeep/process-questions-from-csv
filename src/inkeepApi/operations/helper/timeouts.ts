// timeouts.ts

// Timeout values in milliseconds
const FIRST_RESPONSE_TIMEOUT = 30000; // 30 seconds
const COMPLETE_RESPONSE_TIMEOUT = 180000; // 180 seconds

export const setupTimeouts = (
    reject: (reason?: any) => void,
    subscription: { unsubscribe: () => void }
) => {
    const firstResponseTimeoutSeconds = FIRST_RESPONSE_TIMEOUT / 1000;
    const completeResponseTimeoutSeconds = COMPLETE_RESPONSE_TIMEOUT / 1000;

    const firstResponseTimeout = setTimeout(() => {
        console.error(`Timeout error: ${firstResponseTimeoutSeconds} seconds passed without a response`); // Log the error
        reject(new Error(`Timeout: ${firstResponseTimeoutSeconds} seconds passed without a response`));
    }, FIRST_RESPONSE_TIMEOUT);

    // Unsubscribe after 180 seconds.
    const completeResponseTimeout = setTimeout(() => {
        console.warn(`Timeout warning: ${completeResponseTimeoutSeconds} seconds passed without completion. Unsubscribing.`); // Log the timeout warning
        subscription.unsubscribe();
        reject(new Error(`Timeout: ${completeResponseTimeoutSeconds} seconds passed without completion`));
    }, COMPLETE_RESPONSE_TIMEOUT);

    return { firstResponseTimeout, completeResponseTimeout };
};

export const clearResponseTimeout = (
    timeouts: { firstResponseTimeout: NodeJS.Timeout; completeResponseTimeout: NodeJS.Timeout }
) => {
    clearTimeout(timeouts.firstResponseTimeout);
    clearTimeout(timeouts.completeResponseTimeout);
};
