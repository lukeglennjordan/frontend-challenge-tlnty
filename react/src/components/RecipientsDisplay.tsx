import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';

interface RecipientsDisplayProps {
    recipients: string[];
}

const RecipientsDisplay: React.FC<RecipientsDisplayProps> = ({ recipients }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [displayedRecipients, setDisplayedRecipients] = useState<string[]>([]);
    const [trimmedCount, setTrimmedCount] = useState(0);

    const calculateDisplay = () => {
        if (!containerRef.current) return;

        const containerWidth = containerRef.current.offsetWidth;
        let width = 0;
        let lastIndex = -1;

        const ellipsisWidth = getTextWidth('...', '16px Arial');
        const badgeWidth = getTextWidth(`+${recipients.length}`, '16px Arial') + 10; // Approximate width of the "+N" badge

        for (let i = 0; i < recipients.length; i++) {
            const recipientWidth = getTextWidth(recipients[i], '16px Arial');
            const separatorWidth = i > 0 ? getTextWidth(', ', '16px Arial') : 0;

            if (width + recipientWidth + separatorWidth + ellipsisWidth + badgeWidth > containerWidth) {
                break;
            }

            width += recipientWidth + separatorWidth;
            lastIndex = i;
        }

        setDisplayedRecipients(recipients.slice(0, lastIndex + 1));
        setTrimmedCount(recipients.length - lastIndex - 1);
    };

    useEffect(() => {
        calculateDisplay();
        window.addEventListener('resize', calculateDisplay);
        return () => window.removeEventListener('resize', calculateDisplay);
    }, [recipients]);

    return (
        <Container ref={containerRef}>
            <RecipientsText>
                {displayedRecipients.join(', ')}
                {trimmedCount > 0 && '...'}
            </RecipientsText>
            {trimmedCount > 0 && (
                <Badge>+{trimmedCount}</Badge>
            )}
        </Container>
    );
};

// Helper function to calculate the width of a given text with a specific font
const getTextWidth = (text: string, font: string) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
        context.font = font;
        return context.measureText(text).width;
    }
    return 0;
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  font-size: 16px;
  color: #333333;
`;

const RecipientsText = styled.span`
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Badge = styled.span`
  flex-shrink: 0;
  margin-left: 5px;
  font-size: 16px;
  color: #f0f0f0;
  background-color: #666666;
  border-radius: 3px;
  padding: 2px 5px;
`;

export default RecipientsDisplay;
