import { Resend } from "resend";
// import { render } from "@react-email/render";
import AffiliatePendingEmail from "@/components/EmailTemplates/affiliate-pending-email";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAffiliatePendingEmail({
    name,
    to,
}: {
    name: string;
    to: string;
}) {
    //   const html = await render(<AffiliatePendingEmail name={name} />);

    try {
        const data = await resend.emails.send({
            from: 'The Mana Restaurant Affiliate <affiliate@mail.themannafood.com>',
            // from: "The Mana <no-reply@themana.com>",
            to: to,
            subject: "Your Affiliate Request is Pending Approval",
            react: AffiliatePendingEmail({ name: name }),
        });

        return { success: true, data };
    } catch (error) {
        console.error("Error sending affiliate email:", error);
        return { success: false, error };
    }
}
