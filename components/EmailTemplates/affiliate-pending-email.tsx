import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
} from "@react-email/components";

interface AffiliatePendingEmailProps {
  name: string;
}

export default function AffiliatePendingEmail({ name }: AffiliatePendingEmailProps) {
  const currentYear = new Date().getFullYear();

  return (
    <Html lang="en">
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={section}>
            <Heading style={heading}>Affiliate Request Submitted</Heading>
            <Text style={text}>Hi {name},</Text>
            <Text style={text}>
              {"We've received your request to become an affiliate on "}
              <strong>The Mana</strong>
              {"."} Your application is currently under review.
            </Text>
            <Text style={text}>
              You&#39;ll be notified once your request is approved or declined.
            </Text>
            <Text style={warning}>
              ⚠️ Please do not submit multiple affiliate requests. Doing so may result in your account being flagged or blocked.
            </Text>
            <Text style={text}>
              Thanks again for your interest!
            </Text>
            <Text style={footer}>
              &copy; {currentYear} The Mana. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f9fafb",
  padding: "20px 0",
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
  padding: "32px",
  maxWidth: "600px",
  margin: "0 auto",
};

const section = {
  width: "100%",
};

const heading = {
  fontSize: "20px",
  color: "#10b981",
  fontWeight: "bold",
  marginBottom: "24px",
};

const text = {
  fontSize: "16px",
  color: "#111827",
  marginBottom: "16px",
};

const warning = {
  fontSize: "15px",
  color: "#b91c1c",
  backgroundColor: "#fef2f2",
  borderRadius: "6px",
  padding: "12px",
  marginBottom: "20px",
};

const footer = {
  fontSize: "13px",
  color: "#6b7280",
  borderTop: "1px solid #e5e7eb",
  paddingTop: "20px",
  textAlign: "center" as const,
};
