# Hostel Gatepass Management System 🏫

**Built for:** Indian Institute of Information Technology (IIIT)  
**Developed by:** K. Raghuveer and B. Tharun Reddy  

---

## 🚀 Project Status
> **Current Phase: Active Development (Creating Endpoints)**  
> This system is being architected as a **highly stable, production-level** application. It incorporates advanced features to ensure security, scalability, and an intuitive user experience.

---

## 📖 Overview
The Hostel Gatepass Management System is a proposed digital platform that automates and streamlines the process of granting, approving, tracking, and auditing student movement in and out of hostel premises. It replaces manual paper-based processes with a structured digital workflow, ensuring enhanced security, transparency, and accountability across all stakeholders.

## 👥 Stakeholders & Roles
- **Student (Primary User):** Raises, views, and withdraws gatepass requests. Presents QR code at the gate.
- **Parent (External Approver):** Receives notification for Home Passes, approves or rejects via the portal.
- **Caretaker (Hostel-Block-Approver):** Gives final approval or rejection for all pass types.
- **Warden (Hostel Manager):** Blocks/unblocks students, monitors violations, views audit logs.
- **Chief Warden (Institution Head):** Manages global hostel rules (curfew times, pass durations, advance notice).
- **Security (Gate Officer):** Scans QR code on student exit (Outscan) and return (Inscan).

## ✨ Key Features (Functional Requirements)

### 1. Advanced Role Management
- Strict role-based access control ensuring users only access permitted screens and actions.
- No cross-role data visibility (e.g., caretakers only see their assigned block).

### 2. Streamlined Gatepass Workflow
- **Day Pass:** Auto-approved at the caretaker level within seconds with instant QR code generation.
- **Home Pass:** Requires a full approval chain (Student → Parent → Caretaker) before QR generation.
- Students can withdraw pending passes.
- Comprehensive pass records: destination, purpose, transport mode, expected/actual timestamps.

### 3. Smart QR Code & Gate Scanning
- Cryptographically unique, single-use QR codes generated per approved pass.
- **Outscan:** Security scans on exit (status: Active).
- **Inscan:** Security scans on return (status: Completed).
- Automatic violation flagging for late returns.

### 4. Comprehensive Audit Trail
- Every state change (submission, approval, rejection, outscan, inscan) is recorded.
- Wardens and caretakers have full visibility into the pass history for auditing.

### 5. Automated Violation & Disciplinary Blocking
- Late returns increment a student's defaulter attempt count.
- Automatic blocking upon exhausting maximum allowed attempts.
- Manual block/unblock capabilities for Wardens, with Chief Warden override authority.

### 6. Dynamic Global Rule Configuration
- Chief Warden can dynamically update rules (curfew, pass durations, advance notice) without system redeployment or code changes.

## ⚙️ Non-Functional Requirements
- **Performance:** Gate scan operations (Outscan/Inscan) reflect updated status within 2 seconds.
- **Security:** QR codes are cryptographically unique, bound to specific passes, and tamper-proof.
- **Reliability:** Strict enforcement of approval chains; skipping steps is impossible.
- **Scalability:** System handles concurrent submissions and scans without degradation.
- **Usability:** Security personnel can complete a gate scan in under 5 seconds with zero training.
- **Maintainability:** Fully configurable rules via UI.

## 🗄️ Database Schema Entities
- **USERS:** Stores all system actors.
- **STUDENTS:** Extends USERS, linked to a hostel block and parent contact details.
- **Hostel Block:** Manages blocks and respective authorities.
- **PASSES:** Central table for Gate Pass descriptions, status, and types.
- **Pass_Actions:** Audit log for every action on a pass.
- **Blocked:** Records blocking events, roles, and timestamps.

*(ER Diagram & Use Case diagrams are available in the project repository: `er.png`, `usecase.png`)*

## 🎨 UI / Figma Designs
High-fidelity designs and wireframes are produced in Figma:  
[View Figma Designs](https://www.figma.com/design/qaRD994mBFCMEE7lZrisFc/Gatepass-UI?node-id=15-2&t=DvaAYjbkghvHwCO0-1)
