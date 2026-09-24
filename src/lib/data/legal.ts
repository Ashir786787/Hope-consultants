export type LegalSlug =
  | "privacy"
  | "terms"
  | "refunds"
  | "disclaimer"
  | "cookies";

export interface LegalPage {
  slug: LegalSlug;
  title: string;
  lastUpdated: string;
  sections: Array<{ heading: string; body: string }>;
}

export const legalPages: LegalPage[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    lastUpdated: "[Date]",
    sections: [
      {
        heading: "Who we are",
        body: "Hope Consultants is a study-abroad consultancy. We provide education guidance, admissions support and related services to students and their families.",
      },
      {
        heading: "Information we collect",
        body: "We collect information you give us directly: your name, contact details, academic records, financial information, documents you submit for applications, and any other information you choose to provide when using our services or contacting us. We also collect limited technical data automatically, such as your IP address, browser type and pages visited, through cookies and similar technologies.",
      },
      {
        heading: "How we use your information",
        body: "We use your information to provide and improve our services, to process your applications and enquiries, to verify offers and institutions on your behalf, to comply with legal obligations, and to communicate with you about your case. We do not use your information for automated decision-making or profiling.",
      },
      {
        heading: "Who we share it with",
        body: "We share your information only where necessary: with universities, scholarship bodies, immigration authorities and service providers involved in your application, and where required by law. We never sell your data.",
      },
      {
        heading: "How long we keep it",
        body: "We keep your information only for as long as necessary to provide our services and to meet legal and regulatory obligations. When it is no longer needed, we delete or anonymise it.",
      },
      {
        heading: "Your rights",
        body: "You have the right to access, correct, delete or restrict our use of your personal information, and to withdraw consent at any time. To exercise any of these rights, contact us at [Official Email].",
      },
      {
        heading: "Security",
        body: "We take reasonable technical and organisational measures to protect your information from unauthorised access, loss or misuse. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.",
      },
      {
        heading: "Changes to this policy",
        body: "We may update this policy from time to time. The latest version will always be published on this page, and material changes will be communicated to you directly where appropriate.",
      },
      {
        heading: "Contact",
        body: "If you have any questions about this Privacy Policy, contact us at [Official Email].",
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of Service",
    lastUpdated: "[Date]",
    sections: [
      {
        heading: "Agreement",
        body: "By engaging Hope Consultants, you agree to these Terms of Service. If you do not agree, please do not use our services. Please read them carefully before paying any fee.",
      },
      {
        heading: "Our services",
        body: "We provide education guidance, university and program selection, admission application support, scholarship guidance, document preparation, visa support, pre-enrollment support and pre-departure support. Specific deliverables are agreed with you in writing before work begins.",
      },
      {
        heading: "Your responsibilities",
        body: "You are responsible for providing accurate, complete and truthful information and documents, for meeting all deadlines communicated to you, for paying fees on time, and for complying with the requirements of universities, scholarship bodies and immigration authorities. Providing false information may result in rejection of applications or refusal of visas.",
      },
      {
        heading: "Our responsibilities",
        body: "We will provide our services with reasonable care, skill and honesty. We will tell you honestly what is and is not realistic for your profile. We do not control and cannot guarantee the decisions of universities, scholarship bodies or immigration authorities. We do not promise admission, scholarships or visas.",
      },
      {
        heading: "Fees",
        body: "Fees are agreed with you in writing before any work begins. Fees are non-refundable once work has commenced, except as set out in our Refund & Fee Policy.",
      },
      {
        heading: "Third-party services",
        body: "Our services may involve third parties, including universities, scholarship bodies, translation services and immigration authorities. We are not responsible for their acts, omissions, decisions or timelines.",
      },
      {
        heading: "Liability",
        body: "To the maximum extent permitted by law, our total liability arising from or in connection with our services shall not exceed the fees you have paid to us for the specific service giving rise to the claim. We are not liable for indirect, incidental or consequential losses.",
      },
      {
        heading: "Termination",
        body: "You may terminate our engagement at any time by written notice. We may terminate our engagement if you fail to meet your responsibilities, provide false information, or fail to pay fees. Fees for work already performed remain payable.",
      },
      {
        heading: "Governing law",
        body: "These terms are governed by the laws of Pakistan. Any disputes shall be subject to the exclusive jurisdiction of the courts of Pakistan.",
      },
      {
        heading: "Changes to these terms",
        body: "We may update these terms from time to time. The latest version will always be published on this page. Continued use of our services after changes constitutes acceptance of the revised terms.",
      },
      {
        heading: "Contact",
        body: "If you have any questions about these Terms of Service, contact us at [Official Email].",
      },
    ],
  },
  {
    slug: "refunds",
    title: "Refund & Fee Policy",
    lastUpdated: "[Date]",
    sections: [
      {
        heading: "Our fee principle",
        body: "Our fees reflect the work actually performed on your case. We explain every fee clearly and in writing before any payment is requested. We do not charge hidden fees, and we do not charge for the first consultation.",
      },
      {
        heading: "When fees are non-refundable",
        body: "Once work has commenced on your case, fees are non-refundable. This includes, without limitation: counselling and profile assessment completed; shortlists and program selections prepared; applications submitted on your behalf; documents prepared, translated or reviewed; scholarship and visa guidance delivered; and any work already performed, even if you terminate the engagement.",
      },
      {
        heading: "When a refund may apply",
        body: "A refund may be considered where we have failed to perform a service you have paid for, and the failure is attributable to us. Refund requests must be made in writing within 14 days of the relevant fee becoming payable.",
      },
      {
        heading: "No outcome guarantee",
        body: "We do not guarantee admission, scholarship awards, or visa outcomes. Decisions rest with universities, scholarship bodies and immigration authorities. Fees are payable for our work, not for a specific outcome, and are therefore not contingent on that outcome.",
      },
      {
        heading: "Third-party fees",
        body: "Any fees paid directly to universities, scholarship bodies, translation services, immigration authorities or other third parties are governed by their own refund policies. We cannot refund third-party fees on their behalf.",
      },
      {
        heading: "How to request a refund",
        body: "Send your request in writing to [Official Email], including your name, the service paid for, the date of payment, and the reason for the request. We will respond within 14 working days.",
      },
      {
        heading: "Changes to this policy",
        body: "We may update this policy from time to time. The latest version will always be published on this page.",
      },
      {
        heading: "Contact",
        body: "If you have any questions about this Refund & Fee Policy, contact us at [Official Email].",
      },
    ],
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    lastUpdated: "[Date]",
    sections: [
      {
        heading: "General information",
        body: "The information on this website is provided for general guidance only. It does not constitute legal, immigration, financial or educational advice, and it should not be relied upon as a substitute for professional advice specific to your circumstances.",
      },
      {
        heading: "No guarantees",
        body: "We do not guarantee admission, scholarship awards, or visa outcomes. Decisions rest with universities, scholarship bodies and immigration authorities. Our role is to prepare and guide your application honestly and thoroughly.",
      },
      {
        heading: "Accuracy of information",
        body: "We take reasonable care to keep the information on this website accurate and current. However, tuition fees, scholarship amounts, deadlines, immigration rules and university requirements change frequently and without notice. Always confirm the current requirements directly with the relevant university, scholarship body or immigration authority before acting on any information presented here.",
      },
      {
        heading: "External links",
        body: "This website may contain links to third-party websites. We provide these links for convenience and do not endorse or accept responsibility for the content, accuracy or availability of any external site.",
      },
      {
        heading: "Limitation of liability",
        body: "To the maximum extent permitted by law, Hope Consultants shall not be liable for any loss or damage arising from reliance on the general information provided on this website.",
      },
      {
        heading: "Changes to this disclaimer",
        body: "We may update this disclaimer from time to time. The latest version will always be published on this page.",
      },
      {
        heading: "Contact",
        body: "If you have any questions about this Disclaimer, contact us at [Official Email].",
      },
    ],
  },
  {
    slug: "cookies",
    title: "Cookie Notice",
    lastUpdated: "[Date]",
    sections: [
      {
        heading: "What are cookies",
        body: "Cookies are small text files stored on your device when you visit a website. They help the website remember your actions and preferences over time.",
      },
      {
        heading: "How we use cookies",
        body: "We use cookies to operate this website, remember your preferences, understand how visitors use our site, and improve our content and performance. We do not use cookies to collect personal information without your knowledge, and we do not sell data collected through cookies.",
      },
      {
        heading: "Types of cookies we use",
        body: "Strictly necessary cookies: required for the website to function. Preference cookies: remember your settings. Analytics cookies: help us understand how visitors interact with our website so we can improve it. Marketing cookies: may be used to measure the effectiveness of our outreach, where applicable.",
      },
      {
        heading: "Managing cookies",
        body: "You can control and delete cookies through your browser settings. Blocking some cookies may affect the functionality of this website. Most browsers allow you to refuse or accept cookies, and to delete cookies already stored on your device.",
      },
      {
        heading: "Third-party cookies",
        body: "Some cookies may be set by third-party services embedded in our pages, such as analytics providers. We do not control these cookies and recommend reviewing the relevant third-party privacy policies.",
      },
      {
        heading: "Changes to this notice",
        body: "We may update this notice from time to time. The latest version will always be published on this page.",
      },
      {
        heading: "Contact",
        body: "If you have any questions about this Cookie Notice, contact us at [Official Email].",
      },
    ],
  },
];

export function getLegalPage(slug: string): LegalPage | undefined {
  return legalPages.find((page) => page.slug === slug);
}