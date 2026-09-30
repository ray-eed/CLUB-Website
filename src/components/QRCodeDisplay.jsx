// components/QRCodeDisplay.jsx
//
// A reusable component that renders a member's personal QR code.
// The QR code encodes their Firebase uid as plain text.
// When an admin scans it, they get the uid and can log attendance.
//
// Used on:
//   - Profile page (member sees their own QR)
//   - Attendance page (display for testing/demo)

import QRCode from 'react-qr-code'

function QRCodeDisplay({ uid, name }) {
  if (!uid) return null

  return (
    <div className="flex flex-col items-center gap-4">
      {/* White background is required — QR codes need high contrast */}
      <div className="bg-white p-4 rounded-2xl shadow-2xl shadow-black/40">
        <QRCode
          value={uid}
          size={180}
          bgColor="#ffffff"
          fgColor="#141414"
          level="M"        // M = medium error correction (good balance)
        />
      </div>

      {/* Label below the QR */}
      <div className="text-center">
        <p className="font-display text-base text-white/80">
          {name ?? 'Member'}
        </p>
        <p className="font-body text-xs text-white/30 mt-1">
          Show this to an admin at events
        </p>
        {/* Show a truncated uid for debugging */}
        <p className="font-body text-[10px] text-white/20 mt-1 font-mono">
          {uid.slice(0, 16)}…
        </p>
      </div>
    </div>
  )
}

export default QRCodeDisplay
