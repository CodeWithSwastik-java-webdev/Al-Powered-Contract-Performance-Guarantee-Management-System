Read and strictly follow these documents before making any changes:

- docs/product-requirements.md
- docs/design-system.md
- docs/system-architecture.md
- .github/copilot-instructions.md

Do not violate any rules defined in these documents.

------------------------------------------------------------

ROLE

You are a Principal Software Engineer, Enterprise UI/UX Designer and Security Architect.

Your task is ONLY to implement and improve the Authentication module.

Do not modify Dashboard, Contracts, CPG, Reports, AI or unrelated modules.

------------------------------------------------------------

FIRST TASK

Before writing code:

Analyze the current authentication implementation.

Generate a report containing:

- Existing Features
- Missing Features
- Broken Features
- UI Problems
- Backend Problems
- Database Problems
- Security Problems

Do not modify anything until the analysis is complete.

------------------------------------------------------------

AUTHENTICATION REQUIREMENTS

The application does NOT have a traditional Register page.

The Login page contains:

Login Card

↓

"New to POWERGRID?"

↓

Request Access

Clicking Request Access opens a Registration Wizard.

------------------------------------------------------------

LOGIN PAGE

Create a premium enterprise login experience.

Theme

Soft White

Soft Green

Light Grey

POWERGRID branding.

Layout

Split Screen

LEFT

Enterprise Illustration

Title

AI-Powered Contract Performance Guarantee Management System

Subtitle

Enterprise platform for Contract Performance Guarantee lifecycle management, AI-powered risk analysis and contractor onboarding.

Feature Chips

✓ Secure Authentication

✓ AI Risk Intelligence

✓ Contract Lifecycle

✓ Enterprise Dashboard

RIGHT

Glassmorphism Login Card

POWERGRID Logo

Welcome Back

Official Email

Password

Show / Hide Password

Remember Me

Forgot Password

Large Login Button

Divider

New to POWERGRID?

Request Access

Smooth Framer Motion animations.

------------------------------------------------------------

REQUEST ACCESS

Clicking Request Access opens a 5-step Registration Wizard.

No standalone Register page.

------------------------------------------------------------

STEP 1

Choose Category

POWERGRID Employee

Contractor / Vendor

Display beautiful selectable cards.

------------------------------------------------------------

STEP 2

Employee Form

Full Name

Employee ID

Official Email

Phone Number

Department

Designation

Region

Password

Confirm Password

Contractor Form

Company Name

Authorized Person

Official Email

Phone Number

Office Address

GST Number

PAN Number

Company Website

Password

Confirm Password

------------------------------------------------------------

STEP 3

Upload Documents

Drag & Drop

Cloudinary Upload

GST Certificate

Company Registration

PAN

Company Profile

Employee ID Card (optional)

Upload Progress

Preview

Delete

------------------------------------------------------------

STEP 4

Review

Display all entered information.

Allow editing.

------------------------------------------------------------

STEP 5

Submit

Store Registration Request.

Status

PENDING_APPROVAL

Store documents in Cloudinary.

Store metadata in Railway PostgreSQL.

Passwords must be stored only in Firebase Authentication.

------------------------------------------------------------

SUCCESS PAGE

After submission

DO NOT redirect to Login.

Show a dedicated success screen.

Title

Registration Submitted Successfully

Message

Your request has been submitted successfully.

An administrator will review your application before activating your account.

Timeline

Submitted

↓

Verification

↓

Administrator Review

↓

Approval

↓

Login

Buttons

Return to Login

Contact Administrator

------------------------------------------------------------

LOGIN VALIDATION

After Firebase Authentication

↓

Backend verifies JWT

↓

Fetch user from Railway PostgreSQL

↓

Check Status

ACTIVE

Allow Login

PENDING_APPROVAL

Show dedicated Pending Approval page.

REJECTED

Show rejection reason.

DISABLED

Show Account Disabled page.

------------------------------------------------------------

ADMIN REGISTRATION REVIEW

Create a Registration Requests page.

Pending

Approved

Rejected

Admin can

Approve

Reject

Request More Information

Admin sees

Name

Email

Phone

Employee ID

Company

GST

PAN

Documents

Submission Date

Status

Admin must NEVER see passwords.

------------------------------------------------------------

UI REQUIREMENTS

Modern

Minimal

Professional

Elegant

Enterprise

Use

Tailwind

ShadCN

Framer Motion

Lucide Icons

Responsive

Reusable Components

------------------------------------------------------------

OUTPUT

1. Analyze existing authentication module.

2. Suggest improvements.

3. Wait for approval.

4. Implement module.

5. Summarize changed files.

Do not modify unrelated modules.