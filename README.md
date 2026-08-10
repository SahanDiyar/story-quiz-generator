# Story & Question Generator

A web application built with Node.js, Express, and the Groq SDK that processes text stories and generates structured quiz files for Yad's application.

## Getting Started

These instructions will help you install and run the project on your local machine for development and testing.

### Prerequisites

Make sure you have the following installed on your computer:
* Node.js (v18 or higher)
* Git

### Installation

Follow these steps to set up the project locally:

1. Clone the repository to your local machine:
git clone [https://github.com/SahanDiyar/story-quiz-generator.git](https://github.com/SahanDiyar/story-quiz-generator.git)

2. Navigate to the project directory:
cd story-quiz-generator

3. Install project dependencies:
npm install

### Configuration

1. Create a .env file in the root directory of the project.
2. Add your Groq API key inside the .env file:
GROQ_API_KEY=your_actual_api_key_here

### Running the Application

1. Start the local development server:
node server.js

2. Open your web browser and navigate to:
http://localhost:3000

3. Paste your story, choose the number of questions, and click Generate File to download your quiz script!
