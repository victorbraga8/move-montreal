# 🚀 Move Track --- Intelligent Startup Evaluation Platform

Move Track is a multi-step startup evaluation platform built with React
and TypeScript, designed to automate structured startup assessment
through AI scoring and Airtable integration.

------------------------------------------------------------------------

## 🧠 Overview

Move Track transforms traditional startup application forms into an
intelligent evaluation engine.\
It collects structured data, validates inputs, applies AI-driven scoring
logic, and stores normalized results in Airtable.

Designed for:

-   Accelerators\
-   Early-stage funds\
-   Venture builders\
-   Innovation programs\
-   Structured selection processes

------------------------------------------------------------------------

## ⚙️ Tech Stack

-   React\
-   TypeScript\
-   Vite\
-   Zod (schema validation)\
-   AI integration (LLM scoring engine)\
-   Airtable API\
-   Modular domain-driven architecture

------------------------------------------------------------------------

## 🏗 Project Architecture

    src/
     ├── components/
     │    ├── ui/
     │    ├── generics/
     │    └── form-steps/
     ├── hooks/
     ├── lib/
     │    ├── move/
     │    │    ├── form/
     │    │    ├── ai/
     │    │    ├── airtable/
     │    │    └── utils/
     ├── provider/
     │    ├── validation/
     │    └── data/
     ├── types/
     └── main.tsx

### Domain Separation

**move/form** - Step configuration - Defaults - Cleaners - Draft
control - Constants

**move/ai** - Prompt builder - JSON normalization - Scoring engine -
Evaluation memo formatter - AI service layer

**move/airtable** - Payload mapping - Field normalization - Team-size
mapping - Airtable client

**validation/schema** - Centralized Zod schema - Type safety
enforcement - Friendly validation messages

------------------------------------------------------------------------

## 🧩 Core Features

### Multi-Step Intelligent Form

-   Controlled navigation
-   Centralized state via custom hook
-   Timeline UI
-   Modular step components

### Robust Validation

-   Strict typing
-   Safe number parsing
-   Null-safe normalization
-   Structured cleaners

### AI Scoring Engine

-   Structured evaluation prompt
-   JSON-safe response parsing
-   Score normalization
-   Decision logic (Rejected / Review / Approved)

### Airtable Integration

-   Clean field mapping
-   Payload normalization
-   Structured submission
-   Fail-safe handling

------------------------------------------------------------------------

## 📊 Scoring Logic

Evaluation considers:

-   Business model\
-   Stage\
-   Product-Solution Fit\
-   Team structure\
-   Market opportunity\
-   Execution gap\
-   Capital request

Decision ranges:

-   0--50 → Rejected\
-   51--75 → Review\
-   76--100 → Approved

------------------------------------------------------------------------

## 🔐 Environment Variables

Create a `.env` file:

    VITE_GEMINI_API_KEY=your_key_here
    VITE_AIRTABLE_API_KEY=your_key_here
    VITE_AIRTABLE_BASE_ID=appXXXXXXXXXXXX
    VITE_AIRTABLE_TABLE_NAME=TableName

------------------------------------------------------------------------

## ▶️ Running the Project

Install dependencies:

    npm install

Run development server:

    npm run dev

Build production:

    npm run build
    npm run preview

------------------------------------------------------------------------

## 🎯 Design Principles

-   Strong domain isolation\
-   No circular dependencies\
-   AI parsing safety\
-   Payload integrity\
-   Type-safe end-to-end flow\
-   Scalable structure

------------------------------------------------------------------------

## 🚀 Roadmap

-   Auto draft persistence\
-   Internal analytics dashboard\
-   Manual decision override system\
-   Multi-program configuration\
-   Export & reporting module

------------------------------------------------------------------------

## 🏆 Mission

Move Track aims to elevate startup evaluation from subjective and manual
processes into structured, comparable, auditable, and scalable decision
systems powered by AI.

------------------------------------------------------------------------

## 👨‍💻 Engineering Focus

Built with emphasis on:

-   Clean architecture\
-   Maintainability\
-   Scalability\
-   Robust data handling\
-   Production-ready structure

------------------------------------------------------------------------
