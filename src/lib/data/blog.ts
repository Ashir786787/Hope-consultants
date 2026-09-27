export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  published: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    title: "[Sample] How to start planning your study-abroad timeline",
    slug: "sample-planning-your-study-abroad-timeline",
    excerpt:
      "Sample post — placeholder copy so the blog card, cover image and article page can be reviewed. Replace it with a real article before launch.",
    content: `This is sample content. It exists so the blog index, the card layout and the article page can be reviewed before the team writes anything real. Replace it, or delete it, from the content editor.

Start from the date you want to arrive, not the date you want to apply. Everything runs backwards from that arrival date: the offer has to be accepted, the funding has to be confirmed, the visa has to be applied for, and the documents behind all of that have to exist well before an embassy's deadlines, not just the university's.

Which means the first useful question is not "which university is best for me". It is "when do I need to be standing in the country", and then "what has to be true by each date on the way there".

Write those dates down. Once you have them, anything that does not fit on that timeline is a distraction, however exciting it is.

The second useful question is which parts of the timeline you do not control. University deadlines and intake dates are published and fixed. Visa appointment times, scholarship panel decisions and document turnaround times are not. Build the plan around the parts you can verify, and leave slack around the parts you cannot.

Bring that timeline to a consultation. If something on it does not add up, it is much cheaper to find out now than after an application fee has gone out.`,
    coverImage: "/services/university-and-program-selection.jpg",
    author: "Hope Consultants",
    publishedAt: "2026-09-18",
    published: true,
  },
  {
    title: "[Sample] How to tell a real scholarship from an invented one",
    slug: "sample-spotting-a-fake-scholarship",
    excerpt:
      "Sample post — placeholder copy so the blog card, cover image and article page can be reviewed. Replace it with a real article before launch.",
    content: `This is sample content, written to demonstrate the blog card and the article page. Replace it with a real article, or delete it, from the content editor.

Genuine scholarships have a funding body with a name, a website you can reach without a referral link, and a published application window that closes on a date the funder honours. Fake scholarship notices tend to have the opposite: urgency, a fee, an application link that goes to a messaging app, and a deadline that somehow is today.

The most reliable check is the funder's own website, found independently rather than from a link you were sent. If the award does not exist on the funder's own domain, a poster of it is not evidence of anything.

Second check: does anyone ask you for money to apply? A great many real awards, and essentially no honest ones, require a fee before you are considered. A "student loan", a "talent registration fee" and a "visa sponsorship" scam all work the same way and all present themselves as paperwork.

Third: read the eligibility criteria. If a fully funded award is open to every nationality and every subject, with no minimum grade and no review, it is not a scholarship. Real awards are narrow, and being ineligible is the normal case.

If an offer reaches you, do not send documents, do not pay anything, and do not share a bank account. Send it to us and we will tell you exactly what we can and cannot verify about it. We would rather lose the opportunity than have you lose your savings to it.`,
    coverImage: "/scholarships/daad.jpg",
    author: "Hope Consultants",
    publishedAt: "2026-09-11",
    published: true,
  },
  {
    title: "[Sample] Preparing for a visa interview without memorising a script",
    slug: "sample-preparing-for-a-visa-interview",
    excerpt:
      "Sample post — placeholder copy so the blog card, cover image and article page can be reviewed. Replace it with a real article before launch.",
    content: `This is sample content, to show the blog card, cover image and article page. Replace or delete it from the content editor.

Most interview preparation goes wrong in one direction: people memorise long answers. A rehearsed answer sounds rehearsed, and the officer is asking about your circumstances, not testing your memory.

Know your own documents instead. Be able to say what each one is, why you have it, and what it proves. If you can do that without notes, you can answer most questions about your own case.

Know your course. The name of the programme is not the answer. What you will study, which department it belongs to, who supervises it, and what the first year actually looks like — that is the answer.

Be honest about gaps. If your qualification is not a four-year degree, if you have a gap year, if your grades are not perfect, you should already know how you will explain each of those. Ambiguity is what a careful officer is looking for, so a straightforward explanation of an awkward fact is worth more than a smooth answer to an easy question.

Be brief. Short answers that answer the question asked beat long ones that circle it. You will be interrupted when the answer is complete, and that is a good sign.

If your interview is close, send us your details in advance. We will tell you which of your documents contradict each other, which is a more common reason for a refusal than missing knowledge is.`,
    coverImage: "/services/student-visa-support.jpg",
    author: "Hope Consultants",
    publishedAt: "2026-09-04",
    published: true,
  },
  {
    title: "[Draft] What a good statement of purpose actually does",
    slug: "draft-what-a-good-statement-of-purpose-does",
    excerpt:
      "Draft in progress — unpublished. Present so the publishing workflow can be tested before the team writes anything real.",
    content: `This draft is intentionally left unpublished so the publishing workflow can be verified: an unpublished post is hidden from the blog index, and its own address returns a not-found response instead of the article.

Note for whoever writes this piece: cover the gap between a list of achievements and an actual explanation of why this student wants this specific course at this specific institution. The strongest drafts we see are specific rather than impressive, and they are honest about what they do not yet know.

Replace this text with the finished article, then switch published to true to make it appear on the blog.`,
    coverImage: "/services/sop-motivation-letter-cv.jpg",
    author: "Hope Consultants",
    publishedAt: "2026-09-25",
    published: false,
  },
];
