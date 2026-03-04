export const withEmailLayout = (title: string, content: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0;
            background-color: #f4f7f9;
        }
        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #f4f7f9;
            padding-bottom: 40px;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            margin-top: 40px;
        }
        .header { 
            padding: 40px 40px 20px 40px;
            text-align: center;
        }
        .logo {
            display: inline-block;
            margin-bottom: 24px;
        }
        .logo-text { 
            font-size: 22px; 
            font-weight: 800; 
            letter-spacing: -0.02em; 
            color: #000; 
            margin: 0;
            text-decoration: none;
        }
        .logo-accent { color: #0070f3; }
        h1 { 
            font-size: 26px; 
            font-weight: 700; 
            color: #111; 
            margin: 0 0 24px 0;
            line-height: 1.2;
        }
        .content { 
            padding: 0 40px 40px 40px;
            font-size: 16px; 
            color: #444; 
        }
        .footer { 
            padding: 32px 40px;
            background-color: #fafbfc;
            border-top: 1px solid #edf2f7;
            text-align: center;
            font-size: 14px; 
            color: #718096; 
        }
        .footer p { margin: 8px 0; }
        .footer a { color: #718096; text-decoration: underline; }
        .button { 
            display: inline-block;
            background-color: #000; 
            color: #ffffff !important; 
            text-decoration: none; 
            padding: 14px 32px; 
            border-radius: 8px; 
            font-weight: 600; 
            font-size: 16px; 
            margin: 30px 0;
            transition: background-color 0.2s ease;
        }
        .highlight-box {
            background-color: #f8fafc;
            border-left: 4px solid #0070f3;
            padding: 20px;
            margin: 24px 0;
            border-radius: 0 8px 8px 0;
        }
        @media only screen and (max-width: 600px) {
            .container {
                margin-top: 0;
                border-radius: 0;
            }
            .header, .content, .footer {
                padding-left: 24px;
                padding-right: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <div class="logo">
                    <img src="https://www.codencognition.com/Main-Logo.png" alt="Code & Cognition" width="50" style="display: block; margin: 0 auto 12px auto;">
                    <div class="logo-text">Code<span class="logo-accent">&</span>Cognition</div>
                </div>
                <h1>${title}</h1>
            </div>
            <div class="content">
                ${content}
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Code & Cognition. All rights reserved.</p>
                <p>
                    <a href="https://www.codencognition.com">Website</a> &bull; 
                    <a href="mailto:codencognition.bd@gmail.com">Support</a>
                </p>
                <p style="font-size: 12px; color: #a0aec0; margin-top: 16px;">
                    Empowering businesses with intelligent digital solutions.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
`;
