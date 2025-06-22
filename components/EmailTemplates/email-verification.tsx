import type React from "react"

interface VerificationCodeEmailProps {
  username?: string
  code: string
  companyName?: string
  companyAddress?: string
  companyLogo?: string
  expiryMinutes?: number
}

export default function VerificationCodeEmail({
  username = "there",
  code = "",
  companyName = "Your Company",
  companyAddress = "123 Main St, City, Country",
  companyLogo = "/placeholder.svg?height=60&width=200",
  expiryMinutes = 10,
} ) {
  return (
    <div
      style={{
        fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        maxWidth: "600px",
        margin: "0 auto",
        color: "#333333",
        backgroundColor: "#f4f4f7",
        padding: "20px",
      }}
    >
      {/* Header */}
      <table width="100%" cellPadding="0" cellSpacing="0" role="presentation" style={{ marginBottom: "16px" }}>
        <tbody>
          <tr>
            <td align="center" style={{ padding: "20px 0" }}>
              <img
                src={companyLogo}
                alt={`${companyName} logo`}
                style={{ height: "60px", maxWidth: "200px", display: "block" }}
                width={200}
                height={60}
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* Body */}
      <table
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        role="presentation"
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #eaeaea",
          borderRadius: "5px",
        }}
      >
        <tbody>
          <tr>
            <td style={{ padding: "40px 30px" }}>
              <h1 style={{ fontSize: "24px", margin: "0 0 24px", color: "#000000" }}>
                Your Verification Code
              </h1>

              <p style={{ fontSize: "16px", margin: "0 0 24px" }}>Hello {username},</p>

              <p style={{ fontSize: "16px", margin: "0 0 24px" }}>
                Use the code below to verify your account. This code will expire in {expiryMinutes} minutes.
              </p>

              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  letterSpacing: "4px",
                  backgroundColor: "#f5f5f5",
                  padding: "16px",
                  textAlign: "center",
                  borderRadius: "6px",
                  margin: "0 0 24px",
                }}
              >
                {code}
              </div>

              <p style={{ fontSize: "16px", margin: "0 0 24px" }}>
                If you did not request this code, you can safely ignore this email.
              </p>

              <p style={{ fontSize: "16px", margin: "0" }}>
                Best regards,
                <br />
                The {companyName} Team
              </p>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Footer */}
      <table width="100%" cellPadding="0" cellSpacing="0" role="presentation" style={{ marginTop: "24px" }}>
        <tbody>
          <tr>
            <td align="center" style={{ fontSize: "14px", color: "#666666", padding: "16px 0" }}>
              <p style={{ margin: "0 0 8px" }}>
                &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
              </p>
              <p style={{ margin: "0 0 8px" }}>{companyAddress}</p>
              <p style={{ margin: "0" }}>
                <a href="#" style={{ color: "#666666", textDecoration: "underline" }}>
                  Privacy Policy
                </a>{" "}
                |{" "}
                <a href="#" style={{ color: "#666666", textDecoration: "underline", marginLeft: "8px" }}>
                  Unsubscribe
                </a>
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
