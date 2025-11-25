import React from 'react';

/**
 * Highlights matching keywords in text with a yellow/orange background
 * Treats the entire search string as a phrase first, then falls back to individual words
 * @param text - The text to search and highlight in
 * @param keywords - The search keywords/phrase to highlight
 * @returns JSX with highlighted matches
 */
export function highlightKeywords(
  text: string,
  keywords: string | undefined
): React.ReactNode {
  if (!keywords || !keywords.trim() || !text) {
    return text;
  }

  const trimmedKeywords = keywords.trim();

  // First, try to match the entire phrase as-is (case-insensitive)
  const escapedPhrase = trimmedKeywords.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const phraseRegex = new RegExp(`(${escapedPhrase})`, 'gi');

  // Check if the phrase exists in the text
  if (phraseRegex.test(text)) {
    // Highlight the complete phrase
    const parts = text.split(phraseRegex);

    return (
      <>
        {parts.map((part, index) => {
          const isMatch = part.toLowerCase() === trimmedKeywords.toLowerCase();

          if (isMatch) {
            return (
              <mark
                key={index}
                className="bg-orange-200 text-gray-900 font-medium px-1 rounded"
                style={{ backgroundColor: '#fed7aa' }}
              >
                {part}
              </mark>
            );
          }

          return <React.Fragment key={index}>{part}</React.Fragment>;
        })}
      </>
    );
  }

  // Fallback: If phrase not found, split by words and highlight individually
  const keywordArray = trimmedKeywords.split(/\s+/).filter((k) => k.length > 0);

  if (keywordArray.length === 0) {
    return text;
  }

  // Create a regex pattern that matches any of the keywords (case-insensitive)
  const pattern = keywordArray
    .map((keyword) => keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');

  const regex = new RegExp(`(${pattern})`, 'gi');

  // Split text by matches and wrap matches in highlight spans
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        // Check if this part matches any keyword (case-insensitive)
        const isMatch = keywordArray.some(
          (keyword) => keyword.toLowerCase() === part.toLowerCase()
        );

        if (isMatch) {
          return (
            <mark
              key={index}
              className="bg-orange-200 text-gray-900 font-medium px-1 rounded"
              style={{ backgroundColor: '#fed7aa' }}
            >
              {part}
            </mark>
          );
        }

        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </>
  );
}
