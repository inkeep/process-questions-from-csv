import XRegExp from 'xregexp';

/**
 * removeCitations - removes citations from a given message
 * 
 * @param message - The message string from which citations need to be removed.
 * @returns - A string without any citations.
 */
export function removeCitations(message: string): string {
    // Using the provided citation pattern to match citations in the message.
    const citationsRegex = XRegExp('\\[\\^(\\d+)(?:\\^)?\\]', 'g');
    
    // Removing matched citations.
    return XRegExp.replace(message, citationsRegex, '');
}
