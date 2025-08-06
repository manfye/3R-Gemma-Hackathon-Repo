# Product Requirements Document (PRD)
## Hand Tracker Photo App - Garbage Classification System

### 1. Executive Summary

**Product Name:** Hand Tracker Photo App - Garbage Classification System  
**Version:** 1.0  
**Date:** [Current Date]  
**Product Owner:** [Your Name/Team]  

**Product Vision:** Create an intelligent garbage classification system that uses computer vision and AI to help users properly categorize waste items through a simple hand gesture interface.

### 2. Product Overview

#### 2.1 Problem Statement
- Users often struggle to correctly classify different types of garbage for proper recycling
- Manual classification is time-consuming and error-prone
- Need for an automated, user-friendly solution that provides instant feedback

#### 2.2 Solution
A web-based application that:
- Detects hand gestures using MediaPipe
- Automatically captures photos after a countdown
- Uses OpenAI API to classify garbage types
- Provides instant feedback on proper disposal methods

#### 2.3 Target Users
- Environmentally conscious individuals
- Household users managing waste disposal
- Educational institutions teaching recycling
- Waste management facilities

### 3. Functional Requirements

#### 3.1 Core Features

**F3.1.1 Hand Detection**
- **Requirement:** The app must detect hand presence using MediaPipe
- **Acceptance Criteria:**
  - Hand detection activates within 2 seconds of hand appearing in frame
  - Works in various lighting conditions
  - Supports multiple hand positions

**F3.1.2 Countdown Timer**
- **Requirement:** Display 3-2-1 countdown when hand is detected
- **Acceptance Criteria:**
  - Countdown starts immediately after hand detection
  - Each number displays for 1 second
  - Visual and optional audio feedback
  - Timer can be cancelled by removing hand

**F3.1.3 Photo Capture**
- **Requirement:** Automatically capture photo after countdown completes
- **Acceptance Criteria:**
  - High-quality image capture (minimum 720p)
  - Photo saved locally and prepared for API transmission
  - Capture feedback (flash effect or sound)

**F3.1.4 OpenAI API Integration**
- **Requirement:** Send captured photo to OpenAI API for garbage classification
- **Acceptance Criteria:**
  - Uses specified prompt format
  - Handles API rate limits and errors gracefully
  - Returns JSON response as specified

**F3.1.5 Garbage Classification**
- **Requirement:** Classify garbage into 6 categories with part identification
- **Acceptance Criteria:**
  - Categories: Cardboard, Glass, Metal, Paper, Plastic, Trash
  - Identifies multiple parts of complex items
  - Returns JSON format as specified
  - Handles mixed materials appropriately

#### 3.2 User Interface Requirements

**F3.2.1 Webcam Interface**
- **Requirement:** Real-time webcam feed display
- **Acceptance Criteria:**
  - Responsive design (works on desktop and mobile)
  - Clear hand detection overlay
  - Countdown display overlay
  - Loading indicators during API calls

**F3.2.2 Results Display**
- **Requirement:** Show classification results clearly
- **Acceptance Criteria:**
  - Displays identified parts and materials
  - Shows proper disposal instructions
  - Option to retake photo
  - History of previous classifications

### 4. Technical Requirements

#### 4.1 Technology Stack

**T4.1.1 Frontend**
- HTML5, CSS3, JavaScript
- MediaPipe for hand tracking
- WebRTC for webcam access
- Canvas API for image processing

**T4.1.2 Backend Integration**
- OpenAI API (GPT-4 Vision or similar)
- RESTful API communication
- JSON data handling

**T4.1.3 Dependencies**
- MediaPipe JavaScript library
- OpenAI API client
- Modern web browser with camera support

#### 4.2 API Specifications

**T4.2.1 OpenAI API Integration**
```json
{
  "prompt": "Based on the image, what is the type of garbage?\nA: Cardboard\nB: Glass\nC: Metal\nD: Paper\nE: Plastic\nF: Trash\nplease output the as JSON format:\n{\"material\":[{\"part_name\":\"<part_name>\",\"answer\":\"<answer>\"},{\"part_name\":\"<part_name>\",\"answer\":\"<answer>\"}]}\n\nidentify the parts or part, then give appropriate answer.\nif it is classify, please consider it as trash",
  "response_format": "json"
}
```

**T4.2.2 Expected Response Format**
```json
{
  "material": [
    {
      "part_name": "cup",
      "answer": "D: Paper"
    },
    {
      "part_name": "lid", 
      "answer": "E: Plastic"
    }
  ]
}
```

### 5. Non-Functional Requirements

#### 5.1 Performance Requirements
- **N5.1.1 Response Time:** Hand detection within 2 seconds
- **N5.1.2 API Response:** Classification results within 10 seconds
- **N5.1.3 Image Quality:** Minimum 720p resolution
- **N5.1.4 Browser Compatibility:** Chrome, Firefox, Safari, Edge

#### 5.2 Security Requirements
- **N5.2.1 Data Privacy:** No permanent storage of user photos
- **N5.2.2 API Security:** Secure API key management
- **N5.2.3 HTTPS:** All communications over secure protocol

#### 5.3 Usability Requirements
- **N5.3.1 Accessibility:** WCAG 2.1 AA compliance
- **N5.3.2 Mobile Responsive:** Works on mobile devices
- **N5.3.3 Intuitive Interface:** No training required for basic use

### 6. User Stories

#### 6.1 Primary User Stories

**US1: Hand Detection**
- **As a** user
- **I want** the app to detect when my hand is in the camera view
- **So that** I can trigger the photo capture process

**US2: Countdown Timer**
- **As a** user
- **I want** to see a 3-2-1 countdown when my hand is detected
- **So that** I can prepare for the photo capture

**US3: Photo Capture**
- **As a** user
- **I want** the app to automatically take a photo after the countdown
- **So that** I can classify the garbage item

**US4: Garbage Classification**
- **As a** user
- **I want** to receive instant feedback on the type of garbage
- **So that** I can dispose of it properly

**US5: Multiple Parts Identification**
- **As a** user
- **I want** the app to identify different parts of complex items
- **So that** I can separate materials correctly

### 7. Acceptance Criteria

#### 7.1 Hand Detection
- [ ] Hand appears in camera view
- [ ] App detects hand within 2 seconds
- [ ] Countdown starts immediately
- [ ] Hand removal cancels countdown

#### 7.2 Photo Capture
- [ ] Countdown displays 3-2-1 sequence
- [ ] Photo captures automatically after countdown
- [ ] Image quality is at least 720p
- [ ] Photo is prepared for API transmission

#### 7.3 API Integration
- [ ] Photo sent to OpenAI API
- [ ] Correct prompt format used
- [ ] JSON response received
- [ ] Error handling for API failures

#### 7.4 Classification Results
- [ ] Results displayed clearly
- [ ] Multiple parts identified correctly
- [ ] Proper disposal instructions shown
- [ ] Option to retake photo available

### 8. Technical Implementation Plan

#### 8.1 Phase 1: Core Setup
- Set up HTML5 canvas and webcam access
- Implement MediaPipe hand detection
- Create basic UI layout

#### 8.2 Phase 2: Photo Capture
- Implement countdown timer
- Add photo capture functionality
- Handle image processing and storage

#### 8.3 Phase 3: API Integration
- Integrate OpenAI API
- Implement proper prompt formatting
- Add error handling and retry logic

#### 8.4 Phase 4: Results Display
- Create results display interface
- Add retake functionality
- Implement responsive design

#### 8.5 Phase 5: Testing & Optimization
- Cross-browser testing
- Performance optimization
- User experience improvements

### 9. Success Metrics

#### 9.1 Technical Metrics
- Hand detection accuracy: >95%
- API response time: <10 seconds
- Image classification accuracy: >90%
- Browser compatibility: 100% on major browsers

#### 9.2 User Experience Metrics
- User satisfaction score: >4.0/5.0
- Task completion rate: >90%
- Average session duration: >2 minutes
- Return user rate: >60%

### 10. Risk Assessment

#### 10.1 Technical Risks
- **R1:** MediaPipe compatibility issues
- **Mitigation:** Fallback to basic hand detection
- **R2:** OpenAI API rate limits
- **Mitigation:** Implement request queuing and caching

#### 10.2 User Experience Risks
- **R3:** Poor lighting affecting detection
- **Mitigation:** Add lighting indicators and guidance
- **R4:** Complex items not classified correctly
- **Mitigation:** Provide manual override options

### 11. Future Enhancements

#### 11.1 Phase 2 Features
- Multiple language support
- Offline classification capabilities
- Integration with local waste management systems
- Educational content about recycling

#### 11.2 Advanced Features
- Batch processing for multiple items
- Voice commands
- AR overlay for disposal instructions
- Community-driven classification improvements

### 12. Appendix

#### 12.1 API Documentation
- OpenAI API endpoint specifications
- Error code handling
- Rate limiting considerations

#### 12.2 UI/UX Wireframes
- Main interface layout
- Countdown display design
- Results page mockups

#### 12.3 Testing Strategy
- Unit testing for core functions
- Integration testing for API calls
- User acceptance testing plan
- Performance testing scenarios

---

**Document Version:** 1.0  
**Last Updated:** [Current Date]  
**Next Review:** [Date + 2 weeks] 