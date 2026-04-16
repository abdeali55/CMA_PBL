**PRODUCT REQUIREMENTS DOCUMENT**

**Alumni Mentorship Matching Platform**

*Connecting Final-Year Students with Alumni Mentors*

|                      |                                |
|----------------------|--------------------------------|
| **Version:**         | 1.0                            |
| **Date:**            | April 2026                     |
| **Status:**          | Draft for Review               |
| **Target Audience:** | Engineering Team, Stakeholders |

**1. Executive Summary & Purpose**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>Platform Overview</strong></p>
<p>The Alumni Mentorship Matching Platform is a cloud-enabled web application that intelligently connects final-year college students with relevant alumni mentors. Using a smart matching algorithm based on career goals, fields of study, and professional interests, the platform eliminates the friction of manual networking and helps students make informed, confident transitions into their careers.</p></td>
</tr>
</tbody>
</table>

**1.1 Problem Statement**

Final-year students face significant challenges when transitioning from academic life to professional careers. Key problems include:

- Lack of structured guidance from experienced professionals in their target field.

- Inefficient, manual alumni outreach through LinkedIn or email with low response rates.

- No centralized platform where alumni are committed and available for mentorship.

- Students often lack clarity on career paths, interview preparation, and industry expectations.

- Colleges have no data-driven way to measure the impact of alumni engagement programs.

**1.2 Solution**

The platform addresses these problems by providing:

- Automated, intelligent mentor-mentee matching based on multi-dimensional criteria.

- Structured mentorship workflows including goal setting, meeting scheduling, and progress tracking.

- A centralized, cloud-hosted profile and communication hub for both students and alumni.

- Analytics dashboards for college administrators to track program effectiveness.

**1.3 Goals & Success Metrics**

| **Goal**         | **KPI**                        | **Target**            |
|------------------|--------------------------------|-----------------------|
| User Adoption    | Registered students & alumni   | 500+ in Year 1        |
| Matching Quality | Student satisfaction rating    | \>4.0 / 5.0           |
| Engagement       | Avg. meetings per matched pair | \>3 per semester      |
| Retention        | Alumni returning each semester | \>60%                 |
| Outcomes         | Students with job placement    | \>70% within 6 months |

**2. User Profiles**

The platform serves three distinct user roles. Each role has a tailored profile structure, set of permissions, and dedicated dashboard.

**2.1 Student Profile**

**2.1.1 Registration & Onboarding**

Students register using their institutional email address (verified via OTP). After verification, they complete a structured onboarding questionnaire to build their profile.

**2.1.2 Profile Fields**

| **Field**                   | **Type**           | **Required** |
|-----------------------------|--------------------|--------------|
| Full Name                   | Text               | Yes          |
| Institutional Email         | Email (Verified)   | Yes          |
| Department / Major          | Dropdown           | Yes          |
| Expected Graduation Year    | Year Picker        | Yes          |
| Current CGPA / GPA          | Numeric (Optional) | No           |
| Career Goals (Short-term)   | Multi-select tags  | Yes          |
| Career Goals (Long-term)    | Free text + tags   | Yes          |
| Preferred Industry / Domain | Multi-select       | Yes          |
| Skills & Technologies       | Tag input          | Yes          |
| Preferred Mentorship Style  | Single-select      | Yes          |
| Availability (days/times)   | Calendar widget    | Yes          |
| LinkedIn / GitHub URL       | URL                | No           |
| Resume / CV Upload          | PDF upload         | No           |

**2.2 Alumni Profile**

**2.2.1 Registration & Verification**

Alumni register using either their institutional alumni email or a verified personal email. The college\'s alumni cell verifies the profile manually or via automated graduation record lookup. A LinkedIn profile link is mandatory for verification.

**2.2.2 Profile Fields**

| **Field**                    | **Type**                  | **Required** |
|------------------------------|---------------------------|--------------|
| Full Name                    | Text                      | Yes          |
| Graduation Year & Department | Year + Dropdown           | Yes          |
| Current Job Title            | Text                      | Yes          |
| Current Employer             | Text + Company DB         | Yes          |
| Industry / Domain            | Multi-select              | Yes          |
| Years of Experience          | Numeric range             | Yes          |
| Skills & Expertise           | Tag input                 | Yes          |
| Areas Willing to Mentor      | Multi-select              | Yes          |
| Max. Mentees per Semester    | Number (1-5)              | Yes          |
| Preferred Meeting Mode       | Online / In-person / Both | Yes          |
| Availability Slots           | Calendar widget           | Yes          |
| Bio / Mentorship Philosophy  | Rich text (500 chars)     | Yes          |
| LinkedIn Profile URL         | URL (Verified)            | Yes          |

**2.3 Admin Profile (College Administrator)**

A third role is reserved for college administrators (alumni cells, placement officers). Admins can:

- Approve or reject alumni registrations.

- View all active mentorship pairs and their progress.

- Export analytics reports on platform usage and outcomes.

- Send bulk notifications and announcements to all users.

- Configure matching algorithm weights for their institution.

**3. Matching Algorithm**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>Algorithm Design Principle</strong></p>
<p>The matching engine uses a weighted multi-criteria scoring model. Each student-alumni pair receives a Compatibility Score (0-100). The top 5 alumni matches are surfaced to each student, ranked by score. Students can review profiles and send a mentorship request to their preferred match.</p></td>
</tr>
</tbody>
</table>

**3.1 Matching Criteria & Weights**

| **Matching Criterion**   | **Weight** | **Logic**                          |
|--------------------------|------------|------------------------------------|
| Career Goal Alignment    | 30%        | Cosine similarity on goal tags     |
| Industry / Domain Match  | 20%        | Exact + adjacent domain scoring    |
| Skills Overlap           | 20%        | Jaccard index on skill tag sets    |
| Department / Major Match | 10%        | Same dept = 1.0, adjacent = 0.5    |
| Availability Overlap     | 10%        | Calendar slot intersection count   |
| Mentorship Style Fit     | 5%         | Student preference vs alumni style |
| Alumni Capacity          | 5%         | Penalise if near mentee limit      |

**3.2 Score Calculation**

The Compatibility Score is calculated as:

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>Score = (0.30 x CareerGoal) + (0.20 x Industry) + (0.20 x Skills)</p>
<p>+ (0.10 x Department) + (0.10 x Availability)</p>
<p>+ (0.05 x MentorStyle) + (0.05 x Capacity)</p></td>
</tr>
</tbody>
</table>

Each sub-score is normalized to a 0--1 range before weighting. The final score is multiplied by 100 to yield a percentage. Admin can adjust weights per institution in the settings panel.

**3.3 Algorithm Workflow**

- Student completes profile and clicks \'Find My Mentor\'.

- System fetches all available alumni with remaining mentee capacity.

- For each alumni candidate, the compatibility score is computed.

- Top 5 matches are returned, sorted by descending score, with match explanation cards.

- Student reviews profiles, reads bios, and sends a mentorship request to one or more.

- Alumni accepts or declines within 7 days. If declined, next-best match is offered.

- Once accepted, a mentorship pair is created and onboarding flow begins.

**3.4 Cold Start Handling**

For alumni with no past mentoring history or incomplete profiles, the system applies:

- Department-only matching as a fallback when fewer than 3 criteria are filled.

- A \'New Mentor\' badge is displayed so students can opt in knowingly.

- Alumni are prompted via email to complete their profile to improve their match visibility.

**4. Cloud Storage Architecture**

**4.1 Cloud Infrastructure Overview**

| **Component**    | **Recommended Service**        | **Alternate (AWS)**      |
|------------------|--------------------------------|--------------------------|
| Primary Database | Google Cloud Firestore (NoSQL) | Amazon DynamoDB          |
| Relational Data  | Cloud SQL (PostgreSQL)         | Amazon RDS               |
| File Storage     | Google Cloud Storage (GCS)     | Amazon S3                |
| Authentication   | Firebase Authentication        | AWS Cognito              |
| Notifications    | Firebase Cloud Messaging       | AWS SNS / SES            |
| Hosting / CDN    | Firebase Hosting + Cloud CDN   | AWS Amplify + CloudFront |
| Analytics        | BigQuery + Looker Studio       | AWS QuickSight           |

**4.2 Data Models**

**4.2.1 Core Collections (Firestore)**

- **Collection:** users/{userId}

<!-- -->

- Stores shared fields: name, email, role (student/alumni/admin), profile_complete, created_at.

<!-- -->

- **Collection:** students/{studentId}

<!-- -->

- Stores student-specific fields linked to users/{userId} via foreign key.

<!-- -->

- **Collection:** alumni/{alumniId}

<!-- -->

- Stores alumni-specific fields, verification status, and mentee capacity.

<!-- -->

- **Collection:** matches/{matchId}

<!-- -->

- Stores compatibility scores, status (pending/active/completed), and pair metadata.

<!-- -->

- **Collection:** sessions/{sessionId}

<!-- -->

- Stores each scheduled meeting: time, mode, agenda, notes, and feedback.

<!-- -->

- **Collection:** feedback/{feedbackId}

<!-- -->

- Post-session ratings and qualitative feedback from both parties.

**4.3 File Storage Structure (GCS)**

| **Storage Path**                    | **Content**             |
|-------------------------------------|-------------------------|
| profiles/students/{id}/avatar.jpg   | Student profile picture |
| profiles/alumni/{id}/avatar.jpg     | Alumni profile picture  |
| resumes/{studentId}/resume.pdf      | Student CV / Resume     |
| session-notes/{sessionId}/notes.pdf | Uploaded session notes  |
| exports/admin/{reportId}.csv        | Admin analytics exports |

**4.4 Security & Access Control**

**4.4.1 Authentication**

- All users authenticate via Firebase Auth (email + OTP or Google OAuth).

- JSON Web Tokens (JWT) are issued on login with a 24-hour expiry.

- Refresh tokens are stored as HTTP-only cookies to prevent XSS attacks.

**4.4.2 Role-Based Access Control (RBAC)**

| **Resource**                  | **Student**  | **Alumni**   | **Admin**     |
|-------------------------------|--------------|--------------|---------------|
| Own Profile                   | Read / Write | Read / Write | Read          |
| Matched Mentor/Mentee Profile | Read         | Read         | Read          |
| Other User Profiles           | No Access    | No Access    | Read          |
| Session Data                  | Read / Write | Read / Write | Read          |
| Analytics & Reports           | No Access    | No Access    | Read / Export |
| Alumni Verification           | No Access    | No Access    | Read / Write  |

**4.4.3 Encryption & Compliance**

- All data is encrypted at rest using AES-256 and in transit using TLS 1.3.

- PII (emails, phone numbers) is stored in encrypted fields with access logging.

- Platform is designed to comply with India\'s DPDP Act 2023 and GDPR principles.

- Automated data retention policy: inactive accounts purged after 3 years with prior notice.

**5. Meeting Scheduling**

**5.1 Scheduling Features**

Once a mentorship pair is confirmed, both parties gain access to the Scheduling module. Core features include:

- Availability Sync: Both profiles define weekly availability windows during onboarding, which are stored as recurring calendar slots.

- Smart Slot Suggestion: The system suggests overlapping available slots from both parties, ranked by time-zone compatibility.

- Meeting Modes: Users choose between Video Call (Google Meet / Zoom link auto-generated), Phone Call, or In-Person.

- Agenda Builder: Before each meeting, the student fills in a structured agenda (topics, questions, goals). The alumni receives this 24 hours in advance.

- Rescheduling & Cancellation: Either party can reschedule with a minimum 12-hour notice; cancellations trigger an automated rebooking suggestion.

**5.2 Calendar Integrations**

| **Integration**   | **Method**                      | **Supported Platforms** |
|-------------------|---------------------------------|-------------------------|
| Google Calendar   | OAuth 2.0 + Google Calendar API | Web, Android, iOS       |
| Microsoft Outlook | Microsoft Graph API             | Web, Desktop, Mobile    |
| Apple Calendar    | .ics file export / CalDAV       | iOS, macOS              |
| Generic (.ics)    | RFC 5545 .ics download          | All platforms           |

**5.3 Notification System**

**5.3.1 Notification Channels**

- In-App Notifications: Real-time via WebSocket push (Bell icon in dashboard).

- Email Notifications: Transactional emails via SendGrid / Firebase Extensions.

- SMS / WhatsApp: Optional via Twilio integration for high-priority alerts.

**5.3.2 Notification Triggers**

| **Event**                       | **Notification Sent To**               |
|---------------------------------|----------------------------------------|
| Mentorship Request Received     | Alumni (Email + In-App)                |
| Request Accepted / Declined     | Student (Email + In-App)               |
| Meeting Booked                  | Both parties (Email + Calendar invite) |
| Meeting Reminder (24 hrs)       | Both parties (Email + In-App)          |
| Meeting Reminder (1 hr)         | Both parties (In-App + SMS optional)   |
| Agenda Submitted by Student     | Alumni (Email + In-App)                |
| Meeting Cancelled / Rescheduled | Both parties (Email + In-App)          |
| Feedback Request (post-session) | Both parties (Email + In-App)          |
| No Activity for 30 Days         | Both parties (Re-engagement email)     |

**6. Interaction Tracking & Feedback**

**6.1 Session Tracking**

Every mentorship session (meeting) is logged as a Session record in the cloud database. The following data is captured automatically and manually:

- Session ID, Pair ID, Scheduled Time, Actual Start/End Time.

- Meeting Mode (video/phone/in-person) and Platform used.

- Agenda topics submitted by the student before the session.

- Session Notes: Either party can upload or type notes post-meeting (stored in GCS).

- Completion Status: Completed, Cancelled (with reason), No-show.

**6.2 Feedback System**

**6.2.1 Post-Session Feedback (Both Parties)**

Within 24 hours of a completed session, both the student and alumni are prompted to submit structured feedback:

| **Feedback Field**     | **Input Type**    | **Description**                         |
|------------------------|-------------------|-----------------------------------------|
| Overall Session Rating | 1-5 Stars         | General satisfaction with the meeting   |
| Goal Progress Rating   | 1-5 Stars         | How much did the session advance goals? |
| Communication Quality  | 1-5 Stars         | Clarity and helpfulness of conversation |
| Would Recommend?       | Yes / No / Maybe  | For platform quality assurance          |
| Qualitative Comments   | Text (300 chars)  | Open-ended feedback notes               |
| Topics Covered         | Multi-select tags | For tracking goal completion trends     |
| Action Items           | Text list         | Next steps agreed upon in session       |

**6.3 Mentorship Lifecycle Tracking**

Each mentorship pair progresses through defined lifecycle stages:

- Matched: Pair created, awaiting first meeting.

- Active: At least one meeting completed, engagement ongoing.

- Milestone Reached: Student has met a defined goal (e.g., secured internship).

- Completed: Semester ended or both parties formally conclude the mentorship.

- Paused: Temporarily inactive with a scheduled re-engagement date.

- Closed: Pair dissolved (by mutual agreement or admin action).

**6.4 Analytics & Success Metrics**

**6.4.1 Student Dashboard Metrics**

- Number of sessions completed and total mentorship hours.

- Goal completion percentage tracked over time.

- Skill areas improved (based on self-rating at start vs. end of semester).

- Timeline of key milestones (resume reviewed, mock interview done, offer received).

**6.4.2 Alumni Dashboard Metrics**

- Total mentees mentored (current and historical).

- Average session rating received from mentees.

- Topics most frequently discussed across all sessions.

- Recognition badges earned (e.g., \'10 Sessions Milestone\', \'Top Mentor 2026\').

**6.4.3 Admin Analytics Dashboard**

- Platform-wide active pairs, session completion rates, and monthly engagement trends.

- Department-wise mentorship distribution and coverage gaps.

- Top-performing alumni mentors and most in-demand career domains.

- Student outcome tracking: internship secured, job offers, higher education admissions.

- Exportable reports in CSV and PDF formats for institutional reporting.

**7. Technical Specifications**

**7.1 Technology Stack**

| **Layer**       | **Technology**                      | **Justification**                   |
|-----------------|-------------------------------------|-------------------------------------|
| Frontend        | React.js + Tailwind CSS             | Component reuse, responsive design  |
| Backend         | Node.js + Express.js                | Fast REST API development           |
| Database        | Firestore (NoSQL) + PostgreSQL      | Flexible profiles + relational data |
| Auth            | Firebase Authentication             | Built-in OTP, OAuth, JWT            |
| File Storage    | Google Cloud Storage                | Scalable, secure blob storage       |
| Matching Engine | Python (Flask microservice)         | ML libraries, numpy, scikit-learn   |
| Notifications   | Firebase Cloud Messaging + SendGrid | Multi-channel delivery              |
| Hosting         | Firebase Hosting + Cloud Run        | Auto-scaling, low cold start        |

**7.2 Non-Functional Requirements**

- Performance: Page load time \< 2 seconds; matching engine response \< 3 seconds.

- Scalability: Architecture must support 10,000+ concurrent users via Cloud Run auto-scaling.

- Availability: Target 99.9% uptime SLA with automated failover across two GCP regions.

- Security: OWASP Top 10 compliance; quarterly penetration testing required.

- Accessibility: WCAG 2.1 Level AA compliant for all UI components.

- Mobile Responsiveness: Full feature parity on mobile browsers (iOS Safari, Android Chrome).

**7.3 System Architecture Diagram (Description)**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>Architecture Overview</strong></p>
<p>The system follows a 3-tier cloud-native architecture. The Frontend (React SPA) communicates with the Backend API (Node.js on Cloud Run) via HTTPS REST calls. The Matching Engine runs as a separate Python microservice. Both services read/write to Firestore and PostgreSQL. Firebase Auth issues JWT tokens validated at the API gateway layer. Cloud Storage handles all file assets. Firebase FCM and SendGrid handle notifications. BigQuery ingests anonymized event logs for analytics.</p></td>
</tr>
</tbody>
</table>

**7.4 Development Phases (Roadmap)**

| **Phase** | **Duration** | **Deliverables**                            | **Status** |
|-----------|--------------|---------------------------------------------|------------|
| Phase 1   | 6 Weeks      | Auth, Student & Alumni Profiles, Basic UI   | Planned    |
| Phase 2   | 4 Weeks      | Matching Engine v1, Match Display, Requests | Planned    |
| Phase 3   | 4 Weeks      | Scheduling, Calendar Sync, Notifications    | Planned    |
| Phase 4   | 3 Weeks      | Feedback System, Interaction Tracking       | Planned    |
| Phase 5   | 3 Weeks      | Admin Dashboard, Analytics, Reporting       | Planned    |
| Phase 6   | 2 Weeks      | UAT, Security Audit, Performance Testing    | Planned    |

**7.5 Out of Scope (v1.0)**

- Mobile native apps (iOS / Android) --- planned for v2.0.

- AI-generated mentor recommendations using LLMs.

- Integration with LinkedIn for auto-profile import.

- Group mentorship sessions (one alumni to many students simultaneously).

- Payment/donation system for alumni contributions.

*--- End of Document ---*

Alumni Mentorship Matching Platform \| PRD v1.0 \| April 2026
