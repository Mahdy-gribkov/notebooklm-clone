// Pre-generated studio content for featured notebooks.
// This content is curated by the DocChat team and displayed in read-only mode.

export interface FeaturedStudioContent {
  description: string;
  files: { fileName: string; content: string }[];
  quiz: { question: string; options: string[]; correctIndex: number; explanation: string }[];
  flashcards: { front: string; back: string }[];
  report: { heading: string; content: string }[];
  mindmap: { label: string; children?: { label: string; children?: { label: string }[] }[] };
}

const contentMap: Record<string, FeaturedStudioContent> = {
  "getting-started": {
    description: "Learn how to upload documents, ask questions, and use DocChat's AI-powered research tools.",
    files: [
      {
        fileName: "Getting Started Guide.pdf",
        content: `DocChat: Getting Started Guide

DocChat is an AI-powered research assistant that lets you upload documents and have natural conversations about their content. It uses Retrieval-Augmented Generation (RAG) technology to provide accurate, cited answers drawn exclusively from your uploaded materials.

Supported File Types
DocChat supports multiple document formats. PDF files up to 5MB can be uploaded and processed. Microsoft Word documents (DOCX) up to 10MB are supported. Plain text files (TXT) up to 500KB work well for notes and transcripts. Image files including JPEG, PNG, and WebP up to 5MB can be processed using OCR to extract text from photographs of documents or screenshots.

How It Works
When you upload a document, DocChat processes it through several stages. First, the text is extracted from the file. Then the text is split into overlapping chunks of approximately 2000 characters each. Each chunk is converted into a numerical embedding using Google's text-embedding model, which captures the semantic meaning of the text. These embeddings are stored in a PostgreSQL database with pgvector for efficient similarity search.

When you ask a question, your query is also converted to an embedding. DocChat finds the most semantically similar chunks from your documents and provides them as context to the AI model. The AI then generates a response based only on the retrieved document content, citing specific passages.`,
      },
      {
        fileName: "Feature Reference.pdf",
        content: `DocChat Feature Reference

The Chat Interface
The center panel is where you interact with the AI. Type questions in natural language and receive answers with source citations. Each AI response includes references to the specific document passages used, shown as numbered citations like [1], [2]. You can copy messages, save responses as notes, and see similarity scores for cited sources. The chat supports markdown formatting including headers, bullet points, and code blocks.

The Sources Panel
The left panel manages your uploaded files. Drag and drop files or click to browse. Each file shows its processing status: a green dot means ready, amber means processing, and red indicates an error. You can view PDFs directly in the browser and delete files you no longer need. Each notebook supports up to 5 files.

The Studio Panel
The right panel offers AI-powered study tools. Generate flashcards for active recall practice. Create quizzes to test your understanding. Build structured reports summarizing the document. Visualize topic hierarchies with mind maps. Extract data tables from structured content. Create slide decks with key points. Listen to audio overviews of your documents.

Notebooks
DocChat organizes your work into notebooks. Each notebook can contain multiple source files. All documents in a notebook are searchable together, allowing cross-referencing between files. You can edit notebook titles, share notebooks with others, and export your work.`,
      },
      {
        fileName: "Tips and Best Practices.pdf",
        content: `DocChat: Tips and Best Practices

Getting the Best Answers
Upload text-based PDFs rather than scanned images when possible, as text extraction is more accurate. Ask specific, targeted questions for the most precise answers. For example, instead of "Tell me about this document," ask "What methodology was used in the study described on page 3?" The AI responds better to focused queries.

Organizing Your Research
Create separate notebooks for different projects or topics. This keeps context clean and prevents the AI from mixing up information across unrelated documents. Use the search feature on the dashboard to find notebooks quickly. Rename notebooks with descriptive titles so you can find them later.

Using Studio Tools Effectively
After uploading documents, use the Studio tools to generate study materials. Flashcards work best for memorization-heavy content like vocabulary or definitions. Quizzes help test comprehension of concepts and relationships. Reports provide structured summaries for quick review. Mind maps visualize how topics connect.

Privacy and Security
Your documents are stored securely in encrypted storage. Files are only accessible to you and anyone you explicitly share with. DocChat does not use your documents to train AI models. All processing happens server-side with secure API connections. Shared notebooks can be set to view-only or chat-enabled depending on the level of access you want to grant.`,
      },
    ],
    quiz: [
      {
        question: "What is the primary purpose of DocChat?",
        options: ["Social media management", "Chat with uploaded documents using AI", "Code generation", "Image editing"],
        correctIndex: 1,
        explanation: "DocChat lets you upload documents and ask questions about them using AI-powered RAG (Retrieval-Augmented Generation).",
      },
      {
        question: "Which file types does DocChat support?",
        options: ["Only PDF", "PDF and DOCX only", "PDF, DOCX, TXT, and images", "All file types"],
        correctIndex: 2,
        explanation: "DocChat supports PDF, DOCX, plain text, and image files (JPEG, PNG, WebP) with OCR capabilities.",
      },
      {
        question: "What is the Studio feature used for?",
        options: ["Editing documents", "Generating study materials from your documents", "Video conferencing", "File compression"],
        correctIndex: 1,
        explanation: "The Studio generates flashcards, quizzes, reports, mind maps, and more from your uploaded documents.",
      },
    ],
    flashcards: [
      { front: "What is RAG?", back: "Retrieval-Augmented Generation - a technique that retrieves relevant document chunks to provide context for AI responses." },
      { front: "How does DocChat ensure answer accuracy?", back: "It only answers from your uploaded documents, citing specific sources. It never uses outside knowledge." },
      { front: "What Studio tools are available?", back: "Flashcards, Quiz, Report, Mind Map, Data Table, Infographic, Slide Deck, and Audio Overview." },
      { front: "What is the maximum file size?", back: "PDF files up to 5MB, DOCX up to 10MB, text files up to 500KB, and images up to 5MB." },
    ],
    report: [
      { heading: "Overview", content: "DocChat is an AI-powered research assistant that lets you upload documents and have natural conversations about their content. It uses advanced RAG technology to provide accurate, cited answers." },
      { heading: "Key Features", content: "Upload multiple file types (PDF, DOCX, TXT, images), ask questions in natural language, get AI-generated study materials through the Studio, and organize your research into notebooks." },
      { heading: "Getting Started", content: "Create a new notebook, upload your documents in the Sources panel, wait for processing to complete, then start chatting. Use the Studio panel to generate flashcards, quizzes, and more." },
    ],
    mindmap: {
      label: "DocChat",
      children: [
        { label: "Upload", children: [{ label: "PDF" }, { label: "DOCX" }, { label: "TXT" }, { label: "Images" }] },
        { label: "Chat", children: [{ label: "Ask questions" }, { label: "Get cited answers" }, { label: "AI-powered" }] },
        { label: "Studio", children: [{ label: "Quiz" }, { label: "Flashcards" }, { label: "Report" }, { label: "Mind Map" }] },
      ],
    },
  },

  "research-analysis": {
    description: "Analyze academic papers by extracting findings, comparing methodologies, and tracking citations across studies.",
    files: [
      {
        fileName: "Research Methods Overview.pdf",
        content: `Research Paper Analysis: Methods Overview

Uploading Research Papers
Upload papers in PDF format for best results. Most academic papers downloaded from journals, arXiv, or institutional repositories are text-based PDFs that process effectively. You can upload multiple papers to a single notebook to enable cross-referencing between them.

Extracting Key Findings
Ask targeted questions like "What are the main findings of this paper?" or "Summarize the results section." The AI retrieves relevant passages and synthesizes an answer. Each response includes source citations so you can verify the information against the original text.

Understanding Methodology
Research methodology can be complex. Ask to explain the research design, sample size, data collection methods, or statistical techniques used. The AI breaks down technical language into clearer explanations while staying faithful to the original text. For quantitative studies, ask about confidence intervals, effect sizes, and statistical significance to understand the strength of the findings.`,
      },
      {
        fileName: "Citation Analysis Guide.pdf",
        content: `Citation Analysis and Tracking

Identifying Limitations
Every study has limitations. Ask "What limitations are acknowledged in this research?" or "What are the potential weaknesses of this study's methodology?" to identify relevant passages discussing limitations, threats to validity, and areas for future work.

Citation Tracking
Ask about specific claims to find which papers support them. For example, "Which paper discusses the impact of sample size on results?" This identifies the relevant document and cites the specific passage. When multiple papers address the same topic, cross-referencing reveals areas of agreement and disagreement.

Best Practices for Research Analysis
Use specific, targeted questions rather than broad queries. Reference specific sections when possible (e.g., "What does the methodology section describe?"). Upload complete papers rather than excerpts for best context. Use the Studio Report feature to generate structured summaries. Create separate notebooks for different research topics or projects.`,
      },
      {
        fileName: "Literature Comparison.pdf",
        content: `Comparing Multiple Research Papers

Cross-Paper Analysis
Upload several related papers to one notebook. Then ask comparison questions: "How do the methodologies differ across these papers?" or "Do these papers reach similar conclusions?" Cross-referencing content from all uploaded documents provides comprehensive comparative answers.

Literature Review Support
For literature reviews, upload the papers you are reviewing to identify common themes, contradictions, and gaps. The Data Table feature can help structure findings by extracting author, year, methodology, and key results from each paper into an organized format.

Synthesizing Across Sources
When working with 3-5 papers on a related topic, ask synthesis questions: "What is the consensus view on this topic across the papers?" or "Where do the authors disagree?" The AI attributes each claim to its source paper, making it easy to trace arguments back to their origin. This is particularly useful for writing literature review sections of theses and dissertations.`,
      },
    ],
    quiz: [
      {
        question: "What is the best approach for analyzing a research paper?",
        options: ["Read the conclusion only", "Skim the abstract", "Upload and ask targeted questions with citations", "Memorize the references"],
        correctIndex: 2,
        explanation: "Targeted questions with cited passages help you understand complex papers by grounding answers in the source material.",
      },
      {
        question: "How can you compare findings across papers?",
        options: ["Create separate notebooks for each", "Upload all to one notebook and ask comparison questions", "Print them out", "Use a spreadsheet"],
        correctIndex: 1,
        explanation: "Uploading multiple papers to one notebook enables cross-referencing findings when answering comparison questions.",
      },
    ],
    flashcards: [
      { front: "How to extract key findings?", back: "Ask: 'What are the main findings of this paper?' The AI will cite specific passages from the results section." },
      { front: "How to understand methodology?", back: "Ask: 'Explain the research methodology used in this study.' The AI breaks down complex methods into accessible language." },
      { front: "How to identify limitations?", back: "Ask: 'What limitations are mentioned in this research?' The AI highlights acknowledged gaps and threats to validity." },
    ],
    report: [
      { heading: "Research Workflow", content: "Upload your research papers to notebooks. The AI indexes the content for semantic search, allowing you to ask detailed questions and get cited answers from the source material." },
      { heading: "Analysis Techniques", content: "Use targeted questions to extract methodology, findings, limitations, and implications. The Studio can generate structured reports and data tables from your research." },
    ],
    mindmap: {
      label: "Research Analysis",
      children: [
        { label: "Upload Papers", children: [{ label: "PDF format" }, { label: "Multiple files" }] },
        { label: "Ask Questions", children: [{ label: "Methodology" }, { label: "Findings" }, { label: "Limitations" }] },
        { label: "Generate", children: [{ label: "Summary report" }, { label: "Data tables" }, { label: "Comparisons" }] },
      ],
    },
  },

  "meeting-organizer": {
    description: "Process meeting notes and transcripts to extract action items, track decisions, and generate follow-up reports.",
    files: [
      {
        fileName: "Meeting Minutes Template.pdf",
        content: `Meeting Minutes: Q1 Product Planning — January 15, 2026

Attendees: Sarah Chen (PM), David Kim (Engineering Lead), Lisa Patel (Design), Mark Johnson (QA)

Agenda Items Discussed

1. Q1 Roadmap Review
Sarah presented the Q1 roadmap priorities. The team agreed to focus on three major features: user dashboard redesign, API rate limiting improvements, and mobile responsive overhaul. Timeline targets are end of February for dashboard, mid-March for API changes, and end of March for mobile.

2. Resource Allocation
David reported that the engineering team has capacity for two parallel workstreams. Decision: Dashboard redesign and API rate limiting will proceed simultaneously. Mobile work begins after dashboard completion. Lisa will dedicate 60% of her time to dashboard design work.

3. Technical Debt
Mark raised concerns about test coverage in the authentication module, currently at 45%. Decision: Allocate one sprint (two weeks) specifically for auth module testing before starting new feature work. David to assign two engineers to this task starting next Monday.

4. Customer Feedback Integration
Sarah shared that 15 customer interviews highlighted pain points with the current search functionality. Action item: Lisa to create search UX mockups by January 22. David to research Elasticsearch alternatives by January 25.`,
      },
      {
        fileName: "Action Item Tracker.pdf",
        content: `Action Items and Assignments — Q1 2026

From January 15 Planning Meeting:
- [Sarah] Finalize Q1 roadmap document and share with stakeholders — Due: Jan 17
- [Lisa] Create dashboard redesign mockups (v1) — Due: Jan 22
- [Lisa] Create search UX improvement mockups — Due: Jan 22
- [David] Research Elasticsearch alternatives for search — Due: Jan 25
- [David] Assign 2 engineers to auth module testing — Due: Jan 20
- [Mark] Write test plan for authentication module — Due: Jan 22
- [Mark] Set up automated regression test suite — Due: Feb 1

From January 8 Sprint Retrospective:
- [David] Investigate CI pipeline slowdown (builds taking 12+ minutes) — Due: Jan 15 — STATUS: COMPLETED
- [Sarah] Update stakeholder dashboard with new metrics — Due: Jan 12 — STATUS: COMPLETED
- [Lisa] Conduct user testing session for onboarding flow — Due: Jan 19 — STATUS: IN PROGRESS

Overdue Items:
- [Mark] Document API error codes for external developers — Original due: Dec 20 — Rescheduled to Jan 30
- [David] Migrate staging environment to new cluster — Original due: Jan 5 — Blocked by infrastructure team`,
      },
      {
        fileName: "Follow-Up Procedures.pdf",
        content: `Meeting Follow-Up and Decision Log

Decision Log — January 2026

Jan 15: Approved Q1 roadmap with three priority features (dashboard, API, mobile). Budget allocated: $45,000 for additional cloud infrastructure.
Jan 15: Auth module test coverage must reach 80% before new feature development begins.
Jan 15: Dashboard and API work proceed in parallel; mobile work starts after dashboard completion.
Jan 8: Adopted bi-weekly sprint retrospectives instead of monthly.
Jan 8: CI pipeline optimization approved — target build time under 5 minutes.

Follow-Up Procedures
After each meeting, the designated note-taker distributes minutes within 24 hours. Action items are added to the project tracker with owner and due date. Items not completed by their due date are escalated in the next meeting.

Weekly status updates are sent every Friday by 3 PM. These include: completed items, in-progress items with percentage completion, blocked items with blocker description, and new risks identified. The PM reviews all updates and flags items requiring executive attention.

Quarterly reviews compile all decisions made, action items completed vs. overdue, and lessons learned. This data feeds into the next quarter's planning process.`,
      },
    ],
    quiz: [
      {
        question: "What is the most effective way to process meeting notes?",
        options: ["Manually summarize", "Upload to an AI tool for structured analysis", "Delete them", "Forward to everyone"],
        correctIndex: 1,
        explanation: "AI-powered analysis can extract action items, decisions, and key discussion points from meeting notes systematically.",
      },
    ],
    flashcards: [
      { front: "How to extract action items?", back: "Ask: 'List all action items from these meeting notes with assigned owners and deadlines.'" },
      { front: "How to summarize meetings?", back: "Use the Report feature to auto-generate a structured summary of your meeting documents." },
      { front: "How to track decisions?", back: "Ask: 'What decisions were made in this meeting?' to identify and cite each decision." },
    ],
    report: [
      { heading: "Meeting Notes Workflow", content: "Upload meeting notes, transcripts, or agendas. The AI helps you extract action items, summarize discussions, and track decisions across multiple meetings." },
      { heading: "Best Practices", content: "Upload notes promptly after meetings. Use the Studio to generate flashcards of key decisions. Create separate notebooks for different project meetings." },
    ],
    mindmap: {
      label: "Meeting Organizer",
      children: [
        { label: "Input", children: [{ label: "Notes" }, { label: "Transcripts" }, { label: "Agendas" }] },
        { label: "Extract", children: [{ label: "Action items" }, { label: "Decisions" }, { label: "Key points" }] },
        { label: "Output", children: [{ label: "Summaries" }, { label: "Follow-ups" }, { label: "Reports" }] },
      ],
    },
  },

  "study-guide": {
    description: "Transform textbook chapters and lecture notes into flashcards, quizzes, and structured study guides.",
    files: [
      {
        fileName: "Active Recall Techniques.pdf",
        content: `Active Recall and Memory Science

The Science of Active Recall
Active recall is a study technique where you actively retrieve information from memory rather than passively re-reading. Research by Karpicke and Blunt (2011) demonstrated that retrieval practice produced 50% more long-term retention compared to elaborative studying with concept maps. The testing effect, as it is known in cognitive psychology, works because each retrieval attempt strengthens the neural pathways associated with that memory.

Implementation Strategies
Self-testing is the most direct form of active recall. After reading a chapter, close the book and write down everything you remember. Then check against the source material and identify gaps. Flashcards facilitate active recall by forcing you to generate the answer before seeing it.

The Feynman Technique extends active recall by requiring you to explain concepts in simple language. If you cannot explain a concept clearly, you do not understand it well enough. This technique identifies specific knowledge gaps that need further study.

Interleaving Practice
Instead of studying one topic exhaustively before moving to the next (blocked practice), interleaving involves mixing different topics within a study session. Research shows interleaving improves discrimination between similar concepts and leads to better transfer of knowledge to new problems.`,
      },
      {
        fileName: "Exam Preparation Strategy.pdf",
        content: `Exam Preparation: A Structured Approach

Phase 1: Content Mapping (2-3 Weeks Before)
Create a comprehensive list of all topics covered in the exam. Upload all relevant course materials: textbook chapters, lecture slides, and supplementary readings. Use the mind map feature to visualize relationships between topics. Identify which topics carry the most weight based on syllabus emphasis and past exam patterns.

Phase 2: Active Study (1-2 Weeks Before)
Generate flashcards for key definitions, formulas, and concepts. Create practice quizzes to test understanding of each topic area. Focus study time on weak areas identified through quiz performance. Use spaced repetition: review difficult cards daily, easy cards every 3 days, mastered cards weekly.

Phase 3: Integration (Final Week)
Practice answering questions that span multiple topics. Ask synthesis questions: "How does concept A relate to concept B?" Review all generated reports for a high-level overview. Do a final round of practice quizzes covering all material. Simulate exam conditions: time yourself, avoid notes, work through problems sequentially.

Phase 4: Day Before
Review mind maps for the big picture. Skim flashcards one final time, focusing on starred items. Get adequate sleep, as memory consolidation occurs during sleep. Avoid cramming new material in the final 12 hours.`,
      },
      {
        fileName: "Study Schedule Template.pdf",
        content: `Weekly Study Schedule and Spaced Repetition Plan

Spaced Repetition Intervals
The spacing effect, documented by Ebbinghaus in 1885 and confirmed by modern research, shows that distributing practice over time dramatically improves retention. Optimal intervals follow an expanding pattern:
- First review: 1 day after initial study
- Second review: 3 days after first review
- Third review: 7 days after second review
- Fourth review: 14 days after third review
- Fifth review: 30 days after fourth review

Sample Weekly Schedule for a 4-Course Load

Monday: Course A active recall (45 min), Course B flashcard review (20 min)
Tuesday: Course B active recall (45 min), Course C flashcard review (20 min)
Wednesday: Course C active recall (45 min), Course A flashcard review (20 min), Course D reading (30 min)
Thursday: Course D active recall (45 min), Course B flashcard review (20 min)
Friday: Practice quizzes for all courses (60 min), identify weak areas
Saturday: Deep study of weak areas identified Friday (90 min)
Sunday: Light review of all flashcard decks (30 min), plan next week

Tracking Progress
After each quiz session, record your score and the topics you struggled with. Over a 4-week period, you should see steady improvement. If a topic consistently scores below 70%, allocate additional active recall sessions for that material.`,
      },
    ],
    quiz: [
      {
        question: "Which study technique produces the best long-term retention?",
        options: ["Re-reading textbook chapters", "Highlighting key passages", "Active recall through self-testing", "Copying notes by hand"],
        correctIndex: 2,
        explanation: "Research shows active recall (self-testing) produces 50% more long-term retention than passive study methods like re-reading.",
      },
      {
        question: "What is the optimal approach for exam preparation?",
        options: ["Cram everything the night before", "Use a structured multi-phase approach over 2-3 weeks", "Only study the day of the exam", "Read the textbook cover to cover once"],
        correctIndex: 1,
        explanation: "A phased approach (content mapping, active study, integration, review) distributed over weeks leads to better retention and performance.",
      },
    ],
    flashcards: [
      { front: "Active Recall", back: "A study technique where you actively retrieve information from memory rather than passively re-reading. Produces 50% more retention." },
      { front: "Spaced Repetition", back: "Reviewing material at expanding intervals (1 day, 3 days, 7 days, 14 days, 30 days) for optimal long-term retention." },
      { front: "Interleaving", back: "Mixing different topics within a study session instead of blocking. Improves discrimination between similar concepts." },
    ],
    report: [
      { heading: "Study Guide Creation", content: "Upload textbook chapters, lecture notes, or study materials. The AI indexes the content and makes it searchable through natural language queries." },
      { heading: "Active Learning", content: "Use the Studio to generate quizzes for self-testing, flashcards for active recall, and mind maps for visual organization of concepts." },
      { heading: "Exam Preparation", content: "Follow a structured multi-phase approach: content mapping, active study with spaced repetition, integration practice, and final review." },
    ],
    mindmap: {
      label: "Study Guide",
      children: [
        { label: "Upload", children: [{ label: "Textbooks" }, { label: "Lecture notes" }, { label: "Articles" }] },
        { label: "Study", children: [{ label: "Flashcards" }, { label: "Quizzes" }, { label: "Summaries" }] },
        { label: "Review", children: [{ label: "Mind maps" }, { label: "Reports" }, { label: "Practice" }] },
      ],
    },
  },

  "data-analysis": {
    description: "Understand statistical reports, extract data tables, and generate visual summaries of analytical findings.",
    files: [
      {
        fileName: "Statistical Methods Guide.pdf",
        content: `Understanding Statistical Methods in Reports

Common Statistical Measures
When reviewing data reports, you will encounter several key statistical measures. The mean (average) represents the central tendency of a dataset. The median is the middle value when data is sorted, and is more robust to outliers than the mean. Standard deviation measures the spread of data around the mean; a large standard deviation indicates high variability.

Hypothesis Testing
Most quantitative research uses hypothesis testing. The null hypothesis (H0) typically states there is no effect or difference. The p-value represents the probability of observing the data if the null hypothesis were true. A p-value below 0.05 is conventionally considered statistically significant, meaning the result is unlikely due to chance alone.

Regression Analysis
Regression models describe relationships between variables. Linear regression fits a straight line to data, with the R-squared value indicating how much variance in the outcome is explained by the predictors. Multiple regression includes several predictor variables. The coefficient for each variable indicates the expected change in the outcome for a one-unit change in that predictor, holding other variables constant.

Confidence Intervals
A 95% confidence interval means that if the study were repeated many times, 95% of the calculated intervals would contain the true population parameter. Wider intervals indicate less precision in the estimate. When comparing groups, non-overlapping confidence intervals suggest a statistically significant difference.`,
      },
      {
        fileName: "Data Visualization Best Practices.pdf",
        content: `Data Visualization and Interpretation

Choosing the Right Chart Type
Bar charts compare discrete categories. Line charts show trends over time. Scatter plots reveal relationships between two continuous variables. Histograms display the distribution of a single continuous variable. Pie charts show proportions of a whole but should be limited to 5-7 categories maximum.

Reading Charts Critically
Always check the axis scales. Truncated y-axes can exaggerate differences. Look for the baseline: does it start at zero? Check whether the data is adjusted for inflation, population growth, or other factors. Note the sample size: small samples can produce misleading patterns.

Common Visualization Pitfalls
Cherry-picking time periods can create misleading trends. Correlation displayed in a chart does not imply causation. Aggregated data can mask important subgroup differences (Simpson's paradox). 3D charts add visual noise without information value. Dual y-axes can create false impressions of correlation between unrelated variables.

Extracting Data from Reports
When working with data reports, ask for specific metrics: "What was the year-over-year revenue growth?" or "What is the correlation between customer satisfaction and retention rate?" Focus on effect sizes, not just statistical significance. A statistically significant but tiny effect may not be practically meaningful.`,
      },
      {
        fileName: "Report Writing Framework.pdf",
        content: `Data Analysis Report Writing Framework

Executive Summary Structure
Start with the key finding in one sentence. Follow with 2-3 supporting data points. State the business implication clearly. Include a recommended action. Example: "Customer churn increased 12% quarter-over-quarter (from 4.2% to 4.7%), driven primarily by users in the 18-25 demographic. We recommend implementing the targeted retention campaign outlined in Section 4."

Presenting Quantitative Results
Always provide context for numbers. Instead of "Revenue was $2.3M," write "Revenue was $2.3M, a 15% increase from Q3 and 8% above the annual target." Include comparison points: previous periods, benchmarks, targets, or industry averages. Report both absolute numbers and percentages when discussing changes.

Methodology Section
Describe your data sources, collection methods, and any transformations applied. Note the time period covered and any data exclusions. Specify the statistical methods used and why they were chosen. Acknowledge limitations: small sample sizes, missing data, potential confounding variables.

Actionable Recommendations
Each recommendation should be specific, measurable, and tied to a data finding. Instead of "Improve customer experience," write "Reduce average support response time from 4.2 hours to under 2 hours, as our analysis shows response time is the strongest predictor of customer satisfaction (r = -0.73, p < 0.001)."`,
      },
    ],
    quiz: [
      {
        question: "What does a p-value below 0.05 indicate?",
        options: ["The result is wrong", "The result is unlikely due to chance alone", "The sample size is too small", "The effect is large"],
        correctIndex: 1,
        explanation: "A p-value below 0.05 means there is less than a 5% probability of observing the data if the null hypothesis were true.",
      },
    ],
    flashcards: [
      { front: "What does R-squared measure?", back: "The proportion of variance in the outcome variable that is explained by the predictor variables in a regression model." },
      { front: "What is a confidence interval?", back: "A range of values that, with a specified probability (e.g., 95%), contains the true population parameter." },
      { front: "What is Simpson's paradox?", back: "When aggregated data shows a trend that reverses when the data is broken into subgroups." },
    ],
    report: [
      { heading: "Data Analysis Workflow", content: "Upload research data reports, statistical analyses, or data documentation. The AI helps you understand complex findings and extract structured information." },
      { heading: "Tools", content: "Use Data Table generation to structure findings, Infographic for visual summaries, and Reports for comprehensive overviews of the data analysis." },
    ],
    mindmap: {
      label: "Data Analysis",
      children: [
        { label: "Upload", children: [{ label: "Reports" }, { label: "Datasets docs" }, { label: "Analysis files" }] },
        { label: "Explore", children: [{ label: "Statistics" }, { label: "Trends" }, { label: "Methodology" }] },
        { label: "Generate", children: [{ label: "Data tables" }, { label: "Infographics" }, { label: "Reports" }] },
      ],
    },
  },

  "legal-review": {
    description: "Analyze contracts and legal documents to identify key clauses, obligations, risks, and termination provisions.",
    files: [
      {
        fileName: "Contract Analysis Checklist.pdf",
        content: `Contract Analysis Checklist

Parties and Definitions
Identify all parties to the agreement and their defined roles. Check that defined terms are used consistently throughout. Note any affiliates, subsidiaries, or third parties referenced. Verify that the effective date and term are clearly stated.

Payment and Financial Terms
Locate all payment obligations, amounts, and schedules. Identify late payment penalties and interest rates. Check for price escalation clauses or adjustment mechanisms. Note any minimum commitments, volume discounts, or earn-out provisions. Verify currency specifications and tax responsibilities.

Scope of Work and Deliverables
Document all deliverables with acceptance criteria. Identify performance standards, KPIs, and SLAs. Check for change order procedures and their cost implications. Note any exclusions from scope that are explicitly stated.

Representations and Warranties
List all representations made by each party. Note any disclaimers or limitations on warranties. Identify warranty periods and remedies for breach. Check for "as is" language that may limit recourse.

Intellectual Property
Determine IP ownership for work product created under the agreement. Check for license grants, restrictions, and sublicensing rights. Identify any pre-existing IP that is being licensed. Note IP indemnification obligations.`,
      },
      {
        fileName: "Risk Assessment Framework.pdf",
        content: `Legal Risk Assessment Framework

Liability Analysis
Identify all limitation of liability clauses. Note any caps on damages (often set at the total contract value or fees paid in the preceding 12 months). Check for carve-outs to liability caps, typically for IP infringement, confidentiality breaches, and willful misconduct. Assess whether consequential damages are excluded and whether this exclusion is mutual.

Indemnification Review
Document indemnification obligations for each party. Typical triggers include IP infringement claims, data breaches, personal injury, and breach of representations. Check for defense obligations versus reimbursement-only indemnification. Note whether the indemnifying party has sole control of defense and settlement.

Termination Risk
Review termination provisions: termination for cause (breach, insolvency), termination for convenience, and automatic termination triggers. Check notice periods, which typically range from 30 to 90 days. Identify post-termination obligations: data return/destruction, wind-down services, and survival clauses. Assess financial exposure upon early termination: unpaid fees, termination penalties, and stranded costs.

Data and Confidentiality Risk
Review data protection obligations and compliance requirements (GDPR, CCPA). Check the definition of confidential information and its exceptions. Note the confidentiality period (typically 3-5 years, or indefinite for trade secrets). Assess data breach notification requirements and timelines.`,
      },
      {
        fileName: "Due Diligence Guide.pdf",
        content: `Due Diligence Review Process

Pre-Review Preparation
Gather all relevant documents: master agreement, amendments, SOWs, side letters, and related correspondence. Create a document index with dates, parties, and subject matter. Identify the key business terms that need verification.

Contract Inventory Analysis
Catalog all active contracts by type: customer agreements, vendor contracts, employment agreements, lease agreements, and licensing deals. For each contract, extract: counterparty, effective date, expiration date, auto-renewal terms, total contract value, and key obligations.

Force Majeure and Extraordinary Provisions
Check for force majeure clauses and their triggering events. Note whether pandemics, government actions, or supply chain disruptions are explicitly listed. Assess the consequences of force majeure: suspension of obligations, right to terminate, or automatic extension.

Assignment and Change of Control
Review assignment clauses: can the contract be assigned without consent? Check for change of control provisions that may be triggered by mergers or acquisitions. Note any anti-assignment language that could affect deal structure. Identify contracts requiring counterparty consent for assignment.

Important Note
This material is for educational purposes and does not constitute legal advice. Always consult with a qualified attorney for legal decisions and contract interpretation.`,
      },
    ],
    quiz: [
      {
        question: "What is the first step in analyzing a contract?",
        options: ["Sign it immediately", "Identify the parties, defined terms, and effective date", "Only read the signature page", "Count the pages"],
        correctIndex: 1,
        explanation: "Understanding who the parties are and how terms are defined is foundational to interpreting the rest of the contract.",
      },
      {
        question: "What should you check in a limitation of liability clause?",
        options: ["The font size", "Caps on damages and carve-outs for specific breach types", "Whether it is on the first page", "The color of the text"],
        correctIndex: 1,
        explanation: "Liability caps and carve-outs determine your maximum financial exposure and which breaches are excluded from the cap.",
      },
    ],
    flashcards: [
      { front: "What are common liability cap carve-outs?", back: "IP infringement, confidentiality breaches, willful misconduct, and data breaches are typically excluded from liability caps." },
      { front: "What is force majeure?", back: "A clause excusing performance when extraordinary events (natural disasters, wars, pandemics) prevent fulfillment of obligations." },
      { front: "What triggers a change of control provision?", back: "Mergers, acquisitions, or transfer of ownership that may require counterparty consent or allow contract termination." },
    ],
    report: [
      { heading: "Contract Analysis", content: "Upload contracts, agreements, or legal documents. The AI helps identify key clauses, obligations, and potential areas of concern." },
      { heading: "Risk Assessment", content: "Ask about liability limits, indemnification, force majeure, and termination provisions. The AI cites exact clauses from the document." },
    ],
    mindmap: {
      label: "Legal Review",
      children: [
        { label: "Upload", children: [{ label: "Contracts" }, { label: "Agreements" }, { label: "Policies" }] },
        { label: "Analyze", children: [{ label: "Obligations" }, { label: "Risks" }, { label: "Clauses" }] },
        { label: "Output", children: [{ label: "Summary" }, { label: "Key terms" }, { label: "Action items" }] },
      ],
    },
  },

  "product-specs": {
    description: "Break down PRDs and feature specs to extract requirements, dependencies, and user stories for sprint planning.",
    files: [
      {
        fileName: "PRD Template.pdf",
        content: `Product Requirements Document: User Dashboard Redesign

Overview
The current user dashboard has a 35% bounce rate and average session duration of 1.2 minutes. User research indicates the primary issues are information overload, unclear navigation hierarchy, and slow loading times (3.4s average). This redesign aims to reduce bounce rate to under 20% and increase session duration to 3+ minutes.

Target Users
Primary: Active users who log in 3+ times per week (62% of MAU). Secondary: New users in their first 7 days (high churn risk, 40% drop off after day 1). Tertiary: Admin users who manage team settings and permissions.

P0 Features (Must Ship)
1. Personalized activity feed showing recent actions and updates. Acceptance: loads in under 500ms, shows last 20 items, supports infinite scroll.
2. Quick-action toolbar for most common tasks (create, search, settings). Acceptance: accessible within 1 click from any dashboard state.
3. Performance metrics widget showing key user statistics. Acceptance: real-time data, configurable time range, exportable as CSV.

P1 Features (Should Ship)
4. Customizable widget layout with drag-and-drop. Acceptance: persists layout across sessions, supports 3 column layouts.
5. Notification center with read/unread state. Acceptance: badge count updates in real-time, supports mark-all-as-read.

Success Metrics
- Bounce rate: < 20% (from 35%)
- Session duration: > 3 min (from 1.2 min)
- Task completion rate: > 85% for top 5 actions
- Page load time: < 1.5s (from 3.4s)`,
      },
      {
        fileName: "Feature Prioritization Matrix.pdf",
        content: `Feature Prioritization: RICE Framework Analysis

Scoring Methodology
Each feature is scored using the RICE framework:
- Reach: How many users will this affect per quarter?
- Impact: How much will this improve the user experience? (3=massive, 2=high, 1=medium, 0.5=low, 0.25=minimal)
- Confidence: How confident are we in the estimates? (100%=high, 80%=medium, 50%=low)
- Effort: How many person-months of engineering work? (lower is better)
- RICE Score = (Reach x Impact x Confidence) / Effort

Feature Scores

1. Activity Feed: Reach=15,000, Impact=2, Confidence=90%, Effort=2 → Score: 13,500
2. Quick-Action Toolbar: Reach=15,000, Impact=3, Confidence=80%, Effort=1 → Score: 36,000
3. Performance Widget: Reach=8,000, Impact=1, Confidence=70%, Effort=1.5 → Score: 3,733
4. Drag-Drop Layout: Reach=6,000, Impact=0.5, Confidence=60%, Effort=3 → Score: 600
5. Notification Center: Reach=12,000, Impact=2, Confidence=85%, Effort=2 → Score: 10,200

Recommended Priority Order
1. Quick-Action Toolbar (highest RICE score, lowest effort)
2. Activity Feed (high reach and impact)
3. Notification Center (strong reach)
4. Performance Widget (moderate impact)
5. Drag-Drop Layout (nice-to-have, high effort relative to impact)

Dependencies
- Activity Feed requires the new event tracking API (backend team, 2 weeks)
- Notification Center depends on WebSocket infrastructure (shared services team)
- Performance Widget needs analytics pipeline updates (data team, 1 week)`,
      },
      {
        fileName: "Technical Requirements Spec.pdf",
        content: `Technical Requirements: Dashboard Redesign

Architecture Decisions
The dashboard will use a component-based architecture with lazy loading for each widget. Initial page load includes only the header, navigation, and activity feed. Secondary widgets (metrics, notifications) load asynchronously after the initial render to meet the 1.5s load time target.

API Contracts
GET /api/dashboard/feed — Returns paginated activity feed items
  Query params: cursor (string), limit (int, default 20)
  Response: { items: ActivityItem[], nextCursor: string | null }
  Latency target: < 200ms at p95

GET /api/dashboard/metrics — Returns user performance metrics
  Query params: timeRange (7d|30d|90d|1y)
  Response: { metrics: MetricItem[], generatedAt: ISO8601 }
  Cache: 5 minute TTL, invalidate on new data ingestion

WebSocket /ws/notifications — Real-time notification delivery
  Events: notification.new, notification.read, notification.count
  Reconnection: exponential backoff starting at 1s, max 30s

Database Schema Changes
Add table: user_dashboard_layouts (user_id, layout_json, updated_at)
Add column: notifications.read_at (timestamp, nullable)
Add index: activity_events(user_id, created_at DESC) for feed queries

Performance Budget
- JavaScript bundle: < 150KB gzipped (currently 280KB, requires code splitting)
- First Contentful Paint: < 800ms
- Time to Interactive: < 1.5s
- API calls on initial load: max 2 (feed + auth check)
- WebSocket connection: established after initial render, not blocking`,
      },
    ],
    quiz: [
      {
        question: "What does the RICE framework measure?",
        options: ["Code quality", "Feature prioritization based on reach, impact, confidence, and effort", "User satisfaction only", "Revenue generation"],
        correctIndex: 1,
        explanation: "RICE scores features by Reach, Impact, Confidence, and Effort to objectively prioritize development work.",
      },
    ],
    flashcards: [
      { front: "What are P0 features?", back: "Must-ship features that are critical for the product launch. They define the minimum viable experience." },
      { front: "What is the RICE framework?", back: "Reach x Impact x Confidence / Effort. A scoring system for objectively prioritizing features." },
      { front: "What is a performance budget?", back: "Limits on page weight, load times, and resource counts that the team commits to not exceeding." },
    ],
    report: [
      { heading: "PRD Analysis", content: "Upload product requirement documents, feature specs, or technical designs. The AI indexes the content for detailed querying." },
      { heading: "Feature Extraction", content: "Use targeted questions to extract features, acceptance criteria, user stories, and technical requirements from your specs." },
    ],
    mindmap: {
      label: "Product Specs",
      children: [
        { label: "Input", children: [{ label: "PRDs" }, { label: "Feature specs" }, { label: "Tech designs" }] },
        { label: "Analyze", children: [{ label: "Features" }, { label: "Dependencies" }, { label: "Priorities" }] },
        { label: "Output", children: [{ label: "Requirements" }, { label: "User stories" }, { label: "Summaries" }] },
      ],
    },
  },

  "literature-review": {
    description: "Synthesize findings across multiple academic papers to identify themes, gaps, and contradictions in the literature.",
    files: [
      {
        fileName: "Literature Matrix Template.pdf",
        content: `Literature Review Matrix: Remote Work Productivity Studies

Study 1: Bloom et al. (2015)
Title: "Does Working from Home Work? Evidence from a Chinese Experiment"
Methodology: Randomized controlled trial, 16,000 employees at Ctrip (Chinese travel agency)
Sample: 249 volunteers randomly assigned to WFH or office for 9 months
Key Findings: WFH employees showed 13% performance increase. Attrition decreased by 50%. WFH group reported higher work satisfaction. However, 50% of WFH group chose to return to office after the experiment, citing isolation.
Limitations: Single company, predominantly call-center work, self-selected volunteers

Study 2: Gibbs et al. (2023)
Title: "Work from Home and Productivity: Evidence from Personnel Analytics"
Methodology: Observational study using personnel data from a large Asian IT company
Sample: 10,000+ employees tracked over 2 years (pre and post COVID)
Key Findings: WFH employees worked 18% more hours but produced 4% less output per hour. Total output was roughly equivalent. Communication costs increased by 50%. Mentoring and feedback decreased significantly for junior employees.
Limitations: Single industry (IT), cultural factors may limit generalizability

Study 3: Emanuel and Harrington (2023)
Title: "Working Remotely? Selection, Treatment, and Market for Remote Work"
Methodology: Natural experiment using call-center data, before and after COVID transition
Sample: 600+ workers across multiple call centers
Key Findings: Workers who chose remote work were 10% more productive than office counterparts. However, when remote work was imposed on all workers, productivity gains disappeared. Self-selection bias explained most of the observed productivity advantage of remote work.
Limitations: Call-center setting, limited task complexity`,
      },
      {
        fileName: "Methodology Comparison.pdf",
        content: `Methodological Comparison Across Studies

Research Design Approaches
The three studies employ fundamentally different research designs, which affects the strength of their conclusions. Bloom et al. used a randomized controlled trial (RCT), the gold standard for causal inference. Gibbs et al. used an observational design with before-after comparison, which is susceptible to confounding from the COVID pandemic. Emanuel and Harrington used a natural experiment, which falls between RCT and observational studies in causal strength.

Measurement of Productivity
Each study measures productivity differently. Bloom et al. used calls handled per minute, a narrow task-specific metric. Gibbs et al. used a composite output measure normalized by hours worked. Emanuel and Harrington used revenue generated per hour. These different operationalizations make direct comparison difficult and may explain some contradictory findings.

Sample Characteristics
All three studies focus on relatively structured, measurable work (call centers, IT services). None examine creative work, research, or strategic roles where productivity is harder to measure. The geographic concentration (China and US) limits cross-cultural generalizability. Sample sizes range from 249 to 10,000+, with larger studies enabling more nuanced subgroup analyses.

Temporal Context
Bloom et al. was conducted pre-COVID, when remote work was novel. Gibbs et al. spans the COVID transition, introducing pandemic-related confounds. Emanuel and Harrington examines the transition period specifically. The evolution of remote work tools and norms over this period means findings may not apply equally to the current post-pandemic landscape.`,
      },
      {
        fileName: "Research Gap Analysis.pdf",
        content: `Research Gaps and Future Directions

Identified Gaps in Current Literature

1. Creative and Knowledge Work
All reviewed studies focus on routine, measurable tasks. There is minimal rigorous research on remote work's impact on creative output, innovation, and strategic thinking. Future studies should examine how distributed teams perform on open-ended problems requiring collaboration and divergent thinking.

2. Long-Term Effects
Most studies cover periods of 6 months to 2 years. The long-term effects of remote work on career development, organizational culture, and employee well-being remain understudied. Longitudinal studies tracking workers over 5-10 years would provide valuable insights.

3. Hybrid Work Models
The current body of research primarily compares full-time remote vs. full-time office work. Hybrid arrangements (2-3 days remote per week), which are now the most common model, have limited rigorous evaluation. Initial evidence suggests hybrid models may capture most productivity benefits while mitigating isolation concerns.

4. Equity and Inclusion
Remote work access varies by occupation, income level, and demographic characteristics. The literature lacks investigation into whether remote work policies exacerbate or reduce workplace inequities. Caregivers, disabled workers, and workers in different housing situations may experience remote work very differently.

5. Management Practices
The role of management quality in moderating remote work outcomes is underexplored. Preliminary evidence suggests that managers trained in remote team leadership achieve better outcomes, but rigorous studies are needed.

Synthesis of Current Evidence
The weight of evidence suggests remote work does not inherently harm productivity for structured tasks, but benefits are not universal. Self-selection, task type, management quality, and organizational support moderate outcomes. The field needs more diverse samples, longer time horizons, and examination of modern hybrid models.`,
      },
    ],
    quiz: [
      {
        question: "What is the primary challenge when comparing findings across studies?",
        options: ["Different font sizes", "Different definitions and measurements of productivity", "Different page counts", "Different publication years"],
        correctIndex: 1,
        explanation: "Studies operationalize productivity differently (calls per minute, composite output, revenue per hour), making direct comparison difficult.",
      },
      {
        question: "What is the most significant gap in remote work research?",
        options: ["Too many studies exist", "Lack of research on creative and knowledge work", "Studies are too long", "All studies agree"],
        correctIndex: 1,
        explanation: "Most rigorous studies focus on routine tasks. The impact of remote work on creative output and innovation is understudied.",
      },
    ],
    flashcards: [
      { front: "What is selection bias in remote work studies?", back: "Workers who choose remote work may be inherently more productive, making it appear that remote work causes productivity gains when it is actually self-selection." },
      { front: "RCT vs. observational study?", back: "RCTs randomly assign participants, enabling causal conclusions. Observational studies compare existing groups, which may differ in unmeasured ways." },
      { front: "What is the hybrid work gap in research?", back: "Most studies compare full-time remote vs. office. Hybrid models (2-3 days remote), now the most common arrangement, have limited rigorous evaluation." },
    ],
    report: [
      { heading: "Literature Synthesis", content: "Upload multiple academic papers to a single notebook. Cross-reference content to help identify patterns, contradictions, and gaps in the literature." },
      { heading: "Citation Tracking", content: "Ask about specific claims or findings to identify which papers support or contradict them, with direct citations." },
      { heading: "Research Gaps", content: "Query limitations and future work sections across papers to identify unexplored areas and potential research directions." },
    ],
    mindmap: {
      label: "Literature Review",
      children: [
        { label: "Collect", children: [{ label: "Papers" }, { label: "Theses" }, { label: "Reviews" }] },
        { label: "Synthesize", children: [{ label: "Themes" }, { label: "Methods" }, { label: "Findings" }] },
        { label: "Identify", children: [{ label: "Gaps" }, { label: "Trends" }, { label: "Contradictions" }] },
      ],
    },
  },
};

export function getFeaturedContent(slug: string): FeaturedStudioContent | null {
  return contentMap[slug] ?? null;
}
