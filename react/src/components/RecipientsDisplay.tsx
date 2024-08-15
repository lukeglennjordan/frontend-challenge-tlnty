import { useEffect, useRef, useState, type PropsWithChildren } from 'react'
import styled from 'styled-components'

type RecipientsDisplayProps = PropsWithChildren<{ recipients: string[] }>
function RecipientsDisplay({ recipients, ...rest }: RecipientsDisplayProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const paraRef = useRef<HTMLParagraphElement | null>(null)
  const [hiddenCount, setHiddenCount] = useState<number>(0)

  useEffect(() => {
    const getIsElementVisible = () => {
      const parentRect = paraRef?.current?.getBoundingClientRect()
      const parentWidth = parentRect?.width
      let availableSpace = parentWidth || 0
      let count = 0
      const childrens = paraRef?.current?.children ?? []

      for (let i = 0; i < childrens.length; i++) {
        const child = childrens[i]
        if (child?.textContent !== ', ') {
          const width = childrens[i]?.getBoundingClientRect()?.width ?? 0

          if (
            (i > 0 && availableSpace < 36) ||
            (i === 0 && availableSpace < 13)
          ) {
            count++
          }
          availableSpace = availableSpace - width
        }
      }

      setHiddenCount(count)
    }

    getIsElementVisible()
    window.addEventListener('resize', getIsElementVisible)

    return () => {
      window.removeEventListener('resize', getIsElementVisible)
    }
  }, [])
  return (
    <div ref={containerRef} {...rest}>
      <p ref={paraRef}>
        {recipients.map(text => (
          <>
            <span>{text}</span>
            <span className="comma">, </span>
          </>
        ))}
      </p>
      {hiddenCount ? <div className="badge">+{hiddenCount}</div> : null}
    </div>
  )
}

export default styled(RecipientsDisplay)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .badge {
    padding: 2px 5px;
    border-radius: 3px;
    background: #666666;
    color: #f0f0f0;
    width: fit-content;
  }
  .comma {
    &:last-child {
      display: none;
    }
  }
  .hidden {
    visibility: hidden;
  }
`
