export const ticketTemplate = (tickets: any[]) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Endgame | What's Your Endgame?</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- Bebas Neue & Onest Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Onest:wght@400;600&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Onest:wght@400;600&display=swap');
    
    body { 
      font-family: 'Onest', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
      background: #ffffff;
      margin: 0;
      padding: 0;
    }
    .title { 
      font-family: 'Bebas Neue', Impact, 'Arial Black', sans-serif; 
    }
    .vvip-label {
      color: #111;
      font-weight: 600;
      font-size: 18px;
      margin-bottom: 16px;
      font-family: 'Onest', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      text-transform: uppercase;
      height: 24px;
      line-height: 24px;
    }
    
    .qr-img {
      width: 200px;
      height: 200px;
      object-fit: contain;
      margin-right: 1.5rem;
    }
    .info-icon {
      width: 24px;
      height: 24px;
      margin-right: 0.5rem;
    }
    .info-row {
      margin-bottom: 1rem;
      height: 24px;
    }
    .info-row-location {
      margin-bottom: 1rem;
      height: 24px;
    }
    .info-text {
      font-size: 14px;
      color: #374151;
      line-height: 24px;
      font-family: 'Onest', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }
    .ticket-card {
      border: 1px solid #000;
      background: #ffffff;
      padding: 1rem;
      margin: 2rem auto;
      max-width: 605px;
      width: 100%;
      box-sizing: border-box;
    }
    .divider {
      border-top: 1px solid #e5e7eb;
      margin: 1.5rem 0;
    }
  </style>
</head>
<body class="bg-white min-h-screen flex flex-col items-center justify-start">
    ${tickets
      .map(
        (ticket, idx) => `
      <div class="ticket-card">
        <div class="text-center mb-4 tracking-wide title" style="font-size:26px;">
          ${ticket.eventOrganizerName} | ${ticket.eventName}
        </div>
        <div class="vvip-label">
          ${ticket.type} #${idx + 1}
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="547" height="2" viewBox="0 0 547 2" fill="none">
          <path d="M0 1H547" stroke="#585C71" stroke-width="0.5" stroke-dasharray="4 4"/>
        </svg>
        <div class="flex mt-4">
          <img class="qr-img" src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticket.qrValue}" alt="QR Code">
          <div>
            <div class="mb-4 title" style="font-size:22px;">${ticket.attendee}</div>
            <table class="info-row">
              <tr>
                <td style="vertical-align: middle; padding: 0;">
                  <svg class="info-icon" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M16.5 12C17.3284 12 18 12.6716 18 13.5C18 14.3284 17.3284 15 16.5 15C15.6716 15 15 14.3284 15 13.5C15 12.6716 15.6716 12 16.5 12Z" fill="black"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8 2C8.55228 2 9 2.44772 9 3H15C15 2.44772 15.4477 2 16 2H17C17.5523 2 18 2.44772 18 3H19C20.6569 3 22 4.34315 22 6L21.9961 19.1543C21.9961 20.5 20.5 21.9961 19.1543 21.9961L17.5 22H8L4.8457 21.9961C3.5 21.9961 2.00391 20.5 2.00391 19.1543L2 6C2 4.34315 3.34315 3 5 3H6C6 2.44772 6.44772 2 7 2H8ZM4 19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.5523 20 19V10H4V19Z" fill="black"/>
                  </svg>
                </td>
                <td style="vertical-align: middle; padding: 0;">
                  <span class="info-text">${ticket.date}</span>
                </td>
              </tr>
            </table>
            <table class="info-row-location">
              <tr>
                <td style="vertical-align: top; padding: 0;">
                  <svg class="info-icon" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 2C16.4182 2 19.9999 5.65691 20 10.168C20 14.6978 15.7277 18.7055 12.7119 21.7051C12.3163 22.0986 11.6837 22.0986 11.2881 21.7051C8.27233 18.7056 4 14.6985 4 10.168C4.00008 5.65691 7.58177 2 12 2ZM12 6C9.79086 6 8 7.79086 8 10C8 12.2091 9.79086 14 12 14C14.2091 14 16 12.2091 16 10C16 7.79086 14.2091 6 12 6Z" fill="black"/>
                  </svg>
                </td>
                <td style="vertical-align: top; padding: 0;">
                  <span class="info-text">${ticket.address}</span>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    `
      )
      .join('')}
</body>
</html>`;
