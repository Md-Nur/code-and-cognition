NEXT_PUBLIC_GA_ID (Google Analytics)
What it is: Your Google Analytics 4 (GA4) Measurement ID. It tells Google which account to send the analytics data to.
Where to find it: In your Google Analytics dashboard, go to Admin (gear icon) -> Data Streams -> Click on your website stream. You will see a "Measurement ID" that starts with G- (e.g., G-12345ABCDE).

NEXT_PUBLIC_META_PIXEL_ID (Meta Pixel)
What it is: Your Facebook/Meta Pixel ID used for standard browser tracking.
Where to find it: Go to your Meta Events Manager -> Data Sources. Click on your Pixel, and you will see the "Pixel ID" (usually a 15-16 digit number).

META_CAPI_TOKEN (Meta Conversions API Token)
What it is: This is a secure access token used by your backend server to securely send events directly to Facebook's servers, bypassing ad blockers. This is the Advanced Analytics feature we just built!
Where to find it:
Go to your Meta Events Manager -> Data Sources -> Select your Pixel.
Click on the Settings tab.
Scroll down to the Conversions API section.
Under the "Set up direct integration" section, click the Generate Access Token link.
Copy that long string of text and paste it into your 

.env
 file. (Keep this secret, which is why it doesn't have NEXT_PUBLIC_ in the name).