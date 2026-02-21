// Pre-generated studio content for featured notebooks.
// This content is curated by the DocChat team and displayed in read-only mode.

export interface FeaturedStudioContent {
  quiz: { question: string; options: string[]; correctIndex: number; explanation: string }[];
  flashcards: { front: string; back: string }[];
  report: { heading: string; content: string }[];
  mindmap: { label: string; children?: { label: string; children?: { label: string }[] }[] };
  /** Substantive text used to generate RAG chunks so the chat can answer questions. */
  content: string;
}

const contentMap: Record<string, FeaturedStudioContent> = {
  "getting-started": {
    content: `DocChat: Getting Started Guide

DocChat is an AI-powered research assistant that lets you upload documents and have natural conversations about their content. It uses Retrieval-Augmented Generation (RAG) technology to provide accurate, cited answers drawn exclusively from your uploaded materials.

Supported File Types
DocChat supports multiple document formats. PDF files up to 5MB can be uploaded and processed. Microsoft Word documents (DOCX) up to 10MB are supported. Plain text files (TXT) up to 500KB work well for notes and transcripts. Image files including JPEG, PNG, and WebP up to 5MB can be processed using OCR (Optical Character Recognition) to extract text from photographs of documents or screenshots.

How It Works
When you upload a document, DocChat processes it through several stages. First, the text is extracted from the file. Then the text is split into overlapping chunks of approximately 2000 characters each. Each chunk is converted into a numerical embedding using Google's text-embedding-004 model, which captures the semantic meaning of the text. These embeddings are stored in a PostgreSQL database with pgvector for efficient similarity search.

When you ask a question, your query is also converted to an embedding. DocChat finds the most semantically similar chunks from your documents and provides them as context to the AI model. The AI then generates a response based only on the retrieved document content, citing specific passages.

The Chat Interface
The center panel is where you interact with the AI. Type questions in natural language and receive answers with source citations. Each AI response includes references to the specific document passages used. You can copy messages, save responses as notes, and see similarity scores for cited sources.

The Sources Panel
The left panel manages your uploaded files. Drag and drop files or click to browse. Each file shows its processing status: a green dot means ready, amber means processing, and red indicates an error. You can view PDFs directly in the browser and delete files you no longer need.

The Studio Panel
The right panel offers AI-powered study tools. Generate flashcards for active recall practice. Create quizzes to test your understanding. Build structured reports summarizing the document. Visualize topic hierarchies with mind maps. Extract data tables from structured content. Create slide decks with key points. Listen to audio overviews of your documents.

Notebooks
DocChat organizes your work into notebooks. Each notebook can contain multiple source files. All documents in a notebook are searchable together, allowing cross-referencing between files. You can edit notebook titles, share notebooks with others, and export your work.

Privacy and Security
Your documents are stored securely in encrypted storage. Files are only accessible to you and anyone you explicitly share with. DocChat does not use your documents to train AI models. All processing happens server-side with secure API connections.

Tips for Best Results
Upload text-based PDFs rather than scanned images when possible. Ask specific, targeted questions for the most accurate answers. Use the Studio tools to generate study materials after uploading. Create separate notebooks for different projects or topics. Use the search feature on the dashboard to find notebooks quickly.`,
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
    content: `Research Paper Analysis with DocChat

Analyzing research papers is one of DocChat's strongest use cases. By uploading academic papers, you can ask targeted questions and receive answers grounded in the source material with precise citations.

Uploading Research Papers
Upload papers in PDF format for best results. Most academic papers downloaded from journals, arXiv, or institutional repositories are text-based PDFs that DocChat can process effectively. You can upload multiple papers to a single notebook to enable cross-referencing between them.

Extracting Key Findings
Ask DocChat questions like "What are the main findings of this paper?" or "Summarize the results section." The AI retrieves relevant passages and synthesizes an answer. Each response includes source citations so you can verify the information against the original text.

Understanding Methodology
Research methodology can be complex. Ask DocChat to explain the research design, sample size, data collection methods, or statistical techniques used. The AI breaks down technical language into clearer explanations while staying faithful to the original text.

Identifying Limitations
Every study has limitations. Ask DocChat "What limitations are acknowledged in this research?" or "What are the potential weaknesses of this study's methodology?" The AI identifies and cites relevant passages discussing limitations, threats to validity, and areas for future work.

Comparing Multiple Papers
Upload several related papers to one notebook. Then ask comparison questions: "How do the methodologies differ across these papers?" or "Do these papers reach similar conclusions?" DocChat cross-references content from all uploaded documents to provide comprehensive answers.

Literature Review Support
For literature reviews, upload the papers you are reviewing and use DocChat to identify common themes, contradictions, and gaps. The Studio's Data Table feature can help structure findings by extracting author, year, methodology, and key results from each paper.

Citation Tracking
Ask about specific claims to find which papers support them. For example, "Which paper discusses the impact of sample size on results?" DocChat identifies the relevant document and cites the specific passage.

Best Practices for Research Analysis
Use specific, targeted questions rather than broad queries. Reference specific sections when possible (e.g., "What does the methodology section describe?"). Upload complete papers rather than excerpts for best context. Use the Studio Report feature to generate structured summaries. Create separate notebooks for different research topics or projects.`,
    quiz: [
      {
        question: "What is the best approach for analyzing a research paper?",
        options: ["Read the conclusion only", "Skim the abstract", "Upload to DocChat and ask targeted questions", "Memorize the references"],
        correctIndex: 2,
        explanation: "DocChat can help you understand complex papers by answering specific questions with cited passages from the document.",
      },
      {
        question: "How can you compare findings across papers?",
        options: ["Create separate notebooks for each", "Upload all to one notebook and ask comparison questions", "Print them out", "Use a spreadsheet"],
        correctIndex: 1,
        explanation: "Uploading multiple papers to one notebook lets DocChat cross-reference findings when answering your questions.",
      },
    ],
    flashcards: [
      { front: "How to extract key findings?", back: "Ask DocChat: 'What are the main findings of this paper?' The AI will cite specific passages." },
      { front: "How to understand methodology?", back: "Ask: 'Explain the research methodology used in this study.' DocChat breaks down complex methods." },
      { front: "How to identify limitations?", back: "Ask: 'What limitations are mentioned in this research?' The AI highlights acknowledged gaps." },
    ],
    report: [
      { heading: "Research Workflow", content: "Upload your research papers to DocChat notebooks. The AI indexes the content for semantic search, allowing you to ask detailed questions and get cited answers from the source material." },
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
    content: `Meeting Notes Organizer with DocChat

Effective meeting management requires capturing, organizing, and acting on the information discussed. DocChat helps you process meeting notes, transcripts, and agendas to extract actionable insights.

Uploading Meeting Documents
Upload meeting notes in any supported format: PDF minutes, text transcripts, or Word documents. Upload agendas alongside notes for context. Multiple meetings can be uploaded to a single notebook for tracking discussions over time.

Extracting Action Items
One of the most valuable uses is extracting action items. Ask DocChat: "List all action items from these meeting notes with assigned owners and deadlines." The AI identifies commitments, assignments, and deliverables mentioned in the text. Each action item is cited with its source passage so you can verify accuracy.

Summarizing Discussions
Use the Studio Report feature to generate structured meeting summaries automatically. Alternatively, ask specific questions: "What were the main topics discussed?" or "Summarize the decisions made in this meeting." DocChat provides concise summaries grounded in the actual notes.

Tracking Decisions
Ask DocChat to identify and list decisions made during meetings. For example: "What decisions were finalized in this meeting?" or "What was agreed regarding the project timeline?" The AI extracts and cites specific decisions from your notes.

Cross-Meeting Analysis
Upload notes from multiple meetings to track how topics evolve. Ask questions like "How has the discussion about the budget changed across these meetings?" or "What recurring issues have been raised?" DocChat cross-references all uploaded documents.

Follow-Up Management
Generate follow-up lists by asking: "What items require follow-up from this meeting?" or "What deadlines were mentioned?" Use the Studio Flashcards feature to create quick-reference cards for key decisions and action items.

Best Practices
Upload notes promptly after meetings while context is fresh. Include attendee lists and dates in your notes for better tracking. Use separate notebooks for different project meetings. Generate Studio reports after each meeting for consistent documentation. Review action items before the next meeting by querying previous notes.`,
    quiz: [
      {
        question: "What is the most effective way to process meeting notes?",
        options: ["Manually summarize", "Upload to DocChat for AI-powered analysis", "Delete them", "Forward to everyone"],
        correctIndex: 1,
        explanation: "DocChat can analyze meeting notes to extract action items, decisions, and key discussion points.",
      },
    ],
    flashcards: [
      { front: "How to extract action items?", back: "Ask DocChat: 'List all action items from these meeting notes with assigned owners and deadlines.'" },
      { front: "How to summarize meetings?", back: "Use Studio's Report feature to auto-generate a structured summary of your meeting documents." },
      { front: "How to track decisions?", back: "Ask: 'What decisions were made in this meeting?' DocChat identifies and cites each decision." },
    ],
    report: [
      { heading: "Meeting Notes Workflow", content: "Upload meeting notes, transcripts, or agendas to DocChat. The AI helps you extract action items, summarize discussions, and track decisions across multiple meetings." },
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
    content: `Study Guide Builder with DocChat

DocChat transforms your study materials into interactive learning tools. Upload textbook chapters, lecture notes, or academic articles, then use AI-powered features to create comprehensive study guides.

Active Recall and Spaced Repetition
Active recall is a study technique where you actively retrieve information from memory rather than passively re-reading. Research shows this significantly improves long-term retention. DocChat's flashcard feature facilitates active recall by generating question-answer pairs from your study material.

Spaced repetition involves reviewing material at increasing intervals. Studies demonstrate that spacing out practice sessions over time leads to better retention than massing practice into a single session. Use DocChat-generated flashcards regularly, increasing the interval between review sessions as material becomes more familiar.

Generating Flashcards
Upload your study material and use the Studio Flashcards feature. DocChat analyzes the content and generates front-back card pairs covering key concepts, definitions, and relationships. These cards are drawn directly from your uploaded text, ensuring relevance to your specific course material.

Creating Practice Quizzes
The Studio Quiz feature generates multiple-choice questions from your documents. Each question includes four options, a correct answer, and an explanation citing the source material. Use these quizzes for self-testing before exams to identify areas that need more review.

Mind Mapping
Visual organization of concepts aids understanding and memory. DocChat's Mind Map feature creates hierarchical visualizations showing relationships between topics in your study material. Mind maps help you see the big picture and understand how individual concepts connect.

Structured Reports
Generate summary reports from your textbook chapters or lecture notes. Reports include organized sections with headings and content, providing a condensed overview of the material. These make excellent review documents for quick study sessions.

Exam Preparation Strategy
Start by uploading all relevant course materials to a single notebook. Ask DocChat specific questions about difficult topics to test your understanding. Generate flashcards for memorization-heavy content. Create quizzes for self-assessment. Review mind maps to understand topic relationships. Use reports for final review before the exam.

Tips for Effective Studying
Ask specific questions rather than broad ones. Break large documents into chapter-by-chapter notebooks for focused study. Use the quiz feature to identify weak areas, then ask DocChat for deeper explanations of those topics. Combine flashcards with active recall sessions for best retention.`,
    quiz: [
      {
        question: "How can DocChat help with exam preparation?",
        options: ["It takes exams for you", "It generates study materials from your textbooks", "It schedules study time", "It contacts professors"],
        correctIndex: 1,
        explanation: "Upload your textbook chapters and DocChat's Studio generates quizzes, flashcards, and summaries to help you study.",
      },
      {
        question: "What is the most effective study material to generate?",
        options: ["Only summaries", "A combination of flashcards, quizzes, and mind maps", "Only flashcards", "Only practice tests"],
        correctIndex: 1,
        explanation: "Using multiple study formats (active recall with flashcards, testing with quizzes, visual organization with mind maps) improves retention.",
      },
    ],
    flashcards: [
      { front: "Active Recall", back: "A study technique where you actively retrieve information from memory. DocChat flashcards facilitate this." },
      { front: "Spaced Repetition", back: "Reviewing material at increasing intervals. Use DocChat-generated flashcards regularly for best results." },
      { front: "Mind Mapping", back: "Visual organization of concepts. DocChat's mind map feature creates hierarchical visualizations from your study material." },
    ],
    report: [
      { heading: "Study Guide Creation", content: "Upload your textbook chapters, lecture notes, or study materials. DocChat indexes the content and makes it searchable through natural language queries." },
      { heading: "Active Learning", content: "Use the Studio to generate quizzes for self-testing, flashcards for active recall, and mind maps for visual organization of concepts." },
      { heading: "Exam Preparation", content: "Ask DocChat specific questions about the material. Use the quiz feature to test your understanding. Review flashcards regularly using spaced repetition." },
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
    content: `Data Analysis Workspace with DocChat

DocChat helps you understand and question data analysis documents, research reports, and statistical findings. Upload your data reports and use AI to extract insights, explain methodology, and structure findings.

Understanding Statistical Reports
Upload data analysis reports, statistical summaries, or research findings in PDF or text format. Ask DocChat to explain specific statistical findings in plain language. For example: "Explain the regression results in section 3" or "What does the p-value of 0.03 mean in this context?" The AI cites exact passages while making technical content accessible.

Extracting Data Tables
The Studio Data Table feature automatically identifies and structures tabular data from your documents. It extracts key figures, statistics, and data points into organized tables. This is useful for comparing metrics across different sections or time periods.

Creating Visual Summaries
The Studio Infographic feature generates visual summaries of key statistics and findings. These condensed visual representations help communicate data insights to stakeholders or team members who may not read the full report.

Methodology Review
Ask DocChat to explain the data collection methods, sampling techniques, and analytical approaches described in your documents. Questions like "How was the data collected?" or "What statistical tests were used?" yield cited explanations from the source material.

Trend Identification
Upload multiple data reports to identify trends over time. Ask questions like "How have the key metrics changed across these reports?" or "What patterns appear in the quarterly data?" DocChat cross-references all uploaded documents to provide comprehensive answers.

Report Generation
Use the Studio Report feature to generate structured summaries of data analysis documents. Reports organize findings by topic, making it easier to review and share key insights. The generated reports cite specific passages from your source documents.

Best Practices
Upload complete data reports rather than excerpts for full context. Ask specific questions about particular metrics or findings. Use Data Table generation to structure quantitative information. Combine multiple reports in one notebook for trend analysis. Generate Infographics for stakeholder presentations.`,
    quiz: [
      {
        question: "How can DocChat help with data analysis documents?",
        options: ["It runs statistical tests", "It helps you understand and question data reports", "It creates databases", "It visualizes real-time data"],
        correctIndex: 1,
        explanation: "Upload data reports and analysis documents, then ask DocChat to explain findings, methodology, and implications.",
      },
    ],
    flashcards: [
      { front: "How to understand statistics in reports?", back: "Ask DocChat to explain specific statistical findings in plain language. It cites the exact passages." },
      { front: "How to extract data tables?", back: "Use Studio's Data Table feature to automatically extract and structure tabular data from your documents." },
      { front: "How to create visual summaries?", back: "Use Studio's Infographic feature to generate visual summaries of key statistics and findings." },
    ],
    report: [
      { heading: "Data Analysis Workflow", content: "Upload research data reports, statistical analyses, or data documentation to DocChat. The AI helps you understand complex findings and extract structured information." },
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
    content: `Legal Document Review with DocChat

DocChat assists in analyzing contracts, agreements, policies, and other legal documents. Upload your legal documents and ask targeted questions to identify key clauses, obligations, and potential areas of concern.

Contract Analysis
Upload contracts in PDF or DOCX format. DocChat indexes the full text, allowing you to ask about specific clauses without reading the entire document manually. Ask questions like "What are the payment terms?" or "What is the governing law clause?" The AI cites exact sections from the contract.

Identifying Key Obligations
Ask DocChat to list all obligations and responsibilities for each party. For example: "List all obligations of the service provider under this agreement" or "What are the client's payment obligations?" The AI extracts and organizes contractual commitments with citations.

Risk Assessment
Identify potential risks by asking about liability limits, indemnification clauses, and force majeure provisions. Questions like "What are the liability limitations in this contract?" or "Is there a force majeure clause, and what does it cover?" help you assess legal exposure.

Termination Provisions
Understanding exit conditions is critical. Ask DocChat: "What are the termination conditions and notice periods?" or "Under what circumstances can either party terminate this agreement?" The AI identifies and cites termination clauses.

Comparing Contract Versions
Upload multiple versions of a contract to the same notebook. Ask: "What are the differences between these two documents?" or "How have the payment terms changed between versions?" DocChat cross-references both documents to highlight changes.

Compliance Review
For policy documents, ask DocChat about specific compliance requirements. Questions like "What data protection requirements are specified?" or "What are the reporting obligations?" help identify compliance duties.

Due Diligence
During due diligence, upload multiple legal documents to a single notebook. Ask cross-cutting questions like "What representations and warranties are made across these agreements?" or "Are there any non-compete clauses?" DocChat searches all uploaded documents simultaneously.

Important Note
DocChat is an AI assistant and should not replace professional legal advice. Always consult with a qualified attorney for legal decisions. DocChat helps you understand document content but does not provide legal opinions or interpretations.`,
    quiz: [
      {
        question: "What is the best way to analyze a contract with DocChat?",
        options: ["Read the entire contract manually", "Upload and ask targeted questions about specific clauses", "Only read the signature page", "Use a search engine"],
        correctIndex: 1,
        explanation: "DocChat can analyze contracts by answering questions about specific clauses, obligations, and terms with cited references.",
      },
      {
        question: "How can you identify risks in a legal document?",
        options: ["Look for bold text", "Ask DocChat to identify liability clauses and obligations", "Count the pages", "Check the font size"],
        correctIndex: 1,
        explanation: "Ask targeted questions about liability, indemnification, termination clauses, and obligations to identify potential risks.",
      },
    ],
    flashcards: [
      { front: "How to extract key obligations?", back: "Ask DocChat: 'List all obligations and responsibilities defined in this contract for each party.'" },
      { front: "How to find termination clauses?", back: "Ask: 'What are the termination conditions and notice periods in this agreement?'" },
      { front: "How to compare contract versions?", back: "Upload both versions to the same notebook and ask: 'What are the differences between these two documents?'" },
    ],
    report: [
      { heading: "Contract Analysis", content: "Upload contracts, agreements, or legal documents to DocChat. The AI helps identify key clauses, obligations, and potential areas of concern." },
      { heading: "Risk Assessment", content: "Ask about liability limits, indemnification, force majeure, and termination provisions. DocChat cites exact clauses from the document." },
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
    content: `Product Specs Analyzer with DocChat

DocChat helps product managers, engineers, and designers analyze product requirement documents (PRDs), feature specifications, and technical designs. Upload your specs and use AI to extract requirements, identify dependencies, and generate structured summaries.

Analyzing PRDs
Upload product requirement documents in PDF, DOCX, or text format. DocChat processes the full document, making every section searchable through natural language queries. Ask questions like "What are the P0 features?" or "What is the acceptance criteria for the search feature?"

Extracting Feature Requirements
Ask DocChat to list all features described in a PRD with their acceptance criteria. The AI identifies feature descriptions, user stories, success metrics, and technical requirements. Each extracted item cites the specific section where it was found.

Identifying Dependencies
Understanding dependencies between features is critical for planning. Ask: "What dependencies and prerequisites are mentioned for each feature?" or "Which features must be completed before the notification system can be built?" DocChat identifies explicit and implicit dependencies from the document.

User Story Extraction
Ask DocChat to extract user stories in standard format. For example: "List all user stories mentioned in this document" or "What are the user stories for the authentication feature?" The AI identifies user stories and acceptance criteria with citations.

Technical Requirements
For technical design documents, ask about architecture decisions, API contracts, database schemas, or infrastructure requirements. DocChat can explain technical specifications and identify constraints mentioned in the documentation.

Priority Analysis
Ask about feature prioritization: "What are the P0 and P1 features?" or "Which features are marked as must-have versus nice-to-have?" DocChat identifies and cites prioritization information from your specs.

Sprint Planning Support
Upload sprint planning documents alongside PRDs. Ask DocChat to help estimate scope: "What are the deliverables for this sprint?" or "Which features have the most dependencies?" Use the Data Table feature to create structured views of requirements.

Cross-Document Analysis
Upload multiple spec documents to one notebook for cross-referencing. Ask: "How do the requirements in the PRD align with the technical design?" or "Are there any features mentioned in the PRD that are not covered in the technical spec?"`,
    quiz: [
      {
        question: "How can DocChat help with product requirements?",
        options: ["It writes code", "It helps analyze and question PRD content", "It designs UI", "It runs tests"],
        correctIndex: 1,
        explanation: "Upload PRDs and specs to DocChat, then ask questions about features, requirements, acceptance criteria, and priorities.",
      },
    ],
    flashcards: [
      { front: "How to extract feature requirements?", back: "Ask DocChat: 'List all features described in this PRD with their acceptance criteria.'" },
      { front: "How to identify dependencies?", back: "Ask: 'What dependencies and prerequisites are mentioned for each feature?'" },
      { front: "How to summarize priorities?", back: "Ask: 'What are the P0 and P1 features in this document?' DocChat cites the prioritization." },
    ],
    report: [
      { heading: "PRD Analysis", content: "Upload product requirement documents, feature specs, or technical designs. DocChat indexes the content for detailed querying." },
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
    content: `Literature Review Assistant with DocChat

Conducting a literature review requires reading, analyzing, and synthesizing findings across multiple academic papers. DocChat streamlines this process by enabling cross-referencing, comparison, and structured analysis of your paper collection.

Building Your Paper Collection
Upload all relevant papers to a single notebook. DocChat supports PDF format, which is standard for academic papers. Having multiple papers in one notebook enables cross-referencing and comparison queries that work across all uploaded documents simultaneously.

Synthesizing Findings
Ask DocChat to identify common themes, patterns, and findings across papers. Questions like "What themes appear across multiple papers?" or "What do these papers collectively conclude about the effectiveness of the intervention?" enable synthesis that would take hours to do manually.

Comparing Methodologies
Understanding methodological differences is essential for a literature review. Ask: "Compare the research methodologies used across these papers" or "Which papers use qualitative versus quantitative methods?" DocChat identifies and compares approaches described in each paper.

Identifying Research Gaps
Ask about limitations and future work mentioned across papers. Questions like "What limitations are acknowledged in these studies?" or "What areas for future research are suggested?" help identify gaps in the existing literature. This is valuable for positioning your own research.

Finding Contradictions
Ask DocChat to identify conflicting findings: "Do any papers reach contradictory conclusions?" or "What disagreements exist in the literature about this topic?" The AI highlights where authors disagree and cites the specific claims.

Building a Literature Matrix
Use the Studio Data Table feature to extract structured information from each paper: author, year, methodology, sample size, key findings, and limitations. This creates a literature matrix that serves as the backbone of your review.

Citation Tracking
Ask about specific claims to find supporting evidence across papers. For example: "Which papers discuss the impact of remote work on productivity?" DocChat identifies all relevant papers and cites specific passages supporting or contradicting the claim.

Generating Structured Reviews
Use the Studio Report feature to generate an organized summary of your paper collection. The report structures findings by topic, making it easier to draft your literature review. Combine this with mind maps to visualize the conceptual landscape of your research area.

Writing Your Review
After using DocChat to analyze your papers, you have a foundation for writing. Use the extracted themes as section headings. Use comparative analyses as the basis for discussion paragraphs. Use identified gaps as motivation for your research contribution.`,
    quiz: [
      {
        question: "What is the most effective way to synthesize multiple papers?",
        options: ["Read abstracts only", "Upload all papers to one notebook and ask comparison questions", "Read one paper at a time", "Only look at citations"],
        correctIndex: 1,
        explanation: "Uploading multiple papers to one notebook lets DocChat cross-reference findings, methodologies, and conclusions.",
      },
      {
        question: "How can DocChat help identify research gaps?",
        options: ["It cannot", "Ask about limitations and future work mentioned across papers", "It generates new hypotheses", "It contacts researchers"],
        correctIndex: 1,
        explanation: "Ask DocChat to summarize limitations and suggested future work from each paper to identify gaps in the research.",
      },
    ],
    flashcards: [
      { front: "How to compare methodologies?", back: "Ask DocChat: 'Compare the research methodologies used across these papers. What are the similarities and differences?'" },
      { front: "How to find common themes?", back: "Ask: 'What themes or findings appear across multiple papers in this collection?'" },
      { front: "How to build a literature matrix?", back: "Use Studio's Data Table to extract author, year, methodology, and findings from each paper into a structured table." },
    ],
    report: [
      { heading: "Literature Synthesis", content: "Upload multiple academic papers to a single notebook. DocChat can cross-reference content to help you identify patterns, contradictions, and gaps in the literature." },
      { heading: "Citation Tracking", content: "Ask about specific claims or findings and DocChat identifies which papers support or contradict them, with direct citations." },
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
