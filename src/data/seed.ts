import { uid } from "../lib/id";
import type { Resume } from "../types/resume";
import { buildSection } from "./sectionFactories";
import { templateById } from "./mockTemplates";

export function makeBlankResume(templateId = "aurora", title = "Untitled Resume"): Resume {
  const personal = buildSection("personal");
  const summary = buildSection("summary");
  const experience = buildSection("experience");
  const education = buildSection("education");
  const skills = buildSection("skills");
  const projects = buildSection("projects");
  const cfg = templateById(templateId);

  return {
    id: uid("res"),
    title,
    templateId: cfg?.id ?? templateId,
    sections: [personal, summary, experience, education, skills, projects],
    theme: {
      fontFamily: cfg?.defaults.fontFamily ?? "Inter",
      accentColor: cfg?.defaults.accentColor ?? "#4f46e5",
      pageBackground: cfg?.defaults.pageBackground ?? "#ffffff",
      headingStyle: cfg?.defaults.headingStyle ?? "upper",
      spacing: cfg?.defaults.spacing ?? "normal",
      fontSize: cfg?.defaults.fontSize ?? "md",
      lineHeight: cfg?.defaults.lineHeight ?? "normal",
      headerLayout: cfg?.defaults.headerLayout ?? "stack-left",
    },
    updatedAt: new Date().toISOString(),
  };
}

export function makeSampleResume(templateId = "aurora"): Resume {
  const r = makeBlankResume(templateId, "Jagdish Kumar — Sr. Data Scientist");

  for (const sec of r.sections) {
    if (sec.data.type === "personal") {
      sec.data.personal = {
        fullName: "Jagdish Kumar",
        role: "Sr. Data Scientist",
        email: "jagdish@datasci.io",
        phone: "+91 98765 43210",
        location: "Mumbai, India",
        website: "jagdish.ai",
        linkedin: "linkedin.com/in/jagdishkumar",
        github: "github.com/jagdishk",
      };
    }
    if (sec.data.type === "summary") {
      sec.data.summary =
        "Senior Data Scientist with 7+ years of experience in building production-grade ML models. Specialized in NLP, recommendation systems, and large-scale data engineering. Proven track record of delivering business impact through predictive analytics and statistical modeling.";
    }
    if (sec.data.type === "experience") {
      sec.data.experiences = [
        {
          id: uid("exp"),
          company: "Flipkart",
          position: "Senior Data Scientist",
          location: "Bengaluru",
          startDate: "Jan 2022",
          endDate: "",
          current: true,
          bullets: [
            "Developed a real-time recommendation engine using PyTorch that increased CTR by 18% for 45M+ active users.",
            "Architected a scalable feature store that reduced model deployment time from 2 weeks to 3 days.",
            "Led a team of 4 junior data scientists to build an automated fraud detection system preventing ₹50 Cr in monthly losses.",
          ],
        },
        {
          id: uid("exp"),
          company: "Mu Sigma",
          position: "Associate Data Scientist",
          location: "Bengaluru",
          startDate: "Jun 2018",
          endDate: "Dec 2021",
          current: false,
          bullets: [
            "Optimized supply chain logistics for a Fortune 500 retailer, reducing delivery latency by 12%.",
            "Built predictive maintenance models for industrial IoT sensors using XGBoost and time-series analysis.",
          ],
        },
      ];
    }
    if (sec.data.type === "education") {
      sec.data.education = [
        {
          id: uid("edu"),
          institution: "Indian Institute of Technology, Madras",
          degree: "M.Tech",
          field: "Data Science",
          startDate: "2016",
          endDate: "2018",
          grade: "CGPA 9.2/10.0",
          bullets: [],
        },
      ];
    }
    if (sec.data.type === "skills") {
      sec.data.skills = [
        { id: uid("skl"), name: "Machine Learning", level: 5, category: "Core" },
        { id: uid("skl"), name: "Python / PyTorch", level: 5, category: "Tech Stack" },
        { id: uid("skl"), name: "NLP / Transformers", level: 4, category: "Core" },
        { id: uid("skl"), name: "SQL / Spark", level: 5, category: "Data Engineering" },
        { id: uid("skl"), name: "A/B Testing", level: 4, category: "Analytics" },
        { id: uid("skl"), name: "MLOps", level: 3, category: "Engineering" },
      ];
    }
    if (sec.data.type === "projects") {
      sec.data.projects = [
        {
          id: uid("prj"),
          name: "OpenSource Sentiment API",
          link: "sentiment.api",
          techStack: "Python · FastAPI · HuggingFace",
          bullets: [
            "High-throughput sentiment analysis API serving 1M+ requests daily with sub-50ms latency.",
            "Implemented using a distilled BERT model fine-tuned on customer review datasets.",
          ],
        },
      ];
    }
  }

  r.updatedAt = new Date().toISOString();
  return r;
}
