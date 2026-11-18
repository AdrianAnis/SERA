export type LandingStep = {
  number: string
  title: string
  text: string
  points: string[]
  photoId: string
  photoAlt: string
}

export type LandingFeature = {
  title: string
  text: string
}

export type LandingQuestion = {
  question: string
  answer: string
}

export const HERO_PHOTO_ID = "photo-1758691463000-08b98131daf3"
export const HERO_PHOTO_ALT = "Doctor showing scan results to a patient on a tablet"

export const LANDING_STEPS: LandingStep[] = [
  {
    number: "01",
    title: "Write instructions as usual",
    text: "One sentence is enough. Medications, diet, activities, and follow-ups become structured items you can edit one by one.",
    points: ["AI suggestions are only suggestions and are clearly marked", "Automatic validation before the session can be finished"],
    photoId: "photo-1758691462668-046fd85ceac9",
    photoAlt: "Doctor reviewing scan results on a tablet at a desk",
  },
  {
    number: "02",
    title: "Patients receive it instantly",
    text: "As soon as you confirm, the medication schedule, diet guide, and Companion answers in the patient app switch to the latest version.",
    points: ["Older versions are replaced automatically", "Patients are notified that their care plan was updated"],
    photoId: "photo-1666886573517-dee9a64ac615",
    photoAlt: "Healthcare worker holding a tablet at work",
  },
  {
    number: "03",
    title: "Monitor without waiting for follow-ups",
    text: "See schedules patients checked off, reported complaints, and questions Companion could not answer, all in one dashboard.",
    points: ["Behavioral data, not a recovery assessment", "Questions outside the care plan are forwarded to you"],
    photoId: "photo-1666886573212-2de95596d509",
    photoAlt: "A man using a tablet",
  },
]

export const LANDING_FEATURES: LandingFeature[] = [
  { title: "Structured builder", text: "Medications, diet, activities, restrictions, and follow-ups in one validated form." },
  { title: "AI suggestions", text: "Write free-form instructions, let the items take shape, then approve each item yourself." },
  { title: "Change summary", text: "Before finishing the session, see what was added, changed, and removed compared to the active version." },
  { title: "One active version", text: "Each patient has only one active care plan. Older versions are kept as history." },
  { title: "Behavior monitoring", text: "Charts of schedules patients checked off and complaint reports, with no recovery claims." },
  { title: "Clear escalation", text: "Urgent or out-of-plan questions are never answered blindly and show up on your dashboard." },
]

export const LANDING_QUESTIONS: LandingQuestion[] = [
  {
    question: "Does the AI diagnose or prescribe?",
    answer: "No. The AI only turns the instructions you write into structured items. Nothing is sent to the patient until you finish the session.",
  },
  {
    question: "What does the patient see?",
    answer: "Only the active care plan. Schedules, diet guides, and Companion answers always come from the current version.",
  },
  {
    question: "How is patient adherence shown?",
    answer: "As behavioral data, meaning schedules marked as done. These numbers are not used to infer recovery.",
  },
  {
    question: "What if a patient asks something outside the care plan?",
    answer: "Companion never makes up answers. It directs the patient to ask their doctor, and the question appears on your dashboard.",
  },
]
