import { useEffect, useState, useRef } from 'react';

type RecipientsDisplayProps = {
  recipients: string[];
};

function RecipientsDisplay({ recipients }: RecipientsDisplayProps) {
  const [displayedRecipients, setDisplayedRecipients] = useState('');
  const [trimmedCount, setTrimmedCount] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateDisplay = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      let currentWidth = 0;
      let result = '';
      let count = 0;

      for (let i = 0; i < recipients.length; i++) {
        const recipient = recipients[i];
        const recipientWidth = measureTextWidth(recipient);

        if (currentWidth + recipientWidth > containerWidth) {
          if (i === 0) {
            result = `${recipient.slice(0, Math.floor(containerWidth / 8))}...`;
            count = recipients.length - 1;
          } else {
            result = result.slice(0, -2) + '...';
            count = recipients.length - i;
          }
          break;
        }

        result += recipient + ', ';
        currentWidth += recipientWidth + measureTextWidth(', ');
      }

      setDisplayedRecipients(result.trimEnd().replace(/,$/, ''));
      setTrimmedCount(count);
    };

    const measureTextWidth = (text: string) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (context) {
        context.font = '16px Arial';
        return context.measureText(text).width;
      }
      return 0;
    };

    updateDisplay();
    window.addEventListener('resize', updateDisplay);

    return () => {
      window.removeEventListener('resize', updateDisplay);
    };
  }, [recipients]);

  return (
    <div className="outer-wrapper" ref={containerRef}>
      <div id="data-space">{displayedRecipients}</div>
      {trimmedCount > 0 && <div className="badge">+{trimmedCount}</div>}
    </div>
  );
}

export default RecipientsDisplay;