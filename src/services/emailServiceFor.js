import Mailgun from "mailgun-js";
const domain = process.env.MG_DOMAIN_NAME;
const apiKey = process.env.MG_API_KEY
const mg = Mailgun({ apiKey, domain });

export const emailServiceFor = user => {
    return (subject, body) => {
        return new Promise((resolve, reject) => {
            mg.messages().send({
                from: 'TriFrame <admin@triframe.io>',
                to: `${user.name}, ${user.email}`,
                subject: subject,
                html: body
            }, function (error, body) {
                error ? reject(error) : resolve(body);
            });
        })
    }
}